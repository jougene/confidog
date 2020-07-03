import { Provider } from '.';

type VaultOptions = {
    path: string;
    secret: string;
};

type VaultStubOptions = {
    knownValues?: {
        [key: string]: string;
    };
} & VaultOptions;

export class VaultConfigProvider implements Provider {
    constructor(private readonly options: VaultOptions) {}

    async get(key: string) {
        await new Promise(resolve => setTimeout(resolve, 50));

        return `${key}_vault_secret_value`;
    }
}

export class VaultStubConfigProvider implements Provider {
    constructor(private readonly options: VaultStubOptions) {}

    async get(key: string) {
        // emulate some network
        await new Promise(resolve => setTimeout(resolve, 50));

        const defaults = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            crypto_key: 'RkdYksbuOxTmo8jveowE',
            // eslint-disable-next-line @typescript-eslint/camelcase
            google_kms_private_key: 'fsd77fdsa7dfhkfadsfhasdjasdf88fdsajfds',
        };

        const map = this.options.knownValues || defaults;

        return map[key];
    }
}
