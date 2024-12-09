import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

import { Env } from '../dto/enums/env.enum'
import { IResponse } from '../dto/interfaces/response.interface'

/**
 * @description: Interceptor for response integration.
 * @param T data the data to be returned if the request is successful.
 * @param boolean success status of the request.
 * @param string message message to be returned if the request is not successful.
 * @returns {IResponse<T>}
 * @example: @UseInterceptors(ResponseMappingInterceptor)
 */
@Injectable()
export class NatsResponseMappingInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((data) => data),
      catchError(async (error) => {
        const isDevelopmentEnvironment = process.env[Env.NODE_ENV] === 'development'

        let response: IResponse<T>

        if (isDevelopmentEnvironment) {
          response = {
            success: false,
            message: error?.response?.message ?? JSON.stringify(error),
          }
        } else {
          response = {
            success: false,
            message: error?.response?.message ?? error?.message ?? 'Unknown error.',
          }
        }

        if (!error?.response?.message) {
          Logger.error(error)
        }

        throw new RpcException(response)
      }),
    )
  }
}
