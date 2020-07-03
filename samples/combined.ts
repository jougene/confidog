/**
 *
 * It is the most relevant to real world example
 *
 */
import { EnvConfig, VaultConfig, NestedConfig } from '../src/decorators';

class MailConfig {
    @EnvConfig({ key: 'MAIL_HOST', default: 'localhost' })
    host: string;

    @EnvConfig({ key: 'MAIL_PORT', default: 1025 })
    port: number;

    @EnvConfig({ key: 'MAIL_USER', default: '' })
    user: string;

    @EnvConfig({ key: 'MAIL_PASSWORD', default: '' })
    password: string;

    @EnvConfig({ key: 'MAIL_SECURE', default: true })
    useTls: boolean;
}

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

class CryptoConfig {
    @VaultConfig({ key: 'crypto_key', default: 'unknown_crypto_key' })
    cryptoKey: string;

    @VaultConfig({ key: 'google_kms_private_key', default: 'invalid_key_you_should_not_use_defaults_in_sensitive_data' })
    googleKmsPrivateKey: string;
}

export class Config {
    @NestedConfig()
    mail: MailConfig;

    @NestedConfig()
    database: DatabaseConfig;

    @NestedConfig()
    crypto: CryptoConfig;

    @EnvConfig({ key: 'ENV', default: 'dev' })
    env: string;

    @EnvConfig({ key: 'LOG_LEVEL', default: 'debug' })
    logLevel: string;
}
