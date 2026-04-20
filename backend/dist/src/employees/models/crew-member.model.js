"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrewMember = void 0;
const employee_base_1 = require("./employee.base");
class CrewMember extends employee_base_1.BaseEmployee {
    constructor(employeeId, firstName, lastName, email, phone, hourlyRate = 68.75, dailyRate = 550.0, dateHired = new Date()) {
        super(employeeId, firstName, lastName, email, phone, dailyRate, hourlyRate, 0, dateHired);
    }
    calculateGrossPay(hoursWorked, overtimeHours, nightDiffHours, holidayHours, isRestDay) {
        const basePay = this._hourlyRate * hoursWorked;
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
        return 'CREW_MEMBER';
    }
}
exports.CrewMember = CrewMember;
//# sourceMappingURL=crew-member.model.js.map