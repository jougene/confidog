# Confidog

Cascade config loader for typescript from different config providers

### Why?

We want hierarchical config collected over different config providers
such as environment variables, files, POTO (T for typescript), vault, etcd, consul etc.

### Usage

Imagine you have some env file with content like this

```bash
DEV_MODE=true
LOG_LEVEL=debug

POSTGRES_DB_HOST=db
POSTGRES_DB=sample
POSTGRES_USER=sample
POSTGRES_PASSWORD=sample
POSTGRES_DB_PORT=5432

MAIL_HOST=mailcatcher
MAIL_PORT=1025
MAIL_USER=
MAIL_PASSWORD=
```

And you want config class like this

```typescript
class Config {
    mail: {
        host: string;
        port: number;
        user: string;
        password: string;
    };
    database: {
        name: string;
        host: string;
        port: number;
        user: string;
        password: string;
    };
    crypto: {
        cryptoKey: string;
    };
    devMode: boolean;
    logLevel: string;
}
```

So you can use classes with property decorators to load config from envs
and vault and put it to corresponding properties

```typescript
import { EnvConfig, VaultConfig, NestedConfig } from 'confidog';

class MailConfig {
    @EnvConfig({ key: 'MAIL_HOST', default: 'localhost' })
    host: string;

    @EnvConfig({ key: 'MAIL_PORT', default: 1025 })
    port: number;

    @EnvConfig({ key: 'MAIL_USER', default: '' })
    user: string;

    @EnvConfig({ key: 'MAIL_PASSWORD', default: '' })
    password: string;
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
    @EnvConfig({ key: 'CRYPTO_KEY', default: 'some_not_really_secret_value_for_development' })
    @VaultConfig({ key: 'crypto_key', default: 'unknown_crypto_key' })
    cryptoKey: string;
}

export class Config {
    @NestedConfig()
    mail: MailConfig;

    @NestedConfig()
    database: DatabaseConfig;

    @NestedConfig()
    crypto: CryptoConfig;

    @EnvConfig({ key: 'DEV_MODE', default: false })
    devMode: boolean;

    @EnvConfig({ key: 'LOG_LEVEL', default: 'debug' })
    logLevel: string;
}
```

Finally you just need to load it.
You should define providers in such an order that the following provider get higher priority over the previous one.
So in this example if there is a value in env and vault, the vault value (if exists) will override value from env.

```typescript
import { ConfigLoader, EnvConfigProvider, VaultConfigProvider } from 'confidog';

const config = ConfigLoader.load(new Config(), [
    { key: 'env', value: new EnvConfigProvider() },
    { key: 'value', value: new VaultConfigProvider({ path: 'localhost:8200/kv/my', secret: 'some_vault_secret' }) },
]);
```

### Samples

See `samples` directory. Also this samples are used in tests, so you can be sure that it is just working

### Usage with nestjs
