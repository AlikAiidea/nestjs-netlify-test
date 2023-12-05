import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common'

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
      map((data) => {
        return {
          success: true,
          message: 'successfully fetched',
          data: data,
          meta: { count: Array.isArray(data) ? data.length : 1 },
        }
      }),
      catchError(async (error) => {
        throw new HttpException(
          {
            success: false,
            status: error.status,
            message: error.response ? error.response.message ?? 'Unknown error' : 'Unknown error',
          },
          error.response ? error.response.statusCode : 500,
        )
      }),
    )
  }
}
