import { Provider } from './providers/provider.interface';

type KeyValue = { key: string; value: string };
type GrabberFn = (providers: Provider[]) => KeyValue;

export class ConfigLoader {
    constructor(private readonly providers: Provider[]) {}

    async load(config: any) {
        await Promise.all([this.fillInFlatten(config), this.fillInNested(config)]);

        return config;
    }

    private async fillInFlatten(config: any) {
        const flattenGrabbers = Reflect.getMetadata('grabbers', config) || [];

        const kvs1: KeyValue[] = await Promise.all(
            flattenGrabbers.map(g => {
                return g(this.providers);
            }),
        );

        for (let { key, value } of kvs1) {
            config[key] = value;
        }
    }

    private async fillInNested(config: any) {
        const nestedKeys = Reflect.getMetadata('nestedKeys', config);
        for (let nestedKey of nestedKeys) {
            const grabbers: GrabberFn[] = Reflect.getMetadata('grabbers', config, nestedKey) || [];
            const keyValues: KeyValue[] = await Promise.all(grabbers.map(g => g(this.providers)));

            const ctor = Reflect.getMetadata('design:type', config, nestedKey);
            config[nestedKey] = new ctor();

            for (let { key, value } of keyValues) {
                config[nestedKey][key] = value;
            }
        }
    }
}
