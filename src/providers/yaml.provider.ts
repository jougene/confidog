import { Provider } from '.';

export class YamlConfigProvider implements Provider {
    constructor() {}

    get(_key: string) {
        return 'noop';
    }
}
