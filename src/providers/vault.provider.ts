import { Provider } from '.';

export class VaultConfigProvider implements Provider {
    constructor(private readonly options) {}

    async get(key: string) {
        await new Promise(resolve => setTimeout(resolve, 50));

        return `${key}_VAULT_SECRET_VALUE`;
    }
}
