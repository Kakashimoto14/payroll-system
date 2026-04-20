// ============================================================================
// ABSTRACTION — ITaxProcessor Interface
// OOP Pillar: ABSTRACTION
// Purpose: Abstracts all Philippine mandatory deduction calculations.
// The payroll service depends on this interface, not concrete implementations.
// ============================================================================

/**
 * Interface for processing Philippine mandatory deductions.
 * Encapsulates the complexity of SSS, PhilHealth, Pag-IBIG, and
 * Withholding Tax calculations behind a uniform contract.
 */
export interface ITaxProcessor {
  /**
   * Calculate all mandatory deductions for a given gross pay.
   * @param grossPay - The employee's gross pay for the period
   * @param monthlyBasicSalary - The employee's monthly basic salary (for SSS MSC lookup)
   * @returns Complete deduction breakdown
   */
  calculateAllDeductions(
    grossPay: number,
    monthlyBasicSalary: number,
  ): DeductionBreakdown;

  /**
   * Calculate SSS employee contribution based on Monthly Salary Credit.
   * Rate: 5% of MSC (employee share), MSC range: ₱5,000 - ₱35,000
   */
  calculateSSS(monthlyBasicSalary: number): SSSContribution;

  /**
   * Calculate PhilHealth employee contribution.
   * Rate: 2.5% of basic salary (employee share of 5% total)
   * Floor: ₱10,000, Ceiling: ₱100,000
   */
  calculatePhilHealth(monthlyBasicSalary: number): PhilHealthContribution;

  /**
   * Calculate Pag-IBIG (HDMF) employee contribution.
   * Rate: 2% of monthly compensation, capped at ₱200
   */
  calculatePagIBIG(monthlyBasicSalary: number): PagIBIGContribution;

  /**
   * Calculate monthly withholding tax using TRAIN Law brackets.
   * Taxable income = Gross - SSS - PhilHealth - Pag-IBIG
   */
  calculateWithholdingTax(monthlyTaxableIncome: number): number;
}

/**
 * Complete breakdown of all mandatory deductions.
 */
export interface DeductionBreakdown {
  sss: SSSContribution;
  philHealth: PhilHealthContribution;
  pagIBIG: PagIBIGContribution;
  withholdingTax: number;
  totalDeductions: number;
}

/**
 * SSS contribution breakdown.
 */
export interface SSSContribution {
  monthlySalaryCredit: number;
  employeeShare: number;
  employerShare: number;
  totalContribution: number;
  ecContribution: number; // Employees' Compensation
}

/**
 * PhilHealth contribution breakdown.
 */
export interface PhilHealthContribution {
  baseSalary: number;
  employeeShare: number;
  employerShare: number;
  totalPremium: number;
}

/**
 * Pag-IBIG contribution breakdown.
 */
export interface PagIBIGContribution {
  monthlyCompensation: number;
  employeeShare: number;
  employerShare: number;
  totalContribution: number;
}
