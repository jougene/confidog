import assert = require('assert');
import { Config } from '../samples/with-transform';
import { EnvConfigProvider, ConfigLoader } from '../src';

describe('environment variables', () => {
    const providers = [{ key: 'env', value: new EnvConfigProvider() }];

    const load = async () => {
        return ConfigLoader.load(new Config(), {
            providers,
            options: { transform: true },
        });
    };

    beforeEach(() => {
        process.env = {};
    });

    it('use transformer to date field', async () => {
        process.env = {
            HARDCODED_DATE: '2020-12-21',
        };
        const config = await load();
        assert.deepEqual(config, { appName: 'awesome_app', logLevel: 'debug', someHardcodedDate: new Date('2020-12-21') });
    });
});
