import { IPayrollCalculator } from '../../employees/interfaces/payroll-calculator.interface';
export declare class PayrollCalculatorFactory {
    createCalculator(role: string, employeeData: {
        employeeId: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        hourlyRate: number;
        dailyRate: number;
        monthlySalary?: number;
    }): IPayrollCalculator;
}
