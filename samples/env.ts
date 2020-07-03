import { EnvConfig } from '../src/decorators';

export class Config {
    @EnvConfig({ key: 'APP_NAME', default: 'awesome_app' })
    appName: string;

    @EnvConfig({ key: 'LOG_LEVEL', default: 'debug' })
    logLevel: string;
}
