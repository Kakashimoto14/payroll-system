import { BaseEmployee } from './employee.base';
export declare class ShiftManager extends BaseEmployee {
    private _workingDaysPerMonth;
    constructor(employeeId: string, firstName: string, lastName: string, email: string, phone: string, monthlySalary?: number, workingDaysPerMonth?: number, dateHired?: Date);
    get workingDaysPerMonth(): number;
    calculateGrossPay(hoursWorked: number, overtimeHours: number, nightDiffHours: number, holidayHours: number, isRestDay: boolean): number;
    calculateOvertimePay(overtimeHours: number, isRestDay: boolean): number;
    private calculateHolidayPay;
    getEmployeeType(): string;
}
