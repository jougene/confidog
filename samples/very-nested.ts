import { EnvConfig, NestedConfig } from '../src/decorators';

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

export class Config {
    @NestedConfig()
    inner: InnerConfig;
}
