import { SortOrderEnum } from '../enums/sort-order.enum';
export declare class PaginatedRoutesBaseParamsDto {
    readonly order?: SortOrderEnum;
    readonly page?: number;
    readonly per_page?: number;
}
export declare class PageMetaDto {
    readonly page: number;
    readonly per_page: number;
    readonly item_count: number;
    readonly page_count: number;
    readonly has_previous_page: boolean;
    readonly has_next_page: boolean;
    constructor(pageMetaDtoParams: PageMetaDtoParams);
}
export declare class PageDto<T> {
    readonly data: T[];
    readonly meta: PageMetaDto;
    constructor(data: T[], meta: PageMetaDto);
}
export declare class PageMetaDtoParams {
    findAllQueryParams: PaginatedRoutesBaseParamsDto;
    itemCount: number;
}
export declare class PaginatedServiceResponse<T> {
    itemList: T[];
    itemCount: number;
}
export declare class PaginatedServiceApiResponseMeta {
    page: number;
    per_page: number;
    item_count: number;
    page_count: number;
    has_previous_page: boolean;
    has_next_page: boolean;
}
export declare class PaginatedServiceApiResponse {
    success: boolean;
    data: unknown[];
    meta: PaginatedServiceApiResponseMeta;
}
