import 'reflect-metadata';
declare type Options = {
    key: string;
    default?: string | number | boolean | Date;
};
export declare function EnvConfig(options: Options): (target: any, key: string) => void;
export declare function VaultConfig(options: Options): (target: any, key: string) => void;
export declare function NestedConfig(): (target: any, key: string) => void;
export {};
