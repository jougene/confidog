import 'reflect-metadata';
import { ProvidersMap } from './config.loader';

type Options = {
    key: string;
    default?: string | number;
};

export function EnvConfig(options: Options) {
    return function(target: any, key: string) {
        const existedGrabbers = Reflect.getMetadata('grabbers', target) || [];

        const grabFn = async (providers: ProvidersMap) => {
            const provider = providers['env'];

            const value = (await provider.get(options.key)) || options.default;

            return { provider: 'env', key, value };
        };

        existedGrabbers.push(grabFn);

        Reflect.defineMetadata('grabbers', existedGrabbers, target);
    };
}

export function VaultConfig(options: Options) {
    return function(target: any, key: string) {
        const existedGrabbers = Reflect.getMetadata('grabbers', target) || [];

        const grabFn = async (providers: ProvidersMap) => {
            const provider = providers['vault'];

            const value = (await provider.get(options.key)) || options.default;

            return { provider: 'vault', key, value };
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
