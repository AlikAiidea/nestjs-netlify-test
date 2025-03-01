"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiErrorResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const forbidden_result_sample_1 = require("../samples/forbidden-result.sample");
const not_found_result_sample_1 = require("../samples/not-found-result.sample");
const unauthorized_result_sample_1 = require("../samples/unauthorized-result.sample");
const ApiErrorResponse = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiUnauthorizedResponse)({
        description: 'User authentication or authorization failed',
        type: unauthorized_result_sample_1.UnauthorizedResultSample,
    }), (0, swagger_1.ApiForbiddenResponse)({
        description: 'User is forbidden from accessing the endpoint',
        type: forbidden_result_sample_1.ForbiddenResultSample,
    }), (0, swagger_1.ApiNotFoundResponse)({
        description: 'The server cannot find the requested ad',
        type: not_found_result_sample_1.NotFoundResultSample,
    }));
};
exports.ApiErrorResponse = ApiErrorResponse;
//# sourceMappingURL=api-error-response.decorator.js.map