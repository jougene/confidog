import { Provider } from '.';
export declare class EnvConfigProvider implements Provider {
    constructor();
    get(key: string): string;
}
