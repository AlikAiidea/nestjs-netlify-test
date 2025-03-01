"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseMappingInterceptor = void 0;
const operators_1 = require("rxjs/operators");
const common_1 = require("@nestjs/common");
const env_enum_1 = require("../dto/enums/env.enum");
let ResponseMappingInterceptor = exports.ResponseMappingInterceptor = class ResponseMappingInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => ({
            success: true,
            ...(data?.data ? { data: data.data, ...data } : { data }),
        })), (0, operators_1.catchError)(async (error) => {
            const isDevelopmentEnvironment = process.env[env_enum_1.Env.NODE_ENV] === 'development';
            let response;
            if (isDevelopmentEnvironment) {
                response = {
                    success: false,
                    message: error?.response?.message ?? JSON.stringify(error),
                };
            }
            else {
                response = {
                    success: false,
                    message: error?.response?.message ?? error?.message ?? 'Unknown error.',
                };
            }
            if (!error?.response?.message) {
                common_1.Logger.error(error);
            }
            throw new common_1.HttpException(response, error?.response?.statusCode ?? 500);
        }));
    }
};
exports.ResponseMappingInterceptor = ResponseMappingInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseMappingInterceptor);
//# sourceMappingURL=http-response-mapping.interceptor.js.map