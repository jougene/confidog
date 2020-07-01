export interface IProvider {
    get(key: string): string | Promise<string>;
}

type KeyValue = { key: string; value: string };
type GrabberFn = (providers: IProvider[]) => KeyValue;

export class ConfigLoader {
    constructor(private readonly providers: IProvider[]) {}

    async load(config: any) {
        await Promise.all([this.fillInFlatten(config), this.fillInNested(config)]);

        return config;
    }

    private async fillInFlatten(config: any) {
        const flattenGrabbers = Reflect.getMetadata('grabbers', config) || [];

        const kvs1: KeyValue[] = await Promise.all(
            flattenGrabbers.map(g => {
                return g(this.providers);
            })
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

export class EnvConfigProvider implements IProvider {
    constructor() {}

    get(key: string) {
        return process.env[key];
    }
}

export class VaultConfigProvider implements IProvider {
    constructor(private readonly options) {}

    async get(key: string) {
        await new Promise(resolve => setTimeout(resolve, 50));

        // api call to vault

        return `${key}_VAULT_SECRET_VALUE`;
    }
}
