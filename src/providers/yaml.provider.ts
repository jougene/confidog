import { Provider } from '.';

export class YamlConfigProvider implements Provider {
    constructor() {}

    get(key: string) {
        return key;
    }
}
