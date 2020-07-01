import { IProvider, EnvConfigProvider, VaultConfigProvider } from './';

type Options = {
    key: string;
    default: string;
};

export function EnvConfig(options: Options) {
    return function(target: any, key: string) {
        const existedGrabbers = Reflect.getMetadata('grabbers', target) || [];

        const grabFn = async (providers: IProvider[]) => {
            // it is ridiculous, but user can register more than one provider with same name
            const envProviders = providers.filter(p => p.constructor.name === EnvConfigProvider.name);

            const provider = envProviders[0];

            const value = (await provider.get(options.key)) || options.default;

            return { key, value };
        };

        existedGrabbers.push(grabFn);

        Reflect.defineMetadata('grabbers', existedGrabbers, target);
    };
}

export function VaultConfig(options: Options) {
    return function(target: any, key: string) {
        const existedGrabbers = Reflect.getMetadata('grabbers', target) || [];

        const grabFn = async (providers: IProvider[]) => {
            // it is ridiculous, but user can register more than one provider with same name
            const vaultProviders = providers.filter(p => p.constructor.name === VaultConfigProvider.name);

            const provider = vaultProviders[0];

            const value = (await provider.get(options.key)) || options.default;

            return { key, value };
        };

        existedGrabbers.push(grabFn);

        Reflect.defineMetadata('grabbers', existedGrabbers, target);
    };
}

export function NestedConfig() {
    return function(target: any, key: string) {
        const ctor = Reflect.getMetadata('design:type', target, key);
        const prototype = ctor.prototype;

        const fns = Reflect.getMetadata('grabbers', prototype);

        const nestedKeys = Reflect.getMetadata('nestedKeys', target) || [];
        nestedKeys.push(key);

        Reflect.defineMetadata('grabbers', fns, target, key);
        Reflect.defineMetadata('nestedKeys', nestedKeys, target);
    };
}
