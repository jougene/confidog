import { EnvConfig } from '../../../src';

export class Config {
    @EnvConfig({ key: 'APP_NAME', default: 'awesome_app' })
    appName: string;

    @EnvConfig({ key: 'LOG_LEVEL', default: 'debug' })
    logLevel: string;

    @EnvConfig({ key: 'PORT', default: 3000 })
    port: number;

    @EnvConfig({ key: 'DEV_MODE', default: false })
    devMode: boolean;
}
