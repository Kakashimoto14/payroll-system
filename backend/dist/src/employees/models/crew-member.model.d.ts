import { BaseEmployee } from './employee.base';
export declare class CrewMember extends BaseEmployee {
    constructor(employeeId: string, firstName: string, lastName: string, email: string, phone: string, hourlyRate?: number, dailyRate?: number, dateHired?: Date);
    calculateGrossPay(hoursWorked: number, overtimeHours: number, nightDiffHours: number, holidayHours: number, isRestDay: boolean): number;
    calculateOvertimePay(overtimeHours: number, isRestDay: boolean): number;
    private calculateHolidayPay;
    getEmployeeType(): string;
}
