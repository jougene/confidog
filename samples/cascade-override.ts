import { EnvConfig, VaultConfig, NestedConfig } from '../src/decorators';
import { EnvConfigProvider, VaultStubConfigProvider as VaultConfigProvider } from '../src/providers';
import { ConfigLoader } from '../src/config.loader';

class CryptoConfig {
    @EnvConfig({ key: 'CRYPTO_KEY', default: 'default_crypto_key' })
    @VaultConfig({ key: 'crypto_key', default: 'default_crypto_key' })
    cryptoKey: string;
}

class Config {
    @NestedConfig()
    crypto: CryptoConfig;
}

const config = ConfigLoader.load({
    config: new Config(),
    providers: {
        env: new EnvConfigProvider(),
        vault: new VaultConfigProvider({ path: 'localhost', secret: 'vault_secret' }),
    },
});

config.then(console.log);
