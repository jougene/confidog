import 'reflect-metadata';
import { EnvConfig, VaultConfig, NestedConfig } from './decorators';
import { EnvConfigProvider, VaultConfigProvider, ConfigLoader } from './';

class DatabaseConfig {
  @EnvConfig({ key: 'DATABASE_HOST', default: 'localhost' })
  host: string;

  @EnvConfig({ key: 'DATABASE_PORT', default: '5432' })
  port: number;

  user: string;

  password: string;
}

class SecretConfig {
  //@EnvConfig({ key: 'SECRET_KEY_ONE', default: 'secret1' })
  @VaultConfig({ key: 'secret_one', default: 'first_unknown' })
  secretKeyOne: string;

  //@EnvConfig({ key: 'SECRET_KEY_TWO', default: 'secret2' })
  @VaultConfig({ key: 'secret_two', default: 'second_unknown' })
  secretKeyTwo: number;
}

export class Config {
  @NestedConfig()
  database: DatabaseConfig;

  @NestedConfig()
  secret: SecretConfig;

  @EnvConfig({ key: 'FLATTEN_KEY', default: 'jopa' })
  flattenKey: string;

  @EnvConfig({ key: 'FLATTEN_KEY_2', default: 'jopa_2' })
  flattenKey2: string;
}

const providers = [new EnvConfigProvider(), new VaultConfigProvider({ path: 'localhost', secret: 'vault_secret' })];
const loader = new ConfigLoader(providers);
//const config = new Config([new VaultConfigProvider({ path: 'localhost', secret: 'vault_secret' })]);
loader.load(new Config()).then(console.log);
