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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const version_dto_1 = require("./common/dto/version.dto");
let AppController = exports.AppController = class AppController {
    showVersion() {
        console.log('into showVersion');
        return { version: process.env.npm_package_version };
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Project version',
        description: `Displays the current version of the project`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: version_dto_1.Version }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "showVersion", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('Version'),
    (0, swagger_1.ApiBasicAuth)('API_ACCESS_TOKEN'),
    (0, swagger_1.ApiBearerAuth)('AUTHORIZATION'),
    (0, common_1.Controller)()
], AppController);
//# sourceMappingURL=app.controller.js.map