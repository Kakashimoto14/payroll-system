import { PhilHealthContribution } from '../../employees/interfaces/tax-processor.interface';
export declare class PhilHealthService {
    private readonly PREMIUM_RATE;
    private readonly SALARY_FLOOR;
    private readonly SALARY_CEILING;
    private readonly MIN_PREMIUM;
    private readonly MAX_PREMIUM;
    calculate(monthlyBasicSalary: number): PhilHealthContribution;
}
