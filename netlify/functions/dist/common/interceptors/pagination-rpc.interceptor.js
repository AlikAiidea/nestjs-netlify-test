"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationRpcInterceptor = void 0;
const operators_1 = require("rxjs/operators");
const common_1 = require("@nestjs/common");
const pagination_dto_1 = require("../dto/general/pagination.dto");
let PaginationRpcInterceptor = exports.PaginationRpcInterceptor = class PaginationRpcInterceptor {
    intercept(context, next) {
        const request = context.switchToRpc().getData();
        const page = parseInt(request.page, 10) || 1;
        const perPage = parseInt(request.per_page, 10) || 10;
        return next.handle().pipe((0, operators_1.map)((data) => {
            const { itemList, itemCount } = data;
            const pageMetaDto = new pagination_dto_1.PageMetaDto({
                findAllQueryParams: {
                    page,
                    per_page: perPage,
                },
                itemCount,
            });
            return new pagination_dto_1.PageDto(itemList, pageMetaDto);
        }));
    }
};
exports.PaginationRpcInterceptor = PaginationRpcInterceptor = __decorate([
    (0, common_1.Injectable)()
], PaginationRpcInterceptor);
//# sourceMappingURL=pagination-rpc.interceptor.js.map