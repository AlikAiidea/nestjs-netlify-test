'use strict'

const path = require('path')
const serverless = require('serverless-http')
const express = require('express')

// Import the Nest.js application
const { NestFactory } = require('@nestjs/core')
const { ExpressAdapter } = require('@nestjs/platform-express')

// Mock dependencies that might be causing resolution issues
// These are only needed if the main app tries to use them but we don't actually need their functionality in the serverless function
global.WebSocket = class WebSocket {}
global.Redis = class Redis {}

// Create a more comprehensive class-transformer/storage mock
const classTransformerStorageMock = require('./class-transformer-storage')

// Set up module mocking
const moduleAlias = {
  '@nestjs/websockets/socket-module': { SocketModule: class SocketModule {} },
  ioredis: class Redis {},
  'class-transformer/storage': classTransformerStorageMock,
  '@grpc/grpc-js': {},
  '@grpc/proto-loader': {},
  mqtt: { connect: () => ({ on: () => {}, subscribe: () => {} }) },
  nats: { connect: () => ({ on: () => {}, subscribe: () => {} }) },
  amqplib: { connect: () => Promise.resolve({ createChannel: () => Promise.resolve({}) }) },
  kafkajs: {
    Kafka: class Kafka {
      constructor() {
        this.producer = () => ({})
        this.consumer = () => ({})
      }
    },
  },
  'amqp-connection-manager': {
    AmqpConnectionManager: class AmqpConnectionManager {
      constructor() {}
      createChannel() {
        return { on: () => {}, publish: () => {}, addSetup: () => {} }
      }
      on() {
        return this
      }
    },
    connect: () => new moduleAlias['amqp-connection-manager'].AmqpConnectionManager(),
  },
}

// Add a direct reference to the storage mock to global scope
global.classTransformerStorage = classTransformerStorageMock
// Also expose it as module.exports for CommonJS imports
if (typeof module !== 'undefined') {
  module.exports.classTransformerStorage = classTransformerStorageMock
}

// Override require for unresolvable modules
const originalRequire = module.constructor.prototype.require
module.constructor.prototype.require = function (id) {
  // Handle class-transformer/storage as a top priority
  if (id === 'class-transformer/storage' || id.endsWith('class-transformer/storage')) {
    return classTransformerStorageMock
  }

  // Handle class-transformer as a special case
  if (id === 'class-transformer' || id.endsWith('class-transformer')) {
    // If class-transformer is requested, make sure it has a storage property
    const classTransformer = originalRequire.call(this, id)
    if (!classTransformer.storage) {
      classTransformer.storage = classTransformerStorageMock
    }
    return classTransformer
  }

  if (moduleAlias[id]) {
    return moduleAlias[id]
  }

  try {
    return originalRequire.call(this, id)
  } catch (error) {
    // If the module can't be resolved, check if it's in our mock list by partial match
    if (error.code === 'MODULE_NOT_FOUND') {
      // Secondary check for class-transformer/storage with any path
      if (id.includes('class-transformer/storage')) {
        return classTransformerStorageMock
      }

      // Check for class-transformer with any path
      if (id.includes('class-transformer')) {
        // Try to load the real module first
        try {
          const classTransformer = originalRequire.call(this, 'class-transformer')
          if (!classTransformer.storage) {
            classTransformer.storage = classTransformerStorageMock
          }
          return classTransformer
        } catch (e) {
          // If that fails, return a mock with storage property
          return { storage: classTransformerStorageMock }
        }
      }

      for (const mockModuleName in moduleAlias) {
        if (id.includes(mockModuleName)) {
          return moduleAlias[mockModuleName]
        }
      }

      // If we get here, we have a module that's not in our mock list
      console.warn(`Unresolved module: ${id} - you may need to add a mock for it`)

      // Return an empty object as fallback to prevent crashes
      return {}
    }
    throw error
  }
}

let cachedHandler = null

// Create a cached handler for better cold start performance
const bootstrap = async () => {
  if (!cachedHandler) {
    try {
      const expressApp = express()
      const adapter = new ExpressAdapter(expressApp)

      // Load the AppModule - adjust the path based on where the compiled module is located
      // The path was incorrect - we need to use the correct path to the compiled module
      let AppModule
      try {
        // Try different possible paths to find the AppModule
        try {
          AppModule = require('../functions/dist/app.module').AppModule
          console.log('Loaded AppModule from ../functions/dist/app.module')
        } catch (e) {
          console.log('Failed to load from ../functions/dist/app.module, trying ./dist/app.module')
          AppModule = require('./dist/app.module').AppModule
          console.log('Loaded AppModule from ./dist/app.module')
        }
      } catch (e) {
        console.error('Failed to load AppModule:', e)
        try {
          console.log('Trying to load from dist/app.module')
          AppModule = require('../../dist/app.module').AppModule
          console.log('Loaded AppModule from ../../dist/app.module')
        } catch (e2) {
          console.error('All attempts to load AppModule failed:', e2)
          throw new Error('Could not load AppModule from any location')
        }
      }

      // Add debug logging
      console.log(
        'AppModule loaded successfully, controllers:',
        AppModule.controllers ? AppModule.controllers.length : 'unknown',
      )

      const nestApp = await NestFactory.create(AppModule, adapter, {
        logger: ['error', 'warn', 'log'],
      })

      // Add debug logging for routes
      console.log('Setting global prefix: api')
      nestApp.setGlobalPrefix('api')

      // Add debug middleware to log all requests
      expressApp.use((req, res, next) => {
        console.log(`Request received: ${req.method} ${req.url}`)
        next()
      })

      await nestApp.init()
      console.log('NestJS application initialized successfully')

      // Log all registered routes
      const server = nestApp.getHttpServer()
      const router = server._events.request._router

      console.log('Registered routes:')
      router.stack.forEach((layer) => {
        if (layer.route) {
          const path = layer.route.path
          const methods = Object.keys(layer.route.methods)
            .map((m) => m.toUpperCase())
            .join(',')
          console.log(`${methods} ${path}`)
        }
      })

      // Add error handling middleware
      expressApp.use((err, req, res, next) => {
        console.error('Express error:', err)
        res.status(500).json({
          statusCode: 500,
          message: 'Internal Server Error',
          error: err.message,
        })
      })

      cachedHandler = serverless(expressApp)
    } catch (error) {
      console.error('Bootstrap error:', error)
      throw error
    }
  }

  return cachedHandler
}

// Just before the bootstrap function, register the module globally one more time for Node.js ESM support
try {
  require.cache['class-transformer/storage'] = {
    id: 'class-transformer/storage',
    filename: 'class-transformer/storage',
    loaded: true,
    exports: classTransformerStorageMock,
  }

  // Also try to patch the class-transformer module if it exists in cache
  const classTransformerPath = require.resolve('class-transformer')
  if (require.cache[classTransformerPath]) {
    require.cache[classTransformerPath].exports.storage = classTransformerStorageMock
  }
} catch (e) {
  console.warn('Could not add to require.cache:', e.message)
}

// Define the handler function
const handler = async (event, context) => {
  try {
    const handlerFn = await bootstrap()
    return handlerFn(event, context)
  } catch (error) {
    console.error('Handler error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
    }
  }
}

// Export the handler function - make sure this is at the end of the file
module.exports = { handler }
// Also export as a named export for ESM compatibility
exports.handler = handler
