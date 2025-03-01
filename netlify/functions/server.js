'use strict'

const path = require('path')
const serverless = require('serverless-http')
const express = require('express')
const app = express()

// Import the Nest.js application
const { NestFactory } = require('@nestjs/core')
const { ExpressAdapter } = require('@nestjs/platform-express')
const { AppModule } = require('../../dist/app.module')

let cachedHandler = null

// Create a cached handler for better cold start performance
const bootstrap = async () => {
  if (!cachedHandler) {
    const expressApp = express()
    const adapter = new ExpressAdapter(expressApp)

    const nestApp = await NestFactory.create(AppModule, adapter)
    nestApp.setGlobalPrefix('api')
    await nestApp.init()

    cachedHandler = serverless(expressApp)
  }

  return cachedHandler
}

exports.handler = async (event, context) => {
  const handler = await bootstrap()
  return handler(event, context)
}
