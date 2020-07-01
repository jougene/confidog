type ReturnType = string | number | Promise<string> | Promise<number>;

export interface Provider {
    get(key: string): ReturnType;
}
