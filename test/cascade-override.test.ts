import assert = require('assert');
import { Config } from '../samples/cascade-override';
import { EnvConfigProvider, ConfigLoader, VaultStubConfigProvider } from '../src';

const vaultProvider = new VaultStubConfigProvider({
    path: 'localhost',
    secret: 'vault_secret',
    knownValues: {
        cryptoKey: 'secret_value_1',
    },
});

describe('cascade', () => {
    const providers = [
        { key: 'env', value: new EnvConfigProvider() },
        { key: 'vault', value: vaultProvider },
    ];

    const load = async () => {
        return ConfigLoader.load({
            config: new Config(),
            providers,
        });
    };

    beforeEach(() => {
        process.env = {};
    });

    it('vault provided values must override env values', async () => {
        process.env.CRYPTO_KEY = 'some_crypto_key_from_env';
        const config = await load();

        assert.deepEqual(config, { crypto: { cryptoKey: 'secret_value_1' } });
    });
});
