"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedConfig = exports.VaultConfig = exports.EnvConfig = void 0;
require("reflect-metadata");
function EnvConfig(options) {
    return function (target, key) {
        const existedGrabbers = Reflect.getMetadata('grabbers', target) || [];
        const grabFn = async (providers) => {
            const provider = providers.get('env');
            const value = (await provider.get(options.key)) || options.default;
            return { provider: 'env', key, value };
        };
        existedGrabbers.push(grabFn);
        Reflect.defineMetadata('grabbers', existedGrabbers, target);
    };
}
exports.EnvConfig = EnvConfig;
function VaultConfig(options) {
    return function (target, key) {
        const existedGrabbers = Reflect.getMetadata('grabbers', target) || [];
        const grabFn = async (providers) => {
            const provider = providers.get('vault');
            const value = (await provider.get(options.key)) || options.default;
            return { provider: 'vault', key, value };
        };
        existedGrabbers.push(grabFn);
        Reflect.defineMetadata('grabbers', existedGrabbers, target);
    };
}
exports.VaultConfig = VaultConfig;
function NestedConfig() {
    return function (target, key) {
        const ctor = Reflect.getMetadata('design:type', target, key);
        const prototype = ctor.prototype;
        const fns = Reflect.getMetadata('grabbers', prototype);
        const nestedKeys = Reflect.getMetadata('nestedKeys', target) || [];
        nestedKeys.push(key);
        Reflect.defineMetadata('grabbers', fns, target, key);
        Reflect.defineMetadata('nestedKeys', nestedKeys, target);
    };
}
exports.NestedConfig = NestedConfig;
//# sourceMappingURL=decorators.js.map