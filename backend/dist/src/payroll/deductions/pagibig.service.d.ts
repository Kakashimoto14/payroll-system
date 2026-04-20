import { PagIBIGContribution } from '../../employees/interfaces/tax-processor.interface';
export declare class PagIBIGService {
    private readonly LOW_THRESHOLD;
    private readonly LOW_EMPLOYEE_RATE;
    private readonly HIGH_EMPLOYEE_RATE;
    private readonly EMPLOYER_RATE;
    private readonly MAX_EMPLOYEE_SHARE;
    private readonly MAX_EMPLOYER_SHARE;
    private readonly COMPUTATION_CEILING;
    calculate(monthlyCompensation: number): PagIBIGContribution;
}
