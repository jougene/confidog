import { EnvConfig } from '../src/decorators';
import { IsEmail } from 'class-validator';

export class Config {
    @EnvConfig({ key: 'APP_NAME', default: 'awesome_app' })
    appName: string;

    @EnvConfig({ key: 'LOG_LEVEL', default: 'debug' })
    logLevel: string;

    @EnvConfig({ key: 'MAIL_FROM', default: 'perviy_tost_za@localhost.com' })
    @IsEmail()
    mailFrom: string;
}
