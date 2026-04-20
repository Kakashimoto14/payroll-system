// ============================================================================
// PhilHealth Contribution Service
// Philippine-Specific Business Logic
//
// Rate: 5% of monthly basic salary (shared 50-50: employee 2.5%, employer 2.5%)
// Floor: ₱10,000 (minimum salary for computation)
// Ceiling: ₱100,000 (maximum salary for computation)
// Min Premium: ₱500/month (₱250 each)
// Max Premium: ₱5,000/month (₱2,500 each)
// Effective: 2025 onwards (UHC Law)
// ============================================================================

import { Injectable } from '@nestjs/common';
import { PhilHealthContribution } from '../../employees/interfaces/tax-processor.interface';

@Injectable()
export class PhilHealthService {
  private readonly PREMIUM_RATE = 0.05;       // 5% total premium
  private readonly SALARY_FLOOR = 10000;       // ₱10,000 minimum
  private readonly SALARY_CEILING = 100000;    // ₱100,000 maximum
  private readonly MIN_PREMIUM = 500;          // ₱500 minimum monthly premium
  private readonly MAX_PREMIUM = 5000;         // ₱5,000 maximum monthly premium

  /**
   * Calculate PhilHealth contribution based on monthly basic salary.
   * The 5% premium is split equally between employee and employer.
   */
  calculate(monthlyBasicSalary: number): PhilHealthContribution {
    // Apply floor and ceiling
    let computationBase = monthlyBasicSalary;

    if (computationBase <= this.SALARY_FLOOR) {
      computationBase = this.SALARY_FLOOR;
    } else if (computationBase >= this.SALARY_CEILING) {
      computationBase = this.SALARY_CEILING;
    }

    // Calculate total premium (5% of computation base)
    let totalPremium = computationBase * this.PREMIUM_RATE;

    // Enforce min/max bounds
    totalPremium = Math.max(this.MIN_PREMIUM, Math.min(this.MAX_PREMIUM, totalPremium));

    // Round to 2 decimal places
    totalPremium = Math.round(totalPremium * 100) / 100;

    // 50-50 split
    const employeeShare = Math.round((totalPremium / 2) * 100) / 100;
    const employerShare = totalPremium - employeeShare;

    return {
      baseSalary: computationBase,
      employeeShare,
      employerShare,
      totalPremium,
    };
  }
}
