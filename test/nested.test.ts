import assert = require('assert');
import { Config } from '../samples/very-nested';
import { EnvConfigProvider, ConfigLoader } from '../src';

describe('nested', () => {
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

    it('use defaults', async () => {
        const config = await load();
        const expectedConfig = {
            inner: { innerInner: { innerInnerInner: { key1: 'VALUE_1', key2: undefined } } },
        };

        assert.deepEqual(config, expectedConfig);
    });

    it('use provided envs', async () => {
        process.env = {
            KEY_1: 'EXISTED_VALUE',
            KEY_2: '42',
        };

        const config = await load();
        const expectedConfig = {
            inner: { innerInner: { innerInnerInner: { key1: 'EXISTED_VALUE', key2: 42 } } },
        };

        assert.deepEqual(config, expectedConfig);
    });
});
