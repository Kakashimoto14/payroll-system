"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagIBIGService = void 0;
const common_1 = require("@nestjs/common");
let PagIBIGService = class PagIBIGService {
    LOW_THRESHOLD = 1500;
    LOW_EMPLOYEE_RATE = 0.01;
    HIGH_EMPLOYEE_RATE = 0.02;
    EMPLOYER_RATE = 0.02;
    MAX_EMPLOYEE_SHARE = 200;
    MAX_EMPLOYER_SHARE = 200;
    COMPUTATION_CEILING = 10000;
    calculate(monthlyCompensation) {
        const employeeRate = monthlyCompensation <= this.LOW_THRESHOLD
            ? this.LOW_EMPLOYEE_RATE
            : this.HIGH_EMPLOYEE_RATE;
        const computationBase = Math.min(monthlyCompensation, this.COMPUTATION_CEILING);
        let employeeShare = Math.round(computationBase * employeeRate * 100) / 100;
        let employerShare = Math.round(computationBase * this.EMPLOYER_RATE * 100) / 100;
        employeeShare = Math.min(employeeShare, this.MAX_EMPLOYEE_SHARE);
        employerShare = Math.min(employerShare, this.MAX_EMPLOYER_SHARE);
        return {
            monthlyCompensation: computationBase,
            employeeShare,
            employerShare,
            totalContribution: employeeShare + employerShare,
        };
    }
};
exports.PagIBIGService = PagIBIGService;
exports.PagIBIGService = PagIBIGService = __decorate([
    (0, common_1.Injectable)()
], PagIBIGService);
//# sourceMappingURL=pagibig.service.js.map