"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhilHealthService = void 0;
const common_1 = require("@nestjs/common");
let PhilHealthService = class PhilHealthService {
    PREMIUM_RATE = 0.05;
    SALARY_FLOOR = 10000;
    SALARY_CEILING = 100000;
    MIN_PREMIUM = 500;
    MAX_PREMIUM = 5000;
    calculate(monthlyBasicSalary) {
        let computationBase = monthlyBasicSalary;
        if (computationBase <= this.SALARY_FLOOR) {
            computationBase = this.SALARY_FLOOR;
        }
        else if (computationBase >= this.SALARY_CEILING) {
            computationBase = this.SALARY_CEILING;
        }
        let totalPremium = computationBase * this.PREMIUM_RATE;
        totalPremium = Math.max(this.MIN_PREMIUM, Math.min(this.MAX_PREMIUM, totalPremium));
        totalPremium = Math.round(totalPremium * 100) / 100;
        const employeeShare = Math.round((totalPremium / 2) * 100) / 100;
        const employerShare = totalPremium - employeeShare;
        return {
            baseSalary: computationBase,
            employeeShare,
            employerShare,
            totalPremium,
        };
    }
};
exports.PhilHealthService = PhilHealthService;
exports.PhilHealthService = PhilHealthService = __decorate([
    (0, common_1.Injectable)()
], PhilHealthService);
//# sourceMappingURL=philhealth.service.js.map