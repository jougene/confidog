import { EnvConfig, VaultConfig, NestedConfig } from '../src/decorators';
import { EnvConfigProvider, VaultStubConfigProvider as VaultConfigProvider, Provider } from '../src/providers';
import { ConfigLoader } from '../src/config.loader';

class CryptoConfig {
    @EnvConfig({ key: 'CRYPTO_KEY', default: 'unknown_crypto_key' })
    @VaultConfig({ key: 'crypto_key', default: 'unknown_crypto_key' })
    cryptoKey: string;
}

class Config {
    @NestedConfig()
    crypto: CryptoConfig;
}

const providers = new Map<string, Provider>();
providers.set('env', new EnvConfigProvider());
providers.set('vault', new VaultConfigProvider({ path: 'localhost', secret: 'vault_secret' }));

//const providers = [new EnvConfigProvider(), new VaultConfigProvider({ path: 'localhost', secret: 'vault_secret' })];
const loader = new ConfigLoader(providers);
loader.load(new Config()).then(console.log);

