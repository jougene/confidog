import { EnvConfigProvider } from '../src/providers';
import { ConfigLoader } from '../src/config.loader';
import { EnvConfig } from '../src/decorators';

class Config {
    @EnvConfig({ key: 'APP_NAME', default: 'awesome_app' })
    appName: string;

    @EnvConfig({ key: 'LOG_LEVEL', default: 'debug' })
    logLevel: string;
}

const providers = [new EnvConfigProvider()];
const loader = new ConfigLoader(providers);
loader.load(new Config()).then(console.log);
