import { Provider } from '.';

export class VaultConfigProvider implements Provider {
    constructor(private readonly options) {}

    async get(key: string) {
        await new Promise(resolve => setTimeout(resolve, 50));

        return `${key}_vault_secret_value`;
    }
}

export class VaultStubConfigProvider implements Provider {
    constructor(private readonly options) {}

    async get(key: string) {
        // emulate some network
        await new Promise(resolve => setTimeout(resolve, 50));

        const map = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            crypto_key: 'RkdYksbuOxTmo8jveowE',
        };

        return map[key] || 'default_vault_secret_value';
    }
}
