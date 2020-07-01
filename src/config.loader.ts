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

export class ConfigLoader {
    static async load(options: Options) {
        await Promise.all([ConfigLoader.fillInFlatten(options), ConfigLoader.fillInNested(options)]);

        return options.config; // mutate (foooo) - refactor this
    }

    private static async fillInFlatten(options: Options) {
        const { config, providers } = options;
        const flattenGrabbers: GrabberFn[] = Reflect.getMetadata('grabbers', config) || [];

        const values: Values[] = await Promise.all(
            flattenGrabbers.map(g => {
                return g(providers);
            }),
        );

        for (let { key, value } of values) {
            config[key] = value;
        }
    }

    private static async fillInNested(options: Options) {
        const { config, providers } = options;
        const nestedKeys = Reflect.getMetadata('nestedKeys', config) || [];
        for (let nestedKey of nestedKeys) {
            const grabbers: GrabberFn[] = Reflect.getMetadata('grabbers', config, nestedKey) || [];
            const keyValues: Values[] = await Promise.all(grabbers.map(g => g(providers)));

            const providerKeys = Object.keys(providers);

            keyValues.sort((a, b) => {
                const providerNameA = a.provider;
                const providerNameB = b.provider;

                return providerKeys.indexOf(providerNameA) - providerKeys.indexOf(providerNameB);
            });

            const ctor = Reflect.getMetadata('design:type', config, nestedKey);
            config[nestedKey] = new ctor();

            for (let { key, value } of keyValues) {
                config[nestedKey][key] = value;
            }
        }
    }
}
