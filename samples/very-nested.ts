import * as util from 'util';
import { ConfigLoader } from '../src/config.loader';
import { EnvConfig, NestedConfig } from '../src/decorators';
import { EnvConfigProvider } from '../src/providers';

class InnerInnerInnerConfig {
    @EnvConfig({ key: 'KEY_1', default: 'VALUE_1' })
    key1: string;

    @EnvConfig({ key: 'KEY_2' })
    key2: number;
}

class InnerInnerConfig {
    @NestedConfig()
    innerInnerInner: InnerInnerInnerConfig;
}

class InnerConfig {
    @NestedConfig()
    innerInner: InnerInnerConfig;
}

class Config {
    @NestedConfig()
    inner: InnerConfig;
}

const config = ConfigLoader.load({
    config: new Config(),
    providers: {
        env: new EnvConfigProvider(),
    },
});

config.then(c => console.log(util.inspect(c, true, null)));
