import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { SortOrderEnum } from '../enums/sort-order.enum'

export class PaginatedRoutesBaseParamsDto {
  @ApiPropertyOptional({ enum: SortOrderEnum, default: SortOrderEnum.ASC })
  @IsEnum(SortOrderEnum)
  @IsOptional()
  readonly order?: SortOrderEnum = SortOrderEnum.ASC

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly per_page?: number = 10
}

export class PageMetaDto {
  @ApiProperty()
  readonly page: number

  @ApiProperty()
  readonly per_page: number

  @ApiProperty()
  readonly item_count: number

  @ApiProperty()
  readonly page_count: number

  @ApiProperty()
  readonly has_previous_page: boolean

  @ApiProperty()
  readonly has_next_page: boolean

  constructor(pageMetaDtoParams: PageMetaDtoParams) {
    const { findAllQueryParams, itemCount } = pageMetaDtoParams
    this.page = findAllQueryParams.page
    this.per_page = findAllQueryParams.per_page
    this.item_count = itemCount
    this.page_count = Math.ceil(this.item_count / this.per_page)
    this.has_previous_page = this.page > 1
    this.has_next_page = this.page < this.page_count
  }
}

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[]

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data
    this.meta = meta
  }
}

export class PageMetaDtoParams {
  findAllQueryParams: PaginatedRoutesBaseParamsDto
  itemCount: number
}

export class PaginatedServiceResponse<T> {
  itemList: T[]
  itemCount: number
}

export class PaginatedServiceApiResponseMeta {
  @ApiProperty({
    example: 1,
  })
  page: number

  @ApiProperty({
    example: 10,
  })
  per_page: number

  @ApiProperty({
    example: 19,
  })
  item_count: number

  @ApiProperty({
    example: 2,
  })
  page_count: number

  @ApiProperty({
    example: false,
  })
  has_previous_page: boolean

  @ApiProperty({
    example: true,
  })
  has_next_page: boolean
}

export class PaginatedServiceApiResponse {
  @ApiProperty({ example: true })
  success: boolean

  @ApiProperty()
  data: unknown[]

  @ApiProperty()
  meta: PaginatedServiceApiResponseMeta
}
