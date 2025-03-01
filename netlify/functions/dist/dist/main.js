"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("winston-daily-rotate-file");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const Sentry = require("@sentry/node");
const app_module_1 = require("./app.module");
const env_enum_1 = require("./common/dto/enums/env.enum");
const http_response_mapping_interceptor_1 = require("./common/interceptors/http-response-mapping.interceptor");
const sentry_interceptor_1 = require("./common/interceptors/sentry.interceptor");
const http_logger_1 = require("./common/loggers/http.logger");
const main_logger_1 = require("./common/loggers/main.logger");
async function bootstrap() {
    const mainLogger = new main_logger_1.MainLogger();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        ...(process.env[env_enum_1.Env.SERVICE_LOG_TYPE] === 'pretty' ? {} : { logger: mainLogger }),
    });
    app.setGlobalPrefix('api');
    const configService = app.get(config_1.ConfigService);
    try {
        app.connectMicroservice({ transport: microservices_1.Transport.TCP });
    }
    catch (error) {
        common_1.Logger.error(error);
    }
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Base 🦁')
        .setDescription(`Description of the base project 🦁`)
        .setVersion(require('../package.json').version)
        .addServer(`http://127.0.0.1:3000/`, 'Local server')
        .addServer(`https://api.ptdev.ir/`, 'Development server')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    document.components = {
        ...document.components,
        securitySchemes: {
            API_ACCESS_TOKEN: {
                type: 'apiKey',
                in: 'header',
                name: 'API_ACCESS_TOKEN',
            },
            AUTHORIZATION: {
                scheme: 'Bearer',
                type: 'http',
                in: 'header',
                name: 'AUTHORIZATION',
            },
        },
    };
    swagger_1.SwaggerModule.setup('apidoc', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe());
    Sentry.init({
        dsn: configService.get(env_enum_1.Env.SENTRY_NODE_DSN),
        tracesSampleRate: +configService.get(env_enum_1.Env.SENTRY_TRACES_SAMPLE_RATE),
        release: require('../package.json').version,
        serverName: configService.get(env_enum_1.Env.SENTRY_SERVER_NAME),
    });
    app.useGlobalInterceptors(new http_logger_1.HttpLoggerInterceptor(), new http_response_mapping_interceptor_1.ResponseMappingInterceptor(), new sentry_interceptor_1.SentryInterceptor());
    await app
        .listen(+configService.get(env_enum_1.Env.SERVICE_HTTP_PORT) || 3000, configService.get(env_enum_1.Env.SERVICE_HTTP_HOST) || '127.0.0.1')
        .then(async () => {
        common_1.Logger.log(`${configService.get(env_enum_1.Env.SERVICE_NAME)} is running, swagger is available on ${await app.getUrl()}/apidoc 🚀 `, 'BASE 🦁');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map