"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollModule = void 0;
const common_1 = require("@nestjs/common");
const payroll_service_1 = require("./payroll.service");
const payroll_controller_1 = require("./payroll.controller");
const payroll_calculator_factory_1 = require("./calculators/payroll-calculator.factory");
const sss_service_1 = require("./deductions/sss.service");
const philhealth_service_1 = require("./deductions/philhealth.service");
const pagibig_service_1 = require("./deductions/pagibig.service");
const withholding_tax_service_1 = require("./deductions/withholding-tax.service");
let PayrollModule = class PayrollModule {
};
exports.PayrollModule = PayrollModule;
exports.PayrollModule = PayrollModule = __decorate([
    (0, common_1.Module)({
        controllers: [payroll_controller_1.PayrollController],
        providers: [
            payroll_service_1.PayrollService,
            payroll_calculator_factory_1.PayrollCalculatorFactory,
            sss_service_1.SSSService,
            philhealth_service_1.PhilHealthService,
            pagibig_service_1.PagIBIGService,
            withholding_tax_service_1.WithholdingTaxService,
        ],
        exports: [payroll_service_1.PayrollService, sss_service_1.SSSService, philhealth_service_1.PhilHealthService, pagibig_service_1.PagIBIGService, withholding_tax_service_1.WithholdingTaxService],
    })
], PayrollModule);
//# sourceMappingURL=payroll.module.js.map