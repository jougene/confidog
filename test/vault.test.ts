import assert = require('assert');
import { Config } from '../samples/vault';
import { VaultStubConfigProvider, ConfigLoader, Provider } from '../src';

const providerWithNoValues = new VaultStubConfigProvider({ path: 'localhost', secret: 'vault_secret' });
const providerWithSomeKnownValues = new VaultStubConfigProvider({
    path: 'localhost',
    secret: 'vault_secret',
    knownValues: {
        cryptoKey: 'secret_value_1',
    },
});
const providerWithAllKnownValues = new VaultStubConfigProvider({
    path: 'localhost',
    secret: 'vault_secret',
    knownValues: {
        cryptoKey: 'secret_value_1',
        googleKmsPrivateKey: 'secret_value_2',
    },
});

describe('vault', () => {
    const load = async (provider: Provider) => {
        return ConfigLoader.load({
            config: new Config(),
            providers: [
                {
                    key: 'vault',
                    value: provider,
                },
            ],
        });
    };
    it('load defaults if there is no values in vault', async () => {
        const config = await load(providerWithNoValues);

        assert.deepEqual(config, {
            cryptoKey: 'unknown_crypto_key',
            googleKmsPrivateKey: 'invalid_key_you_should_not_use_defaults_in_sensitive_data',
        });
    });

    it('combine defaults with provided', async () => {
        const config = await load(providerWithSomeKnownValues);

        assert.deepEqual(config, {
            cryptoKey: 'secret_value_1',
            googleKmsPrivateKey: 'invalid_key_you_should_not_use_defaults_in_sensitive_data',
        });
    });

    it('use all values from vault', async () => {
        const config = await load(providerWithAllKnownValues);

        assert.deepEqual(config, {
            cryptoKey: 'secret_value_1',
            googleKmsPrivateKey: 'secret_value_2',
        });
    });
});
