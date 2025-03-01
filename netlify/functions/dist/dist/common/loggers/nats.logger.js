"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsLoggerInterceptor = void 0;
const rxjs_1 = require("rxjs");
const common_1 = require("@nestjs/common");
const env_enum_1 = require("../dto/enums/env.enum");
let NatsLoggerInterceptor = exports.NatsLoggerInterceptor = class NatsLoggerInterceptor {
    async intercept(context, next) {
        const request = context.switchToRpc().getContext();
        const data = context.switchToRpc().getData();
        const pattern = request?.args?.[0];
        const logMode = process.env[env_enum_1.Env.SERVICE_LOG_MODE] || 'MEDIUM';
        const startTime = Date.now();
        const logMessage = {
            PATTERN: pattern,
        };
        return next.handle().pipe((0, rxjs_1.map)((value) => {
            const responseTime = Date.now() - startTime;
            Object.assign(logMessage, {
                STATUS: 'SUCCESS ✅',
                RESPONSE_TIME_MS: responseTime,
            });
            switch (logMode) {
                case 'FULL':
                    Object.assign(logMessage, {
                        PARAMS: data ?? {},
                        RESPONSE: value ?? {},
                    });
                    break;
                case 'MEDIUM':
                    Object.assign(logMessage, {
                        PARAMS: data ?? {},
                    });
                    break;
            }
            common_1.Logger.verbose(logMessage, 'NATS');
            return value;
        }), (0, rxjs_1.catchError)((error) => {
            const responseTime = Date.now() - startTime;
            Object.assign(logMessage, {
                STATUS: 'ERROR ❌',
                ERROR: error.message || error,
                RESPONSE_TIME_MS: responseTime,
            });
            switch (logMode) {
                case 'FULL':
                    Object.assign(logMessage, {
                        PARAMS: data ?? {},
                        RESPONSE: error ?? {},
                    });
                    break;
                case 'MEDIUM':
                    Object.assign(logMessage, {
                        PARAMS: data ?? {},
                    });
                    break;
            }
            common_1.Logger.warn(logMessage, 'NATS');
            throw error;
        }));
    }
};
exports.NatsLoggerInterceptor = NatsLoggerInterceptor = __decorate([
    (0, common_1.Injectable)()
], NatsLoggerInterceptor);
//# sourceMappingURL=nats.logger.js.map