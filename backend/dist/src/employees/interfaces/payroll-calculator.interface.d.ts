export interface IPayrollCalculator {
    calculateGrossPay(hoursWorked: number, overtimeHours: number, nightDiffHours: number, holidayHours: number, isRestDay: boolean): number;
    calculateOvertimePay(overtimeHours: number, isRestDay: boolean): number;
    calculateNightDiffPay(nightDiffHours: number): number;
    getHourlyRate(): number;
    getEmployeeType(): string;
}
