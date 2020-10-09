"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigLoader = void 0;
const typecaster_1 = require("./typecaster");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const defaultOptions = {
    transform: false,
    validate: false,
};
const tryToConvertToCorrectType = (target, key, value) => {
    const type = Reflect.getMetadata('design:type', target, key).name;
    return typecaster_1.cast(type, value);
};
class ConfigLoader {
    static async load(config, options) {
        const providersMap = new Map();
        options.options = options.options || defaultOptions;
        for (const { key, value } of options.providers) {
            providersMap.set(key, value);
        }
        await Promise.all([ConfigLoader.fillInFlatten(config, providersMap), ConfigLoader.fillInNested(config, providersMap)]);
        const { validate, transform } = options.options;
        if (transform) {
            config = class_transformer_1.classToClass(config);
        }
        if (validate) {
            await class_validator_1.validateOrReject(config);
        }
        return config;
    }
    static async fillInFlatten(config, providers) {
        const flattenGrabbers = Reflect.getMetadata('grabbers', config) || [];
        const values = await Promise.all(flattenGrabbers.map(g => {
            return g(providers);
        }));
        for (const { key, value } of values) {
            config[key] = tryToConvertToCorrectType(config, key, value);
        }
    }
    static async fillInNested(config, providers) {
        const nestedKeys = Reflect.getMetadata('nestedKeys', config) || [];
        const traverseAndFill = async (config1, nestedKeys1) => {
            if (!config1)
                return;
            for (const nestedKey of nestedKeys1) {
                const ctor = Reflect.getMetadata('design:type', config1, nestedKey);
                config1[nestedKey] = new ctor();
                const oneMoreNested = Reflect.getMetadata('nestedKeys', config1[nestedKey]);
                const grabbers = Reflect.getMetadata('grabbers', config1, nestedKey) || [];
                const keyValues = await Promise.all(grabbers.map(g => g(providers)));
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
exports.ConfigLoader = ConfigLoader;
//# sourceMappingURL=config.loader.js.map