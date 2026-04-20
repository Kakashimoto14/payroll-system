import { SSSContribution } from '../../employees/interfaces/tax-processor.interface';
export declare class SSSService {
    private readonly SSS_BRACKETS;
    private readonly EMPLOYEE_RATE;
    private readonly EMPLOYER_RATE;
    calculate(monthlyBasicSalary: number): SSSContribution;
    private getMonthlySalaryCredit;
}
