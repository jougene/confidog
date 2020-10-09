import { Provider } from './providers/provider.interface';
export declare type ProvidersArray = {
    key: string;
    value: Provider;
}[];
export declare type ProvidersMap = Map<string, Provider>;
declare type Options = {
    providers: ProvidersArray;
    options?: {
        remoteConfigFetchTimeout?: number;
        override?: boolean;
        transform?: boolean;
        validate?: boolean;
    };
};
export declare class ConfigLoader {
    static load<T>(config: T, options: Options): Promise<T>;
    private static fillInFlatten;
    private static fillInNested;
}
export {};
