import { catchError, map } from 'rxjs'

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'

import { Env } from '../dto/enums/env.enum'

/**
 * Interceptor that logs NATS messaging events.
 * Includes emoji indicators for better readability and categorization of logs.
 */
@Injectable()
export class NatsLoggerInterceptor implements NestInterceptor {
  /**
   * Intercepts the incoming NATS request and the outgoing response.
   * @param context - The execution context of the current request.
   * @param next - The next handler to be executed in the request pipeline.
   * @returns The response Observable stream.
   */
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToRpc().getContext()
    const data = context.switchToRpc().getData()
    const pattern = request?.args?.[0]

    const logMode = process.env[Env.SERVICE_LOG_MODE] || 'MEDIUM'

    const startTime = Date.now()
    const logMessage: Record<string, any> = {
      PATTERN: pattern,
    }

    return next.handle().pipe(
      map((value) => {
        const responseTime = Date.now() - startTime

        Object.assign(logMessage, {
          STATUS: 'SUCCESS ✅',
          RESPONSE_TIME_MS: responseTime,
        })

        switch (logMode) {
          case 'FULL':
            Object.assign(logMessage, {
              PARAMS: data ?? {},
              RESPONSE: value ?? {},
            })
            break
          case 'MEDIUM':
            Object.assign(logMessage, {
              PARAMS: data ?? {},
            })
            break
        }

        Logger.verbose(logMessage, 'NATS')
        return value
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime

        Object.assign(logMessage, {
          STATUS: 'ERROR ❌',
          ERROR: error.message || error,
          RESPONSE_TIME_MS: responseTime,
        })

        switch (logMode) {
          case 'FULL':
            Object.assign(logMessage, {
              PARAMS: data ?? {},
              RESPONSE: error ?? {},
            })
            break
          case 'MEDIUM':
            Object.assign(logMessage, {
              PARAMS: data ?? {},
            })
            break
        }

        Logger.warn(logMessage, 'NATS')
        throw error
      }),
    )
  }
}
