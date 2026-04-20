"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollCalculatorFactory = void 0;
const common_1 = require("@nestjs/common");
const crew_member_model_1 = require("../../employees/models/crew-member.model");
const shift_manager_model_1 = require("../../employees/models/shift-manager.model");
const hr_admin_model_1 = require("../../employees/models/hr-admin.model");
let PayrollCalculatorFactory = class PayrollCalculatorFactory {
    createCalculator(role, employeeData) {
        switch (role) {
            case 'CREW_MEMBER':
                return new crew_member_model_1.CrewMember(employeeData.employeeId, employeeData.firstName, employeeData.lastName, employeeData.email, employeeData.phone, employeeData.hourlyRate, employeeData.dailyRate);
            case 'SHIFT_MANAGER':
                return new shift_manager_model_1.ShiftManager(employeeData.employeeId, employeeData.firstName, employeeData.lastName, employeeData.email, employeeData.phone, employeeData.monthlySalary || 25000);
            case 'HR_ADMIN':
                return new hr_admin_model_1.HRAdmin(employeeData.employeeId, employeeData.firstName, employeeData.lastName, employeeData.email, employeeData.phone, employeeData.monthlySalary || 35000);
            default:
                return new crew_member_model_1.CrewMember(employeeData.employeeId, employeeData.firstName, employeeData.lastName, employeeData.email, employeeData.phone, employeeData.hourlyRate, employeeData.dailyRate);
        }
    }
};
exports.PayrollCalculatorFactory = PayrollCalculatorFactory;
exports.PayrollCalculatorFactory = PayrollCalculatorFactory = __decorate([
    (0, common_1.Injectable)()
], PayrollCalculatorFactory);
//# sourceMappingURL=payroll-calculator.factory.js.map