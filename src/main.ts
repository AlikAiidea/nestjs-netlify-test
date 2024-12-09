import 'winston-daily-rotate-file'

import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as Sentry from '@sentry/node'

import { AppModule } from './app.module'
import { Env } from './common/dto/enums/env.enum'
import { ResponseMappingInterceptor } from './common/interceptors/http-response-mapping.interceptor'
import { SentryInterceptor } from './common/interceptors/sentry.interceptor'
import { HttpLoggerInterceptor } from './common/loggers/http.logger'
import { MainLogger } from './common/loggers/main.logger'

async function bootstrap() {
  const mainLogger = new MainLogger()

  /** App instance */
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    ...(process.env[Env.SERVICE_LOG_TYPE] === 'pretty' ? {} : { logger: mainLogger }),
  })

  /** Set global prefix of the service */
  app.setGlobalPrefix('api')

  const configService = app.get(ConfigService)

  try {
    /** Active as a micro service */
    app.connectMicroservice<MicroserviceOptions>({ transport: Transport.TCP })
  } catch (error) {
    Logger.error(error)
  }

  /** Swagger */
  const config = new DocumentBuilder()
    .setTitle('Base 🦁')
    .setDescription(`Description of the base project 🦁`)
    .setVersion(require('../package.json').version)
    .addServer(`http://127.0.0.1:3000/`, 'Local server')
    .addServer(`https://api.ptdev.ir/`, 'Development server')
    .build()
  const document = SwaggerModule.createDocument(app, config)
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
  }
  SwaggerModule.setup('apidoc', app, document)

  /** Activating Class validator */
  app.useGlobalPipes(new ValidationPipe())

  /** Initialize Sentry */
  Sentry.init({
    dsn: configService.get(Env.SENTRY_NODE_DSN),
    tracesSampleRate: +configService.get(Env.SENTRY_TRACES_SAMPLE_RATE),
    release: require('../package.json').version,
    serverName: configService.get(Env.SENTRY_SERVER_NAME),
  })

  /** Enable WinstonLogger for logging every request with different log lvl and Response mapping interceptor to normalize responses */
  app.useGlobalInterceptors(new HttpLoggerInterceptor(), new ResponseMappingInterceptor(), new SentryInterceptor())

  /** Listen the app to HTTP requests */
  await app
    .listen(
      +configService.get(Env.SERVICE_HTTP_PORT) || 3000,
      (configService.get(Env.SERVICE_HTTP_HOST) as string) || '127.0.0.1',
    )
    .then(async () => {
      Logger.log(
        `${configService.get(Env.SERVICE_NAME)} is running, swagger is available on ${await app.getUrl()}/apidoc 🚀 `,
        'BASE 🦁',
      )
    })
}
bootstrap()
