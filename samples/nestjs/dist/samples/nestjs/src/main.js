"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const src_1 = require("../../../src");
class Config {
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(3000);
    const config = src_1.ConfigLoader.load(new Config(), {
        providers: [{ key: 'env', value: new src_1.EnvConfigProvider() }],
    });
    console.log(config);
    console.log('raz');
    common_1.Logger.log('Application listening on 3000 port...', 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map