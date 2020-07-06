import { Provider } from './providers/provider.interface';

export type ProvidersMap = { [key: string]: Provider };

type Values = { provider: string; key: string; value: string };
type GrabberFn = (providers: ProvidersMap) => Values;

type Options = {
    config: any;
    providers: ProvidersMap;
    options?: {
        remoteConfigFetchTimeout?: number;
        override?: boolean;
    };
};

type BuiltInTypes = 'String' | 'Number' | 'Boolean';

const tryToConvertToCorrectType = (target: any, key: string, value: string) => {
    const type: BuiltInTypes = Reflect.getMetadata('design:type', target, key).name;

    const possibleTrue = ['true', 'TRUE', '1', true];
    const possibleFalse = ['false', 'FALSE', '0', false];

    switch (type) {
        case 'String':
            return value ? String(value) : value;
        case 'Number':
            return value ? Number(value) : value;
        case 'Boolean':
            if (possibleTrue.includes(value)) return true;
            if (possibleFalse.includes(value)) return false;
            return undefined;
        default:
            return value;
    }
};

export class ConfigLoader {
    //static async load1<T>(config: T, options: any): Promise<T> {
    //console.log(config, options);

    //}
    static async load(options: Options) {
        await Promise.all([ConfigLoader.fillInFlatten(options), ConfigLoader.fillInNested(options)]);

        return options.config; // CAREFUL - it mutates inner property of parameter
    }

    private static async fillInFlatten(options: Options) {
        const { config, providers } = options;
        const flattenGrabbers: GrabberFn[] = Reflect.getMetadata('grabbers', config) || [];

        const values: Values[] = await Promise.all(
            flattenGrabbers.map(g => {
                return g(providers);
            }),
        );

        for (const { key, value } of values) {
            config[key] = tryToConvertToCorrectType(config, key, value);
        }
    }

    private static async fillInNested(options: Options) {
        const { config, providers } = options;
        const nestedKeys = Reflect.getMetadata('nestedKeys', config) || [];

        const traverseAndFill = async (config1: any, nestedKeys1: string[]) => {
            if (!config1) return;
            for (const nestedKey of nestedKeys1) {
                const ctor = Reflect.getMetadata('design:type', config1, nestedKey);
                config1[nestedKey] = new ctor();

                const oneMoreNested = Reflect.getMetadata('nestedKeys', config1[nestedKey]);
                const grabbers: GrabberFn[] = Reflect.getMetadata('grabbers', config1, nestedKey) || [];
                const keyValues: Values[] = await Promise.all(grabbers.map(g => g(providers)));

                const providerKeys = Object.keys(providers);

                keyValues.sort((a, b) => {
                    const providerNameA = a.provider;
                    const providerNameB = b.provider;

                    return providerKeys.indexOf(providerNameA) - providerKeys.indexOf(providerNameB);
                });
                for (const { key, value } of keyValues) {
                    config1[nestedKey][key] = tryToConvertToCorrectType(config1[nestedKey], key, value);
                }

                if (oneMoreNested && oneMoreNested.length > 0) {
                    await traverseAndFill(config1[nestedKey], oneMoreNested);
                }
            }
        };

        await traverseAndFill(config, nestedKeys);
    }
}
