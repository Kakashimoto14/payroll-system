"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftManager = void 0;
const employee_base_1 = require("./employee.base");
class ShiftManager extends employee_base_1.BaseEmployee {
    _workingDaysPerMonth;
    constructor(employeeId, firstName, lastName, email, phone, monthlySalary = 25000.0, workingDaysPerMonth = 22, dateHired = new Date()) {
        const dailyRate = monthlySalary / workingDaysPerMonth;
        const hourlyRate = dailyRate / 8;
        super(employeeId, firstName, lastName, email, phone, dailyRate, hourlyRate, monthlySalary, dateHired);
        this._workingDaysPerMonth = workingDaysPerMonth;
    }
    get workingDaysPerMonth() {
        return this._workingDaysPerMonth;
    }
    calculateGrossPay(hoursWorked, overtimeHours, nightDiffHours, holidayHours, isRestDay) {
        const basePay = this._monthlySalary / 2;
        const overtimePay = this.calculateOvertimePay(overtimeHours, isRestDay);
        const nightDiffPay = this.calculateNightDiffPay(nightDiffHours);
        const holidayPay = this.calculateHolidayPay(holidayHours, isRestDay);
        return basePay + overtimePay + nightDiffPay + holidayPay;
    }
    calculateOvertimePay(overtimeHours, isRestDay) {
        if (overtimeHours <= 0)
            return 0;
        const otMultiplier = isRestDay ? 0.30 : 0.25;
        return this._hourlyRate * (1 + otMultiplier) * overtimeHours;
    }
    calculateHolidayPay(holidayHours, isRestDay) {
        if (holidayHours <= 0)
            return 0;
        const holidayMultiplier = isRestDay ? 1.30 : 1.00;
        return this._hourlyRate * holidayMultiplier * holidayHours;
    }
    getEmployeeType() {
        return 'SHIFT_MANAGER';
    }
}
exports.ShiftManager = ShiftManager;
//# sourceMappingURL=shift-manager.model.js.map