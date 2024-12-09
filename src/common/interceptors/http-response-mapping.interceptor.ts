import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { CallHandler, ExecutionContext, HttpException, Injectable, Logger, NestInterceptor } from '@nestjs/common'

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
export class ResponseMappingInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        /** Used if the response already has data in it, not add another data in it */
        ...(data?.data ? { data: data.data, ...data } : { data }),
      })),
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

        throw new HttpException(response, error?.response?.statusCode ?? 500)
      }),
    )
  }
}
