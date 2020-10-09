"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvConfigProvider = void 0;
class EnvConfigProvider {
    constructor() { }
    get(key) {
        return process.env[key];
    }
}
exports.EnvConfigProvider = EnvConfigProvider;
//# sourceMappingURL=env.provider.js.map