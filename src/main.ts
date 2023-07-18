import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  /** App instance */
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  /** Set global prefix of the service */
  app.setGlobalPrefix('api')

  /** Active as a micro service */
  app.connectMicroservice<MicroserviceOptions>({ transport: Transport.TCP })

  /** Swagger */
  const config = new DocumentBuilder()
    .setTitle('Base Project')
    .setDescription('Base project blueprint')
    .setVersion(require('../package.json').version)
    .build()
  const document = SwaggerModule.createDocument(app, config)
  document.components = {
    ...document.components,
    securitySchemes: {
      ApiAccessToken: {
        type: 'apiKey',
        in: 'header',
        name: 'API_ACCESS_TOKEN',
      },
    },
  }
  SwaggerModule.setup('apidoc', app, document)

  await app.listen(3000).then(async () => console.info('Service is running %s/apidoc', await app.getUrl()))
}
bootstrap()
