import { Provider } from './providers/provider.interface';
import { cast, BuiltInTypes } from './typecaster';
import { validateOrReject } from 'class-validator';
import { classToClass } from 'class-transformer';

export type ProvidersArray = { key: string; value: Provider }[];
export type ProvidersMap = Map<string, Provider>;

type Values = { provider: string; key: string; value: string };
type GrabberFn = (providers: ProvidersMap) => Values;

type Options = {
    providers: ProvidersArray;
    options?: {
        remoteConfigFetchTimeout?: number;
        override?: boolean;
        transform?: boolean;
        validate?: boolean;
    };
};

const defaultOptions = {
    transform: false,
    validate: false,
};

const tryToConvertToCorrectType = (target: any, key: string, value: string) => {
    const type: BuiltInTypes = Reflect.getMetadata('design:type', target, key).name;

    return cast(type, value);
};

export class ConfigLoader {
    static async load<T>(config: T, options: Options): Promise<T> {
        const providersMap: ProvidersMap = new Map<string, Provider>();
        options.options = options.options || defaultOptions;

        for (const { key, value } of options.providers) {
            providersMap.set(key, value);
        }

        await Promise.all([ConfigLoader.fillInFlatten(config, providersMap), ConfigLoader.fillInNested(config, providersMap)]);

        const { validate, transform } = options.options;

        if (transform) {
            config = classToClass(config);
        }

        if (validate) {
            await validateOrReject(config);
        }

        return config; // CAREFUL - mutation!
    }

    private static async fillInFlatten(config: any, providers: ProvidersMap) {
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

    private static async fillInNested(config: any, providers: ProvidersMap) {
        const nestedKeys = Reflect.getMetadata('nestedKeys', config) || [];

        const traverseAndFill = async (config1: any, nestedKeys1: string[]) => {
            if (!config1) return;
            for (const nestedKey of nestedKeys1) {
                const ctor = Reflect.getMetadata('design:type', config1, nestedKey);
                config1[nestedKey] = new ctor();

                const oneMoreNested = Reflect.getMetadata('nestedKeys', config1[nestedKey]);
                const grabbers: GrabberFn[] = Reflect.getMetadata('grabbers', config1, nestedKey) || [];
                const keyValues: Values[] = await Promise.all(grabbers.map(g => g(providers)));

                const providerKeys = [...providers.keys()];

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
