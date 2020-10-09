import { Injectable } from '@nestjs/common';
import { Config } from './config';
import { config } from './main';

@Injectable()
export class AppService {
    constructor(private config: Config) {}

    getHello(): string {
        return 'Hello World!';
    }

    showConfig(): void {
        // as dependency
        console.log(this.config);
        // as global variable
        console.log(config);
    }
}
