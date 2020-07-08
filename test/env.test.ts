import assert = require('assert');
import { Config } from '../samples/env';
import { EnvConfigProvider, ConfigLoader } from '../src';

describe('environment variables', () => {
    const providers = [{ key: 'env', value: new EnvConfigProvider() }];

    const load = async () => {
        return ConfigLoader.load({
            config: new Config(),
            providers,
        });
    };

    beforeEach(() => {
        process.env = {};
    });

    it('load defaults if no envs provided', async () => {
        const config = await load();
        assert.deepEqual(config, { appName: 'awesome_app', logLevel: 'debug', port: 80, devMode: false });
    });

    it('combine defaults with provided', async () => {
        process.env.APP_NAME = 'google_cloud';
        const config = await load();

        assert.deepEqual(config, { appName: 'google_cloud', logLevel: 'debug', port: 80, devMode: false });
    });

    it('use all provided envs', async () => {
        process.env = {
            APP_NAME: 'google_cloud',
            LOG_LEVEL: 'info',
            PORT: '3000',
            DEV_MODE: 'true',
        };
        const config = await load();

        assert.deepEqual(config, { appName: 'google_cloud', logLevel: 'info', port: 3000, devMode: true });
    });
});
