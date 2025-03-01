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
exports.ForbiddenResultSample = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ForbiddenResultSample {
    constructor() {
        this.statusCode = 403;
        this.error = 'Forbidden';
        this.name = 'Forbidden';
        this.alert = 'Forbidden resource';
    }
}
exports.ForbiddenResultSample = ForbiddenResultSample;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code based on status and response result.',
        required: true,
        example: 403,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], ForbiddenResultSample.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional, returns the reason for the error if not successful.',
        required: false,
        example: 'Forbidden',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ForbiddenResultSample.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The message associated with the response',
        required: true,
        example: 'Forbidden',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], ForbiddenResultSample.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The result of the response to be displayed to the user in clients.',
        required: true,
        example: 'Forbidden resource',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], ForbiddenResultSample.prototype, "alert", void 0);
//# sourceMappingURL=forbidden-result.sample.js.map