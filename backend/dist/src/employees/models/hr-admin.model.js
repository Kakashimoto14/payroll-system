"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HRAdmin = void 0;
const employee_base_1 = require("./employee.base");
class HRAdmin extends employee_base_1.BaseEmployee {
    _isOvertimeExempt;
    constructor(employeeId, firstName, lastName, email, phone, monthlySalary = 35000.0, isOvertimeExempt = true, dateHired = new Date()) {
        const dailyRate = monthlySalary / 22;
        const hourlyRate = dailyRate / 8;
        super(employeeId, firstName, lastName, email, phone, dailyRate, hourlyRate, monthlySalary, dateHired);
        this._isOvertimeExempt = isOvertimeExempt;
    }
    get isOvertimeExempt() {
        return this._isOvertimeExempt;
    }
    calculateGrossPay(hoursWorked, overtimeHours, nightDiffHours, holidayHours, isRestDay) {
        const basePay = this._monthlySalary / 2;
        const overtimePay = this._isOvertimeExempt
            ? 0
            : this.calculateOvertimePay(overtimeHours, isRestDay);
        const nightDiffPay = this.calculateNightDiffPay(nightDiffHours);
        return basePay + overtimePay + nightDiffPay;
    }
    calculateOvertimePay(overtimeHours, isRestDay) {
        if (this._isOvertimeExempt || overtimeHours <= 0)
            return 0;
        const otMultiplier = isRestDay ? 0.30 : 0.25;
        return this._hourlyRate * (1 + otMultiplier) * overtimeHours;
    }
    getEmployeeType() {
        return 'HR_ADMIN';
    }
}
exports.HRAdmin = HRAdmin;
//# sourceMappingURL=hr-admin.model.js.map