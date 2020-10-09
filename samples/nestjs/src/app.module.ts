import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Config } from './config';
import { config } from './main';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: Config,
            useFactory: () => config,
        },
    ],
})
export class AppModule {}
