# Netlify Deployment Instructions

This document provides instructions for deploying this Nest.js application to Netlify.

## Setup

1. We have set up the following configuration for Netlify deployment:
   - `netlify.toml`: Configuration file for Netlify build settings
   - `netlify/functions/server.js`: Serverless function to serve the Nest.js application
   - Added necessary scripts to `package.json`

## Local Development

To run the application locally with Netlify's development environment:

```bash
npm run netlify:dev
```

This will start the Netlify dev server, which will serve your application locally as it would be served on Netlify.

## Deployment

### Method 1: Using Netlify CLI

1. First, log in to Netlify:
   ```bash
   npx netlify login
   ```

2. Initialize your site (first time only):
   ```bash
   npx netlify init
   ```

3. Deploy to production:
   ```bash
   npm run netlify:deploy
   ```

### Method 2: Connecting to GitHub

1. Push your code to a GitHub repository
2. Log in to the Netlify web UI (https://app.netlify.com/)
3. Click "Add new site" > "Import an existing project"
4. Connect to your GitHub account and select your repository
5. Configure build settings (should be automatically detected from netlify.toml)
6. Click "Deploy site"

## Environment Variables

Make sure to configure any required environment variables in the Netlify dashboard under:
Site settings > Build & deploy > Environment > Environment variables

## Troubleshooting Module Resolution Issues

During the build process, you might encounter errors like:

```
Could not resolve "@nestjs/websockets/socket-module"
Could not resolve "ioredis"
Could not resolve "class-transformer/storage"
Could not resolve "@grpc/grpc-js"
Could not resolve "@grpc/proto-loader"
Could not resolve "mqtt"
Could not resolve "nats"
Could not resolve "amqplib"
Could not resolve "kafkajs"
Could not resolve "amqp-connection-manager"
```

These occur because Netlify's build process has trouble resolving certain modules. We've implemented several solutions to handle these issues:

1. **Module Mocking**: In `netlify/functions/server.js`, we've added code to mock these modules when they're requested but not actually needed for core functionality.

2. **External Node Modules**: In `netlify.toml`, we've specified these modules as external, so they don't get bundled by esbuild.

3. **Dependency Installation**: We've installed these dependencies in the project even if they're not directly used, to satisfy resolution requirements:
   ```bash
   npm install --save @nestjs/websockets ioredis @grpc/grpc-js @grpc/proto-loader mqtt nats amqplib kafkajs amqp-connection-manager --legacy-peer-deps
   ```

If you encounter additional module resolution issues:

1. Install the missing dependency with `--legacy-peer-deps` flag
2. Add the module to the mock list in `netlify/functions/server.js`
3. Add the module to the `external_node_modules` list in `netlify.toml`

## Common NestJS Microservice Transport Modules

NestJS Microservices can use various transport mechanisms. If your application is using (or importing) any of these, you may need to add them as external dependencies:

- **TCP**: Built-in (no additional dependencies needed)
- **Redis**: `ioredis` 
- **MQTT**: `mqtt`
- **NATS**: `nats`
- **RabbitMQ**: `amqplib` and `amqp-connection-manager`
- **Kafka**: `kafkajs`
- **gRPC**: `@grpc/grpc-js` and `@grpc/proto-loader`
- **WebSockets**: `@nestjs/websockets` and `socket.io`

## Special Notes on class-transformer/storage

The `class-transformer/storage` module is particularly problematic with Netlify's bundling for several reasons:

1. It's imported by NestJS internally, even if you don't use it directly
2. It's referenced through dynamic imports in the class-transformer package
3. Netlify's esbuild bundler has trouble with resolving this specific module

Our solution includes multiple layers of fallbacks:

1. We've created a comprehensive mock that implements the main interfaces expected by NestJS
2. We've added special handling in the module resolution override
3. We've exposed the mock through both global scope and CommonJS exports
4. We've added it to require.cache for ESM imports
5. We've created a dedicated mock file in `netlify/functions/class-transformer-storage.js`
6. We've added a physical file in `node_modules/class-transformer/storage/index.js`
7. We've added `class-transformer` and `class-transformer/storage` to the `external_node_modules` list in `netlify.toml`

If you still encounter the "Could not resolve class-transformer/storage" error:

1. Try clearing Netlify's build cache and deploying again:
   ```bash
   netlify deploy --prod --clear
   ```

2. Make sure both `class-transformer` and `class-transformer/storage` are listed in `external_node_modules` in netlify.toml

3. Check if your application is using any advanced features of class-transformer that might need additional mocking

4. Try adding a direct symbolic link to the mock file:
   ```bash
   mkdir -p node_modules/class-transformer/storage
   cp netlify/functions/class-transformer-storage.js node_modules/class-transformer/storage/index.js
   ```

Advanced troubleshooting: You can add a simple test in your application to verify the mock is working:

```typescript
// Add this somewhere in your application's bootstrap process (like main.ts)
try {
  const storage = require('class-transformer/storage');
  console.log('Successfully loaded class-transformer/storage mock:', 
    typeof storage.getMetadataStorage === 'function');
} catch (error) {
  console.error('Failed to load class-transformer/storage:', error);
}
```

This will help diagnose if the module is being correctly resolved at runtime.

## Troubleshooting Runtime Issues

### Handler Not Found Error

If you encounter an error like:

```
Runtime.HandlerNotFound: server.handler is undefined or not exported
```

This indicates that Netlify's runtime cannot find the handler function in your server.js file. To fix this:

1. Make sure your handler is properly exported at the end of your server.js file:
   ```javascript
   // Export the handler function - make sure this is at the end of the file
   module.exports = { handler }
   // Also export as a named export for ESM compatibility
   exports.handler = handler
   ```

2. Check that your function name in netlify.toml is correct:
   ```toml
   [functions.server]  # Not [functions."server"]
   ```

3. Verify that your server.js file is in the correct location (netlify/functions/server.js)

4. Try deploying with a cleared cache:
   ```bash
   netlify deploy --prod --clear
   ```

5. If the issue persists, try creating a simple test function (like netlify/functions/test-handler.js) to verify that Netlify functions are working correctly.

## Testing in Production

We've implemented several health check endpoints to verify that your application is running correctly in production:

### Health Check Endpoints

1. **Basic Health Check**
   ```
   GET https://your-netlify-site.netlify.app/api/health
   ```
   Returns a simple status message with timestamp and environment information.

2. **Detailed Health Check**
   ```
   GET https://your-netlify-site.netlify.app/api/health/detailed
   ```
   Returns detailed system information including memory usage, Node.js version, and uptime.

3. **Echo Endpoint**
   ```
   GET https://your-netlify-site.netlify.app/api/health/echo
   ```
   Returns information about the request and server environment.

### Example Response (Basic Health Check)

```json
{
  "status": "ok",
  "timestamp": "2023-06-01T12:00:00.000Z",
  "environment": "production"
}
```

### Example Response (Detailed Health Check)

```json
{
  "status": "ok",
  "timestamp": "2023-06-01T12:00:00.000Z",
  "version": "1.0.0",
  "nodejs": "v16.14.0",
  "memory": {
    "rss": "50MB",
    "heapTotal": "30MB",
    "heapUsed": "20MB"
  },
  "uptime": 3600,
  "environment": "production"
}
```

You can use these endpoints to verify that your application is running correctly in production and to diagnose any issues that might arise.

## Notes

- The application is served as a serverless function and might have cold start times
- For optimal performance, consider adjusting the `functions.js.node_bundler` setting in `netlify.toml` based on your needs
- Serverless functions on Netlify have a 10-second execution limit by default. For large applications, you might need to optimize for this constraint.
- If your application needs to connect to external services (like databases), ensure these connections are properly handled for serverless environments (connection pooling, etc.). 