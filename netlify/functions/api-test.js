'use strict'

// A simple test handler to verify API routing is working
exports.handler = async function (event, context) {
  console.log('API test handler called')
  console.log('Event path:', event.path)
  console.log('Event httpMethod:', event.httpMethod)
  console.log('Event headers:', JSON.stringify(event.headers))

  // Check if this is an API request
  if (event.path.startsWith('/api/test')) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'API test endpoint is working correctly',
        path: event.path,
        method: event.httpMethod,
        timestamp: new Date().toISOString(),
      }),
    }
  }

  // For any other path, return a 404
  return {
    statusCode: 404,
    body: JSON.stringify({
      message: 'Not found',
      path: event.path,
      method: event.httpMethod,
    }),
  }
}
