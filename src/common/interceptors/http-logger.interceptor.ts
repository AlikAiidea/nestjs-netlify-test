import { Request, Response } from 'express'
import { catchError, map } from 'rxjs'

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'

import { WinstonLogger } from '../utils/logger'

/**
 * Interceptor that logs HTTP requests and responses.
 * It is used to monitor and log HTTP traffic in a provider base.
 */
@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  /**
   * Creates an instance of HttpLoggerInterceptor.
   * @param logger - The logger instance used to log the HTTP traffic.
   * @param logLevel - The log level to determine the amount of information to log includes `FULL`, `MEDIUM`, and buy default is minimal.
   */
  constructor(private readonly logger: WinstonLogger, private readonly logLevel: string) {}

  /**
   * Intercepts the incoming HTTP request and the outgoing HTTP response.
   * @param context - The execution context of the current request.
   * @param next - The next handler to be executed in the request pipeline.
   * @returns The response Observable stream.
   */
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const http = context.switchToHttp()
    const request: Request = http.getRequest()

    const { method, originalUrl, body, query, ip } = request
    const requestTime = Date.now()

    return next.handle().pipe(
      map((value) => {
        const response: Response = context.switchToHttp().getResponse()
        const { statusCode } = response
        const responseTime = Date.now() - requestTime

        let logMessage = `[LOG LEVEL]:${this.logLevel} [HTTP] ${method} ${originalUrl} - IP: ${ip}`

        switch (this.logLevel) {
          case 'FULL':
            logMessage += ` - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(
              query,
            )} - Status: ${statusCode} - Response Time: ${responseTime}ms - Response Message: ${JSON.stringify(value)}`
            break
          case 'MEDIUM':
            logMessage += ` - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(
              query,
            )} - Status: ${statusCode} - Response Time: ${responseTime}ms`
            break
          default:
            logMessage += ` - Status: ${statusCode} - Response Time: ${responseTime}ms`
            break
        }

        this.logger.log(logMessage)
        return value
      }),

      catchError((error) => {
        const responseTime = Date.now() - requestTime
        error.status = error.status !== undefined ? error.status : 500
        let logMessage = `[LOG LEVEL]:${this.logLevel} [HTTP] ${method} ${originalUrl} - IP: ${ip} - status: ${error.status} -message: ${error.message} - Response Time: ${responseTime}ms`

        switch (this.logLevel) {
          case 'FULL':
            logMessage += ` - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)} - Status: ${
              error.status
            } - Response Time: ${responseTime}ms - Response Message: ${JSON.stringify(error)}`
            break
          case 'MEDIUM':
            logMessage += ` - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)} - Status: ${
              error.status
            } - Response Time: ${responseTime}ms`
            break
          default:
            logMessage += ` - Status: ${error.status} - Response Time: ${responseTime}ms`
            break
        }

        this.logger.log(logMessage)
        throw error
      }),
    )
  }
}
