import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Config } from './config';
import { ConfigLoader, EnvConfigProvider } from '../../../src';

export let config: Config;

async function bootstrap() {
    // We load config before initialize application
    // because config can have some logger options or port application listen to
    config = await ConfigLoader.load(new Config(), {
        providers: [{ key: 'env', value: new EnvConfigProvider() }],
    });
    Object.freeze(config); // because we have global variable we dont want someone to change it
    Logger.log(config, 'Config')

    const app = await NestFactory.create(AppModule);
    await app.listen(config.port);

    Logger.log(`Application listening on ${config.port} port...`, 'Bootstrap');
}

bootstrap();
