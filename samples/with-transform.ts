import { EnvConfig } from '../src/decorators';
import { Transform } from 'class-transformer';

export class Config {
    @EnvConfig({ key: 'APP_NAME', default: 'awesome_app' })
    appName: string;

    @EnvConfig({ key: 'LOG_LEVEL', default: 'debug' })
    logLevel: string;

    @EnvConfig({ key: 'HARDCODED_DATE', default: new Date('2020-01-01') })
    @Transform(d => new Date(d))
    someHardcodedDate: Date;
}
