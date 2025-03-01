"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpLoggerInterceptor = void 0;
const rxjs_1 = require("rxjs");
const common_1 = require("@nestjs/common");
const env_enum_1 = require("../dto/enums/env.enum");
let HttpLoggerInterceptor = exports.HttpLoggerInterceptor = class HttpLoggerInterceptor {
    async intercept(context, next) {
        const http = context.switchToHttp();
        const request = http.getRequest();
        const logMode = process.env[env_enum_1.Env.SERVICE_LOG_MODE] || 'MEDIUM';
        const { method, originalUrl, body, query, ip } = request;
        const requestTime = Date.now();
        const logMessage = {
            METHOD: method,
            PATH: originalUrl,
            IP: ip,
        };
        return next.handle().pipe((0, rxjs_1.map)((value) => {
            const response = context.switchToHttp().getResponse();
            const { statusCode } = response;
            const responseTime = Date.now() - requestTime;
            Object.assign(logMessage, {
                STATUS_CODE: statusCode,
                RESPONSE_TIME_MS: responseTime,
            });
            switch (logMode) {
                case 'FULL':
                    Object.assign(logMessage, {
                        BODY: body ?? {},
                        QUERY: query ?? {},
                        RESPONSE_MESSAGE: value ?? {},
                    });
                    break;
                case 'MEDIUM':
                    Object.assign(logMessage, {
                        BODY: body ?? {},
                        QUERY: query ?? {},
                    });
                    break;
            }
            common_1.Logger.verbose(logMessage, 'HTTP');
            return value;
        }), (0, rxjs_1.catchError)((error) => {
            const responseTime = Date.now() - requestTime;
            error.status = error.status ? error.status : 500;
            Object.assign(logMessage, {
                STATUS_CODE: error.status,
                RESPONSE_TIME_MS: responseTime,
            });
            switch (logMode) {
                case 'FULL':
                    Object.assign(logMessage, {
                        BODY: body ?? {},
                        QUERY: query ?? {},
                        RESPONSE_MESSAGE: error,
                    });
                    break;
                case 'MEDIUM':
                    Object.assign(logMessage, {
                        BODY: body ?? {},
                        QUERY: query ?? {},
                    });
                    break;
            }
            common_1.Logger.warn(logMessage, 'HTTP');
            throw error;
        }));
    }
};
exports.HttpLoggerInterceptor = HttpLoggerInterceptor = __decorate([
    (0, common_1.Injectable)()
], HttpLoggerInterceptor);
//# sourceMappingURL=http.logger.js.map