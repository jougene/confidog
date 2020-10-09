"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultStubConfigProvider = exports.VaultConfigProvider = void 0;
class VaultConfigProvider {
    constructor(options) {
        this.options = options;
    }
    async get(key) {
        await new Promise(resolve => setTimeout(resolve, 50));
        return `${key}_vault_secret_value`;
    }
}
exports.VaultConfigProvider = VaultConfigProvider;
class VaultStubConfigProvider {
    constructor(options) {
        this.options = options;
    }
    async get(key) {
        await new Promise(resolve => setTimeout(resolve, 50));
        const defaults = {
            crypto_key: 'RkdYksbuOxTmo8jveowE',
            google_kms_private_key: 'fsd77fdsa7dfhkfadsfhasdjasdf88fdsajfds',
        };
        const map = this.options.knownValues || defaults;
        return map[key];
    }
}
exports.VaultStubConfigProvider = VaultStubConfigProvider;
//# sourceMappingURL=vault.provider.js.map