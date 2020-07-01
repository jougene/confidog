import { EnvConfig, VaultConfig, NestedConfig } from '../src/decorators';
import { EnvConfigProvider, VaultConfigProvider } from '../src/providers';
import { ConfigLoader } from '../src/config.loader';

class DatabaseConfig {
    @EnvConfig({ key: 'DATABASE_HOST', default: 'localhost' })
    host: string;

    @EnvConfig({ key: 'DATABASE_PORT', default: 5432 })
    port: number;

    @EnvConfig({ key: 'DATABASE_USER', default: 'postgres' })
    user: string;

    @EnvConfig({ key: 'DATABASE_PASSWORD', default: '' })
    password: string;
}

class SecretConfig {
    @VaultConfig({ key: 'crypto_key', default: 'unknown_crypto_key' })
    cryptoKey: string;

    @VaultConfig({ key: 'google_kms_private_key', default: 'invalid_key_you_should_not_use_defaults_in_sensitive_data' })
    googleKmsPrivateKey: number;
}

class Config {
    @NestedConfig()
    database: DatabaseConfig;

    @NestedConfig()
    secret: SecretConfig;

    @EnvConfig({ key: 'ENV', default: 'dev' })
    env: string;

    @EnvConfig({ key: 'LOG_LEVEL', default: 'debug' })
    logLevel: string;
}

const providers = [new EnvConfigProvider(), new VaultConfigProvider({ path: 'localhost', secret: 'vault_secret' })];
const loader = new ConfigLoader(providers);
loader.load(new Config()).then(console.log);

