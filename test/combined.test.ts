import assert = require('assert');
import { Config } from '../samples/combined';
import { EnvConfigProvider, ConfigLoader, VaultStubConfigProvider } from '../src';

describe('combined', () => {
    const providers = [
        { key: 'env', value: new EnvConfigProvider() },
        {
            key: 'vault',
            value: new VaultStubConfigProvider({
                path: 'localhost',
                secret: 'vault_secret',
            }),
        },
    ];

    const load = async () => {
        return ConfigLoader.load(new Config(), { providers });
    };

    beforeEach(() => {
        process.env = {};
    });

    it('load config with defaults for env and stubbed for vault', async () => {
        const config = await load();

        const expected: Config = {
            env: 'dev',
            logLevel: 'debug',
            mail: { host: 'localhost', port: 1025, user: '', password: '', useTls: true },
            database: { host: 'localhost', port: 5432, user: 'postgres', password: '' },
            crypto: { cryptoKey: 'RkdYksbuOxTmo8jveowE', googleKmsPrivateKey: 'fsd77fdsa7dfhkfadsfhasdjasdf88fdsajfds' },
        };

        assert.deepEqual(config, expected);
    });

    it('load with all values provided', async () => {
        process.env = {
            ENV: 'production',
            LOG_LEVEL: 'warn',
            DATABASE_HOST: 'google-gcp0.wc2.eth.super.com',
            DATABASE_PORT: '15432',
            DATABASE_USER: 'kozma_ivanovich',
            DATABASE_PASSWORD: 'f8hfd_@jopa$$lala',

            MAIL_HOST: 'mailchimp.localhost.com',
            MAIL_PORT: '11025',
            MAIL_USER: 'kozma_ivanovich',
            MAIL_PASSWORD: '42',
            MAIL_SECURE: 'true',
        };
        const config = await load();

        const expected: Config = {
            env: 'production',
            logLevel: 'warn',
            mail: { host: 'mailchimp.localhost.com', port: 11025, user: 'kozma_ivanovich', password: '42', useTls: true },
            database: { host: 'google-gcp0.wc2.eth.super.com', port: 15432, user: 'kozma_ivanovich', password: 'f8hfd_@jopa$$lala' },
            crypto: { cryptoKey: 'RkdYksbuOxTmo8jveowE', googleKmsPrivateKey: 'fsd77fdsa7dfhkfadsfhasdjasdf88fdsajfds' },
        };

        assert.deepEqual(config, expected);
    });
});
