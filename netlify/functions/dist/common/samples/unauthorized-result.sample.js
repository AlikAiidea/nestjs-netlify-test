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
exports.UnauthorizedResultSample = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UnauthorizedResultSample {
    constructor() {
        this.statusCode = 401;
        this.error = 'The token is not valid or expired!';
        this.name = 'HttpException';
        this.alert = 'The token is not valid or expired!';
    }
}
exports.UnauthorizedResultSample = UnauthorizedResultSample;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code based on status and response result.',
        required: true,
        example: 401,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], UnauthorizedResultSample.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional, returns the reason for the error if not successful.',
        required: false,
        example: 'The token is not valid or expired!',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnauthorizedResultSample.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name associated with the response',
        required: true,
        example: 'HttpException',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], UnauthorizedResultSample.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The result of the response to be displayed to the user in clients.',
        required: true,
        example: 'The token is not valid or expired!',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], UnauthorizedResultSample.prototype, "alert", void 0);
//# sourceMappingURL=unauthorized-result.sample.js.map