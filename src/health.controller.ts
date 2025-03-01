import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

/**
 * Health check controller for testing the application in production
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  /**
   * Basic health check endpoint
   * @returns Simple status message
   */
  @ApiOperation({
    summary: 'Health check',
    description: 'Simple endpoint to verify the application is running',
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2023-06-01T12:00:00.000Z' },
        environment: { type: 'string', example: 'production' },
      },
    },
  })
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    }
  }

  /**
   * Detailed health check with system information
   * @returns Detailed system information
   */
  @ApiOperation({
    summary: 'Detailed health check',
    description: 'Provides detailed information about the system',
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2023-06-01T12:00:00.000Z' },
        version: { type: 'string', example: '1.0.0' },
        nodejs: { type: 'string', example: '16.14.0' },
        memory: {
          type: 'object',
          properties: {
            rss: { type: 'string', example: '50MB' },
            heapTotal: { type: 'string', example: '30MB' },
            heapUsed: { type: 'string', example: '20MB' },
          },
        },
        uptime: { type: 'number', example: 3600 },
      },
    },
  })
  @Get('detailed')
  detailed() {
    const memoryUsage = process.memoryUsage()

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      nodejs: process.version,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    }
  }

  /**
   * Echo endpoint that returns the request information
   * @returns Request information
   */
  @ApiOperation({
    summary: 'Echo request',
    description: 'Returns information about the request',
  })
  @Get('echo')
  echo() {
    return {
      timestamp: new Date().toISOString(),
      message: 'This is an echo response from the Netlify serverless function',
      serverInfo: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
      },
    }
  }
}
