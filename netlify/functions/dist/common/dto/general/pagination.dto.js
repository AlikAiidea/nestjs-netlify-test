"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedServiceApiResponse = exports.PaginatedServiceApiResponseMeta = exports.PaginatedServiceResponse = exports.PageMetaDtoParams = exports.PageDto = exports.PageMetaDto = exports.PaginatedRoutesBaseParamsDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const sort_order_enum_1 = require("../enums/sort-order.enum");
class PaginatedRoutesBaseParamsDto {
    constructor() {
        this.order = sort_order_enum_1.SortOrderEnum.ASC;
        this.page = 1;
        this.per_page = 10;
    }
}
exports.PaginatedRoutesBaseParamsDto = PaginatedRoutesBaseParamsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: sort_order_enum_1.SortOrderEnum, default: sort_order_enum_1.SortOrderEnum.ASC }),
    (0, class_validator_1.IsEnum)(sort_order_enum_1.SortOrderEnum),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PaginatedRoutesBaseParamsDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        minimum: 1,
        default: 1,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PaginatedRoutesBaseParamsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        minimum: 1,
        maximum: 50,
        default: 10,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PaginatedRoutesBaseParamsDto.prototype, "per_page", void 0);
class PageMetaDto {
    constructor(pageMetaDtoParams) {
        const { findAllQueryParams, itemCount } = pageMetaDtoParams;
        this.page = findAllQueryParams.page;
        this.per_page = findAllQueryParams.per_page;
        this.item_count = itemCount;
        this.page_count = Math.ceil(this.item_count / this.per_page);
        this.has_previous_page = this.page > 1;
        this.has_next_page = this.page < this.page_count;
    }
}
exports.PageMetaDto = PageMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PageMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PageMetaDto.prototype, "per_page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PageMetaDto.prototype, "item_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PageMetaDto.prototype, "page_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PageMetaDto.prototype, "has_previous_page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PageMetaDto.prototype, "has_next_page", void 0);
class PageDto {
    constructor(data, meta) {
        this.data = data;
        this.meta = meta;
    }
}
exports.PageDto = PageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", Array)
], PageDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => PageMetaDto }),
    __metadata("design:type", PageMetaDto)
], PageDto.prototype, "meta", void 0);
class PageMetaDtoParams {
}
exports.PageMetaDtoParams = PageMetaDtoParams;
class PaginatedServiceResponse {
}
exports.PaginatedServiceResponse = PaginatedServiceResponse;
class PaginatedServiceApiResponseMeta {
}
exports.PaginatedServiceApiResponseMeta = PaginatedServiceApiResponseMeta;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
    }),
    __metadata("design:type", Number)
], PaginatedServiceApiResponseMeta.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
    }),
    __metadata("design:type", Number)
], PaginatedServiceApiResponseMeta.prototype, "per_page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 19,
    }),
    __metadata("design:type", Number)
], PaginatedServiceApiResponseMeta.prototype, "item_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 2,
    }),
    __metadata("design:type", Number)
], PaginatedServiceApiResponseMeta.prototype, "page_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
    }),
    __metadata("design:type", Boolean)
], PaginatedServiceApiResponseMeta.prototype, "has_previous_page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
    }),
    __metadata("design:type", Boolean)
], PaginatedServiceApiResponseMeta.prototype, "has_next_page", void 0);
class PaginatedServiceApiResponse {
}
exports.PaginatedServiceApiResponse = PaginatedServiceApiResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PaginatedServiceApiResponse.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], PaginatedServiceApiResponse.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", PaginatedServiceApiResponseMeta)
], PaginatedServiceApiResponse.prototype, "meta", void 0);
//# sourceMappingURL=pagination.dto.js.map