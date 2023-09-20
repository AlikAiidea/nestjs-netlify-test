import 'winston-daily-rotate-file'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { Env } from './common/dto/enums/env.enum'
import { HttpLoggerInterceptor } from './common/interceptors/http-logger.interceptor'
import { ResponseMappingInterceptor } from './common/interceptors/response-mapping.interceptor'
import { WinstonLogger } from './common/utils/logger'

async function bootstrap() {
  /** App instance */
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  /** Set global prefix of the service */
  app.setGlobalPrefix('api')

  /** Active as a micro service */
  app.connectMicroservice<MicroserviceOptions>({ transport: Transport.TCP })

  /** Swagger */
  const config = new DocumentBuilder()
    .setTitle(app.get(ConfigService).get(Env.SERVICE_NAME))
    .setDescription('Lorem ipsum')
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

  /** Enable WinstonLogger for logging every request with different log lvl */
  app.useGlobalInterceptors(
    new HttpLoggerInterceptor(
      new WinstonLogger(app.get(ConfigService).get(Env.LOG_IN_CONSOLE), app.get(ConfigService).get(Env.LOG_IN_FILE)),
      app.get(ConfigService).get(Env.SERVICE_HTTP_LOG_LEVEL) || 'MINIMAL',
    ),
  )

  /** Response mapping interceptor to normalize responses */
  app.useGlobalInterceptors(new ResponseMappingInterceptor())

  /** Listen the app to HTTP requests */
  await app
    .listen(
      +app.get(ConfigService).get(Env.SERVICE_PORT) || 3000,
      (app.get(ConfigService).get(Env.SERVICE_HOST) as string) || '127.0.0.1',
    )
    .then(async () =>
      console.info(
        '%s is running, swagger is available on %s/apidoc',
        app.get(ConfigService).get(Env.SERVICE_NAME),
        await app.getUrl(),
      ),
    )
}
bootstrap()
