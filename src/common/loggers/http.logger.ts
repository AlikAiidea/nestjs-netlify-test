import { Request, Response } from 'express'
import { catchError, map } from 'rxjs'

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'

import { Env } from '../dto/enums/env.enum'

/**
 * Interceptor that logs HTTP requests and responses.
 * It is used to monitor and log HTTP traffic in a provider base.
 */
@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  /**
   * Intercepts the incoming HTTP request and the outgoing HTTP response.
   * @param context - The execution context of the current request.
   * @param next - The next handler to be executed in the request pipeline.
   * @returns The response Observable stream.
   */
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const http = context.switchToHttp()
    const request: Request = http.getRequest()

    const logMode = process.env[Env.SERVICE_LOG_MODE] || 'MEDIUM'

    const { method, originalUrl, body, query, ip } = request
    const requestTime = Date.now()

    const logMessage = {
      METHOD: method,
      PATH: originalUrl,
      IP: ip,
    }

    return next.handle().pipe(
      map((value) => {
        const response: Response = context.switchToHttp().getResponse()
        const { statusCode } = response
        const responseTime = Date.now() - requestTime

        Object.assign(logMessage, {
          STATUS_CODE: statusCode,
          RESPONSE_TIME_MS: responseTime,
        })

        switch (logMode) {
          case 'FULL':
            Object.assign(logMessage, {
              BODY: body ?? {},
              QUERY: query ?? {},
              RESPONSE_MESSAGE: value ?? {},
            })
            break
          case 'MEDIUM':
            Object.assign(logMessage, {
              BODY: body ?? {},
              QUERY: query ?? {},
            })
            break
        }

        Logger.verbose(logMessage, 'HTTP')

        return value
      }),

      catchError((error) => {
        const responseTime = Date.now() - requestTime
        error.status = error.status ? error.status : 500

        Object.assign(logMessage, {
          STATUS_CODE: error.status,
          RESPONSE_TIME_MS: responseTime,
        })

        switch (logMode) {
          case 'FULL':
            Object.assign(logMessage, {
              BODY: body ?? {},
              QUERY: query ?? {},
              RESPONSE_MESSAGE: error,
            })
            break
          case 'MEDIUM':
            Object.assign(logMessage, {
              BODY: body ?? {},
              QUERY: query ?? {},
            })
            break
        }

        Logger.warn(logMessage, 'HTTP')
        throw error
      }),
    )
  }
}
