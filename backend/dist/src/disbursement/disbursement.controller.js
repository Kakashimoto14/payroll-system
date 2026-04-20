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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisbursementController = void 0;
const common_1 = require("@nestjs/common");
const disbursement_service_1 = require("./disbursement.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let DisbursementController = class DisbursementController {
    disbursementService;
    constructor(disbursementService) {
        this.disbursementService = disbursementService;
    }
    async disburse(payrollId) {
        return this.disbursementService.disburse(payrollId);
    }
    async bulkDisburse(body) {
        return this.disbursementService.bulkDisburse(new Date(body.periodStart), new Date(body.periodEnd));
    }
};
exports.DisbursementController = DisbursementController;
__decorate([
    (0, common_1.Post)(':payrollId'),
    (0, roles_decorator_1.Roles)('HR_ADMIN'),
    __param(0, (0, common_1.Param)('payrollId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DisbursementController.prototype, "disburse", null);
__decorate([
    (0, common_1.Post)('bulk/process'),
    (0, roles_decorator_1.Roles)('HR_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DisbursementController.prototype, "bulkDisburse", null);
exports.DisbursementController = DisbursementController = __decorate([
    (0, common_1.Controller)('api/disbursement'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [disbursement_service_1.DisbursementService])
], DisbursementController);
//# sourceMappingURL=disbursement.controller.js.map