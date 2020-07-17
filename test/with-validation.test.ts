import assert = require('assert');
import { Config } from '../samples/with-validation';
import { EnvConfigProvider, ConfigLoader } from '../src';
import { ValidationError } from 'class-validator';

describe('environment variables', () => {
    const providers = [{ key: 'env', value: new EnvConfigProvider() }];

    const load = async () => {
        return ConfigLoader.load(new Config(), {
            providers,
            options: { validate: true },
        });
    };

    beforeEach(() => {
        process.env = {};
    });

    it('validation fail', async () => {
        process.env = {
            MAIL_FROM: 'invalid_email',
        };
        assert.rejects(load, (validationErrors: ValidationError[]) => {
            const [error] = validationErrors;

            assert(error instanceof ValidationError);
            assert.equal(error.property, 'mailFrom');

            return true;
        });
    });

    it('validation ok', async () => {
        process.env = {
            MAIL_FROM: 'correct@email.com',
        };
        const config = await load();
        assert.deepEqual(config, { appName: 'awesome_app', logLevel: 'debug', mailFrom: 'correct@email.com' });
    });
});
