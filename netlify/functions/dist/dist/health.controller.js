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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let HealthController = exports.HealthController = class HealthController {
    check() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
        };
    }
    detailed() {
        const memoryUsage = process.memoryUsage();
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0',
            nodejs: process.version,
            memory: {
                rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            },
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
        };
    }
    echo() {
        return {
            timestamp: new Date().toISOString(),
            message: 'This is an echo response from the Netlify serverless function',
            serverInfo: {
                platform: process.platform,
                arch: process.arch,
                nodeVersion: process.version,
            },
        };
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Health check',
        description: 'Simple endpoint to verify the application is running',
    }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'ok' },
                timestamp: { type: 'string', example: '2023-06-01T12:00:00.000Z' },
                environment: { type: 'string', example: 'production' },
            },
        },
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Detailed health check',
        description: 'Provides detailed information about the system',
    }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'ok' },
                timestamp: { type: 'string', example: '2023-06-01T12:00:00.000Z' },
                version: { type: 'string', example: '1.0.0' },
                nodejs: { type: 'string', example: '16.14.0' },
                memory: {
                    type: 'object',
                    properties: {
                        rss: { type: 'string', example: '50MB' },
                        heapTotal: { type: 'string', example: '30MB' },
                        heapUsed: { type: 'string', example: '20MB' },
                    },
                },
                uptime: { type: 'number', example: 3600 },
            },
        },
    }),
    (0, common_1.Get)('detailed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "detailed", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Echo request',
        description: 'Returns information about the request',
    }),
    (0, common_1.Get)('echo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "echo", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health')
], HealthController);
//# sourceMappingURL=health.controller.js.map