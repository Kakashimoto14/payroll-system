// ============================================================================
// INHERITANCE + POLYMORPHISM — ShiftManager Class
// OOP Pillars: INHERITANCE (extends BaseEmployee)
//              POLYMORPHISM (overrides calculateGrossPay for monthly salary)
//
// ShiftManager represents salaried shift managers at McDonald's.
// Pay is computed from a fixed monthly salary, prorated by actual working days.
// ============================================================================

import { BaseEmployee } from './employee.base';

/**
 * INHERITANCE: ShiftManager extends BaseEmployee, inheriting all shared
 * properties and the nightDiffPay calculation.
 *
 * POLYMORPHISM: Overrides calculateGrossPay() to use a fixed monthly salary
 * prorated by working days — fundamentally different from CrewMember's
 * hourly-based calculation. Same method name, different behavior.
 */
export class ShiftManager extends BaseEmployee {
  /** Number of standard working days per month (for proration) */
  private _workingDaysPerMonth: number;

  constructor(
    employeeId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    monthlySalary: number = 25000.0,  // Typical shift manager salary
    workingDaysPerMonth: number = 22,  // Average working days
    dateHired: Date = new Date(),
  ) {
    // Calculate derived rates from monthly salary
    const dailyRate = monthlySalary / workingDaysPerMonth;
    const hourlyRate = dailyRate / 8; // For OT/night diff calculations

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

    this._workingDaysPerMonth = workingDaysPerMonth;
  }

  get workingDaysPerMonth(): number {
    return this._workingDaysPerMonth;
  }

  // ========================================================================
  // POLYMORPHISM — Override calculateGrossPay for monthly salary proration
  //
  // ShiftManager gross pay = (monthlySalary / workingDays) × daysWorked + OT + NightDiff
  //
  // Even though hours are tracked dynamically, the base pay comes from
  // the fixed monthly salary, prorated by attendance days.
  // ========================================================================

  /**
   * POLYMORPHISM: This method is OVERRIDDEN from BaseEmployee.
   * ShiftManager uses fixed monthly salary prorated by actual attendance.
   *
   * @param hoursWorked - Total hours worked in the period (for reference/OT calc)
   * @param overtimeHours - Hours beyond standard shift
   * @param nightDiffHours - Hours between 10PM-6AM
   * @param holidayHours - Hours worked on declared holidays
   * @param isRestDay - Whether shifts included rest days
   * @returns Total gross pay for the period
   */
  calculateGrossPay(
    hoursWorked: number,
    overtimeHours: number,
    nightDiffHours: number,
    holidayHours: number,
    isRestDay: boolean,
  ): number {
    // For salaried managers, base pay is the monthly salary
    // (prorated if this is a semi-monthly period = monthlySalary / 2)
    const basePay = this._monthlySalary / 2; // Semi-monthly pay period

    // Overtime premium (managers can still earn OT)
    const overtimePay = this.calculateOvertimePay(overtimeHours, isRestDay);

    // Night shift differential
    const nightDiffPay = this.calculateNightDiffPay(nightDiffHours);

    // Holiday premium
    const holidayPay = this.calculateHolidayPay(holidayHours, isRestDay);

    return basePay + overtimePay + nightDiffPay + holidayPay;
  }

  /**
   * POLYMORPHISM: ShiftManager overtime uses derived hourly rate from monthly salary.
   * Regular day OT: +25%
   * Rest day OT: +30%
   */
  calculateOvertimePay(overtimeHours: number, isRestDay: boolean): number {
    if (overtimeHours <= 0) return 0;

    const otMultiplier = isRestDay ? 0.30 : 0.25;
    return this._hourlyRate * (1 + otMultiplier) * overtimeHours;
  }

  /**
   * Calculate holiday premium for salaried managers.
   */
  private calculateHolidayPay(
    holidayHours: number,
    isRestDay: boolean,
  ): number {
    if (holidayHours <= 0) return 0;

    const holidayMultiplier = isRestDay ? 1.30 : 1.00;
    return this._hourlyRate * holidayMultiplier * holidayHours;
  }

  /**
   * POLYMORPHISM: Returns 'SHIFT_MANAGER' — different from CrewMember's return.
   */
  getEmployeeType(): string {
    return 'SHIFT_MANAGER';
  }
}
