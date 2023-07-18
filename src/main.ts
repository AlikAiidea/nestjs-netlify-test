import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

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
  SwaggerModule.setup('api-doc', app, document)

  await app.listen(3000).then(async () => console.info('Service is running %s/api-doc', await app.getUrl()))
}
bootstrap()
