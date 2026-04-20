// ============================================================================
// SSS (Social Security System) Contribution Service
// Philippine-Specific Business Logic
//
// Rate: 15% of Monthly Salary Credit (MSC)
// Split: Employee 5%, Employer 10%
// MSC Range: ₱5,000 (minimum) to ₱35,000 (maximum)
// Effective: January 2025 onwards (RA 11199)
// ============================================================================

import { Injectable } from '@nestjs/common';
import { SSSContribution } from '../../employees/interfaces/tax-processor.interface';

/**
 * Complete SSS contribution table with Monthly Salary Credit (MSC) brackets.
 * Each bracket maps a compensation range to the corresponding MSC.
 */
interface SSSBracket {
  minCompensation: number;
  maxCompensation: number;
  monthlySalaryCredit: number;
}

@Injectable()
export class SSSService {
  // ========================================================================
  // SSS Contribution Table — 2025-2026
  // Based on the official SSS schedule under RA 11199
  // MSC Range: ₱5,000 to ₱35,000
  // ========================================================================
  private readonly SSS_BRACKETS: SSSBracket[] = [
    { minCompensation: 0, maxCompensation: 4249.99, monthlySalaryCredit: 4000 },
    { minCompensation: 4250, maxCompensation: 4749.99, monthlySalaryCredit: 4500 },
    { minCompensation: 4750, maxCompensation: 5249.99, monthlySalaryCredit: 5000 },
    { minCompensation: 5250, maxCompensation: 5749.99, monthlySalaryCredit: 5500 },
    { minCompensation: 5750, maxCompensation: 6249.99, monthlySalaryCredit: 6000 },
    { minCompensation: 6250, maxCompensation: 6749.99, monthlySalaryCredit: 6500 },
    { minCompensation: 6750, maxCompensation: 7249.99, monthlySalaryCredit: 7000 },
    { minCompensation: 7250, maxCompensation: 7749.99, monthlySalaryCredit: 7500 },
    { minCompensation: 7750, maxCompensation: 8249.99, monthlySalaryCredit: 8000 },
    { minCompensation: 8250, maxCompensation: 8749.99, monthlySalaryCredit: 8500 },
    { minCompensation: 8750, maxCompensation: 9249.99, monthlySalaryCredit: 9000 },
    { minCompensation: 9250, maxCompensation: 9749.99, monthlySalaryCredit: 9500 },
    { minCompensation: 9750, maxCompensation: 10249.99, monthlySalaryCredit: 10000 },
    { minCompensation: 10250, maxCompensation: 10749.99, monthlySalaryCredit: 10500 },
    { minCompensation: 10750, maxCompensation: 11249.99, monthlySalaryCredit: 11000 },
    { minCompensation: 11250, maxCompensation: 11749.99, monthlySalaryCredit: 11500 },
    { minCompensation: 11750, maxCompensation: 12249.99, monthlySalaryCredit: 12000 },
    { minCompensation: 12250, maxCompensation: 12749.99, monthlySalaryCredit: 12500 },
    { minCompensation: 12750, maxCompensation: 13249.99, monthlySalaryCredit: 13000 },
    { minCompensation: 13250, maxCompensation: 13749.99, monthlySalaryCredit: 13500 },
    { minCompensation: 13750, maxCompensation: 14249.99, monthlySalaryCredit: 14000 },
    { minCompensation: 14250, maxCompensation: 14749.99, monthlySalaryCredit: 14500 },
    { minCompensation: 14750, maxCompensation: 15249.99, monthlySalaryCredit: 15000 },
    { minCompensation: 15250, maxCompensation: 15749.99, monthlySalaryCredit: 15500 },
    { minCompensation: 15750, maxCompensation: 16249.99, monthlySalaryCredit: 16000 },
    { minCompensation: 16250, maxCompensation: 16749.99, monthlySalaryCredit: 16500 },
    { minCompensation: 16750, maxCompensation: 17249.99, monthlySalaryCredit: 17000 },
    { minCompensation: 17250, maxCompensation: 17749.99, monthlySalaryCredit: 17500 },
    { minCompensation: 17750, maxCompensation: 18249.99, monthlySalaryCredit: 18000 },
    { minCompensation: 18250, maxCompensation: 18749.99, monthlySalaryCredit: 18500 },
    { minCompensation: 18750, maxCompensation: 19249.99, monthlySalaryCredit: 19000 },
    { minCompensation: 19250, maxCompensation: 19749.99, monthlySalaryCredit: 19500 },
    { minCompensation: 19750, maxCompensation: 20249.99, monthlySalaryCredit: 20000 },
    { minCompensation: 20250, maxCompensation: 20749.99, monthlySalaryCredit: 20500 },
    { minCompensation: 20750, maxCompensation: 21249.99, monthlySalaryCredit: 21000 },
    { minCompensation: 21250, maxCompensation: 21749.99, monthlySalaryCredit: 21500 },
    { minCompensation: 21750, maxCompensation: 22249.99, monthlySalaryCredit: 22000 },
    { minCompensation: 22250, maxCompensation: 22749.99, monthlySalaryCredit: 22500 },
    { minCompensation: 22750, maxCompensation: 23249.99, monthlySalaryCredit: 23000 },
    { minCompensation: 23250, maxCompensation: 23749.99, monthlySalaryCredit: 23500 },
    { minCompensation: 23750, maxCompensation: 24249.99, monthlySalaryCredit: 24000 },
    { minCompensation: 24250, maxCompensation: 24749.99, monthlySalaryCredit: 24500 },
    { minCompensation: 24750, maxCompensation: 25249.99, monthlySalaryCredit: 25000 },
    { minCompensation: 25250, maxCompensation: 25749.99, monthlySalaryCredit: 25500 },
    { minCompensation: 25750, maxCompensation: 26249.99, monthlySalaryCredit: 26000 },
    { minCompensation: 26250, maxCompensation: 26749.99, monthlySalaryCredit: 26500 },
    { minCompensation: 26750, maxCompensation: 27249.99, monthlySalaryCredit: 27000 },
    { minCompensation: 27250, maxCompensation: 27749.99, monthlySalaryCredit: 27500 },
    { minCompensation: 27750, maxCompensation: 28249.99, monthlySalaryCredit: 28000 },
    { minCompensation: 28250, maxCompensation: 28749.99, monthlySalaryCredit: 28500 },
    { minCompensation: 28750, maxCompensation: 29249.99, monthlySalaryCredit: 29000 },
    { minCompensation: 29250, maxCompensation: 29749.99, monthlySalaryCredit: 29500 },
    { minCompensation: 29750, maxCompensation: 30249.99, monthlySalaryCredit: 30000 },
    { minCompensation: 30250, maxCompensation: 30749.99, monthlySalaryCredit: 30500 },
    { minCompensation: 30750, maxCompensation: 31249.99, monthlySalaryCredit: 31000 },
    { minCompensation: 31250, maxCompensation: 31749.99, monthlySalaryCredit: 31500 },
    { minCompensation: 31750, maxCompensation: 32249.99, monthlySalaryCredit: 32000 },
    { minCompensation: 32250, maxCompensation: 32749.99, monthlySalaryCredit: 32500 },
    { minCompensation: 32750, maxCompensation: 33249.99, monthlySalaryCredit: 33000 },
    { minCompensation: 33250, maxCompensation: 33749.99, monthlySalaryCredit: 33500 },
    { minCompensation: 33750, maxCompensation: 34249.99, monthlySalaryCredit: 34000 },
    { minCompensation: 34250, maxCompensation: 34749.99, monthlySalaryCredit: 34500 },
    { minCompensation: 34750, maxCompensation: Infinity, monthlySalaryCredit: 35000 },
  ];

  private readonly EMPLOYEE_RATE = 0.05;  // 5% employee share
  private readonly EMPLOYER_RATE = 0.10;  // 10% employer share

  /**
   * Calculate SSS contribution based on monthly salary.
   * Looks up the MSC bracket and applies the 5%/10% split.
   */
  calculate(monthlyBasicSalary: number): SSSContribution {
    const msc = this.getMonthlySalaryCredit(monthlyBasicSalary);
    const employeeShare = Math.round(msc * this.EMPLOYEE_RATE * 100) / 100;
    const employerShare = Math.round(msc * this.EMPLOYER_RATE * 100) / 100;
    const totalContribution = employeeShare + employerShare;

    // Employees' Compensation (EC) — employer-only contribution
    const ecContribution = msc >= 15000 ? 30 : 10;

    return {
      monthlySalaryCredit: msc,
      employeeShare,
      employerShare,
      totalContribution,
      ecContribution,
    };
  }

  /**
   * Look up the Monthly Salary Credit (MSC) for a given compensation.
   */
  private getMonthlySalaryCredit(monthlyCompensation: number): number {
    // Enforce minimum MSC
    if (monthlyCompensation <= 0) return 5000;

    const bracket = this.SSS_BRACKETS.find(
      (b) =>
        monthlyCompensation >= b.minCompensation &&
        monthlyCompensation <= b.maxCompensation,
    );

    return bracket ? bracket.monthlySalaryCredit : 35000; // Max MSC
  }
}
