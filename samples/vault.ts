import { VaultConfig } from '../src';

export class Config {
    @VaultConfig({ key: 'cryptoKey', default: 'unknown_crypto_key' })
    cryptoKey: string;

    @VaultConfig({ key: 'googleKmsPrivateKey', default: 'invalid_key_you_should_not_use_defaults_in_sensitive_data' })
    googleKmsPrivateKey: number;
}
