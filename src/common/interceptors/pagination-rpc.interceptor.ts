import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'

import { PageDto, PageMetaDto } from '../dto/general/pagination.dto'

@Injectable()
export class PaginationRpcInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToRpc().getData()

    const page = parseInt(request.page, 10) || 1
    const perPage = parseInt(request.per_page, 10) || 10

    return next.handle().pipe(
      map((data) => {
        const { itemList, itemCount } = data

        const pageMetaDto = new PageMetaDto({
          findAllQueryParams: {
            page,
            per_page: perPage,
          },
          itemCount,
        })

        return new PageDto(itemList, pageMetaDto)
      }),
    )
  }
}
