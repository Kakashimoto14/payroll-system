// ============================================================================
// INHERITANCE + POLYMORPHISM — HRAdmin Class
// OOP Pillars: INHERITANCE (extends BaseEmployee)
//              POLYMORPHISM (overrides calculateGrossPay for admin salary)
//
// HRAdmin represents HR/Admin personnel with highest access privileges.
// Pay structure is similar to ShiftManager (fixed monthly) but with
// different salary tiers and no overtime (exempt status).
// ============================================================================

import { BaseEmployee } from './employee.base';

/**
 * INHERITANCE: HRAdmin extends BaseEmployee.
 * POLYMORPHISM: Overrides calculateGrossPay() — admins are typically
 * overtime-exempt (no OT pay), receiving a fixed monthly salary only.
 */
export class HRAdmin extends BaseEmployee {
  /** Whether this admin is overtime-exempt */
  private _isOvertimeExempt: boolean;

  constructor(
    employeeId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    monthlySalary: number = 35000.0,   // Typical HR admin salary
    isOvertimeExempt: boolean = true,
    dateHired: Date = new Date(),
  ) {
    const dailyRate = monthlySalary / 22;
    const hourlyRate = dailyRate / 8;

    // INHERITANCE: Call parent constructor
    super(
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      dailyRate,
      hourlyRate,
      monthlySalary,
      dateHired,
    );

    this._isOvertimeExempt = isOvertimeExempt;
  }

  get isOvertimeExempt(): boolean {
    return this._isOvertimeExempt;
  }

  // ========================================================================
  // POLYMORPHISM — Override calculateGrossPay for fixed admin salary
  //
  // HRAdmin gross pay = fixed monthlySalary / 2 (semi-monthly)
  // No overtime pay if overtime-exempt.
  // ========================================================================

  /**
   * POLYMORPHISM: HRAdmin gets fixed monthly salary.
   * Overtime is typically not applicable for admin/exempt employees.
   * Night differential still applies per Philippine Labor Code.
   */
  calculateGrossPay(
    hoursWorked: number,
    overtimeHours: number,
    nightDiffHours: number,
    holidayHours: number,
    isRestDay: boolean,
  ): number {
    // Fixed semi-monthly salary (monthlySalary / 2 for semi-monthly pay period)
    const basePay = this._monthlySalary / 2;

    // Overtime — only if NOT exempt
    const overtimePay = this._isOvertimeExempt
      ? 0
      : this.calculateOvertimePay(overtimeHours, isRestDay);

    // Night differential still applies
    const nightDiffPay = this.calculateNightDiffPay(nightDiffHours);

    return basePay + overtimePay + nightDiffPay;
  }

  /**
   * POLYMORPHISM: HRAdmin overtime — returns 0 if overtime-exempt.
   * Otherwise calculates at standard rates.
   */
  calculateOvertimePay(overtimeHours: number, isRestDay: boolean): number {
    if (this._isOvertimeExempt || overtimeHours <= 0) return 0;

    const otMultiplier = isRestDay ? 0.30 : 0.25;
    return this._hourlyRate * (1 + otMultiplier) * overtimeHours;
  }

  /**
   * POLYMORPHISM: Returns 'HR_ADMIN'.
   */
  getEmployeeType(): string {
    return 'HR_ADMIN';
  }
}
