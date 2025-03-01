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
exports.NotFoundResultSample = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class NotFoundResultSample {
    constructor() {
        this.statusCode = 404;
        this.error = 'Not Found';
        this.name = 'NotFoundException';
        this.alert = 'Cannot GET /your/address';
    }
}
exports.NotFoundResultSample = NotFoundResultSample;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code based on status and response result.',
        required: true,
        example: 404,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], NotFoundResultSample.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional, returns the reason for the error if not successful.',
        required: false,
        example: 'Not Found',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotFoundResultSample.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name associated with the response',
        required: true,
        example: 'NotFoundException',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], NotFoundResultSample.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The result of the response to be displayed to the user in clients.',
        required: true,
        example: 'Cannot GET /your/address',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], NotFoundResultSample.prototype, "alert", void 0);
//# sourceMappingURL=not-found-result.sample.js.map