import { Provider } from '.'

export class EnvConfigProvider implements Provider {
    constructor() {}

    get(key: string) {
        return process.env[key];
    }
}

