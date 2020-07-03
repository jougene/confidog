import { EnvConfig, VaultConfig, NestedConfig } from '../src/decorators';

class CryptoConfig {
    @EnvConfig({ key: 'CRYPTO_KEY', default: 'default_crypto_key' })
    @VaultConfig({ key: 'cryptoKey', default: 'default_crypto_key' })
    cryptoKey: string;
}

export class Config {
    @NestedConfig()
    crypto: CryptoConfig;
}
