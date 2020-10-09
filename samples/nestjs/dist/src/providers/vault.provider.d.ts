import { Provider } from '.';
declare type VaultOptions = {
    path: string;
    secret: string;
};
declare type VaultStubOptions = {
    knownValues?: {
        [key: string]: string;
    };
} & VaultOptions;
export declare class VaultConfigProvider implements Provider {
    private readonly options;
    constructor(options: VaultOptions);
    get(key: string): Promise<string>;
}
export declare class VaultStubConfigProvider implements Provider {
    private readonly options;
    constructor(options: VaultStubOptions);
    get(key: string): Promise<string>;
}
export {};
