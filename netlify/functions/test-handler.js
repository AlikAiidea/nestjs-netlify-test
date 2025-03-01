'use strict'

// A simple test handler to verify Netlify functions are working
exports.handler = async function (event, context) {
  console.log('Test handler called')
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Test handler is working correctly',
      timestamp: new Date().toISOString(),
    }),
  }
}
