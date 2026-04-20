import { BaseEmployee } from './employee.base';
export declare class HRAdmin extends BaseEmployee {
    private _isOvertimeExempt;
    constructor(employeeId: string, firstName: string, lastName: string, email: string, phone: string, monthlySalary?: number, isOvertimeExempt?: boolean, dateHired?: Date);
    get isOvertimeExempt(): boolean;
    calculateGrossPay(hoursWorked: number, overtimeHours: number, nightDiffHours: number, holidayHours: number, isRestDay: boolean): number;
    calculateOvertimePay(overtimeHours: number, isRestDay: boolean): number;
    getEmployeeType(): string;
}
