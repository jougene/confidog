import assert = require('assert');
import { Config } from '../samples/env';
import { EnvConfigProvider, ConfigLoader } from '../src';

describe('environment variables', () => {
    const providers = { env: new EnvConfigProvider() };
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
        assert.deepEqual(config, { appName: 'awesome_app', logLevel: 'debug' });
    });

    it('combine defaults with provided', async () => {
        process.env.APP_NAME = 'google_cloud';
        const config = await load();

        assert.deepEqual(config, { appName: 'google_cloud', logLevel: 'debug' });
    });

    it('use all provided envs', async () => {
        process.env = {
            APP_NAME: 'google_cloud',
            LOG_LEVEL: 'info',
        };
        const config = await load();

        assert.deepEqual(config, { appName: 'google_cloud', logLevel: 'info' });
    });
});
