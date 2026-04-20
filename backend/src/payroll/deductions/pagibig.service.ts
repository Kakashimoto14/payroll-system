// ============================================================================
// Pag-IBIG (HDMF) Contribution Service
// Philippine-Specific Business Logic
//
// Rates:
//   - Monthly compensation ≤ ₱1,500: Employee 1%, Employer 2%
//   - Monthly compensation > ₱1,500: Employee 2%, Employer 2%
// Maximum contribution: ₱200 employee + ₱200 employer = ₱400/month
// (Based on ₱10,000 computation ceiling for mandatory contributions)
// ============================================================================

import { Injectable } from '@nestjs/common';
import { PagIBIGContribution } from '../../employees/interfaces/tax-processor.interface';

@Injectable()
export class PagIBIGService {
  private readonly LOW_THRESHOLD = 1500;         // ₱1,500 threshold
  private readonly LOW_EMPLOYEE_RATE = 0.01;     // 1% for ≤₱1,500
  private readonly HIGH_EMPLOYEE_RATE = 0.02;    // 2% for >₱1,500
  private readonly EMPLOYER_RATE = 0.02;         // 2% employer (always)
  private readonly MAX_EMPLOYEE_SHARE = 200;     // ₱200 cap
  private readonly MAX_EMPLOYER_SHARE = 200;     // ₱200 cap
  private readonly COMPUTATION_CEILING = 10000;  // ₱10,000 ceiling

  /**
   * Calculate Pag-IBIG contribution based on monthly compensation.
   * Contributions are capped at ₱200 each for employee and employer.
   */
  calculate(monthlyCompensation: number): PagIBIGContribution {
    // Determine employee rate based on compensation threshold
    const employeeRate =
      monthlyCompensation <= this.LOW_THRESHOLD
        ? this.LOW_EMPLOYEE_RATE
        : this.HIGH_EMPLOYEE_RATE;

    // Use the lower of actual compensation or ceiling for computation
    const computationBase = Math.min(
      monthlyCompensation,
      this.COMPUTATION_CEILING,
    );

    // Calculate shares
    let employeeShare = Math.round(computationBase * employeeRate * 100) / 100;
    let employerShare =
      Math.round(computationBase * this.EMPLOYER_RATE * 100) / 100;

    // Apply caps
    employeeShare = Math.min(employeeShare, this.MAX_EMPLOYEE_SHARE);
    employerShare = Math.min(employerShare, this.MAX_EMPLOYER_SHARE);

    return {
      monthlyCompensation: computationBase,
      employeeShare,
      employerShare,
      totalContribution: employeeShare + employerShare,
    };
  }
}
