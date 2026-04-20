// ============================================================================
// INHERITANCE + POLYMORPHISM — CrewMember Class
// OOP Pillars: INHERITANCE (extends BaseEmployee)
//              POLYMORPHISM (overrides calculateGrossPay, calculateOvertimePay)
//
// CrewMember represents hourly-paid McDonald's crew members.
// Pay is calculated DYNAMICALLY based on actual hours clocked — never hardcoded.
// ============================================================================

import { BaseEmployee } from './employee.base';

/**
 * INHERITANCE: CrewMember extends BaseEmployee, inheriting all shared
 * properties (name, email, government IDs) and behaviors (nightDiffPay).
 *
 * POLYMORPHISM: Overrides calculateGrossPay() to compute pay based on
 * hourly rate × actual hours worked. This is fundamentally different from
 * ShiftManager's fixed monthly salary calculation.
 */
export class CrewMember extends BaseEmployee {
  constructor(
    employeeId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    hourlyRate: number = 68.75,   // ₱68.75/hr (Rizal minimum wage ₱550/8hrs)
    dailyRate: number = 550.0,    // ₱550/day (Rizal 1st-class municipality)
    dateHired: Date = new Date(),
  ) {
    // INHERITANCE: Call parent constructor
    super(
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      dailyRate,
      hourlyRate,
      0, // No fixed monthly salary for crew members
      dateHired,
    );
  }

  // ========================================================================
  // POLYMORPHISM — Override calculateGrossPay for hourly computation
  //
  // CrewMember gross pay = (hourlyRate × hoursWorked) + overtimePay + nightDiffPay
  //
  // CRITICAL: hoursWorked is DYNAMIC — it comes from actual clock-in/clock-out
  // timestamps. A crew member might work 4 hours, 5.5 hours, 7 hours, etc.
  // We NEVER assume a fixed 8-hour shift.
  // ========================================================================

  /**
   * POLYMORPHISM: This method is OVERRIDDEN from BaseEmployee.
   * CrewMember pay is purely hourly-based with dynamic hours.
   *
   * @param hoursWorked - Actual hours from clock records (e.g., 4, 5.5, 7.25)
   * @param overtimeHours - Hours beyond scheduled shift
   * @param nightDiffHours - Hours between 10PM-6AM
   * @param holidayHours - Hours worked on declared holidays
   * @param isRestDay - Whether the day is the employee's rest day
   * @returns Total gross pay for the period
   */
  calculateGrossPay(
    hoursWorked: number,
    overtimeHours: number,
    nightDiffHours: number,
    holidayHours: number,
    isRestDay: boolean,
  ): number {
    // Base pay: hourly rate × actual hours (dynamic, not fixed)
    const basePay = this._hourlyRate * hoursWorked;

    // Overtime premium
    const overtimePay = this.calculateOvertimePay(overtimeHours, isRestDay);

    // Night shift differential: +10% for 10PM-6AM hours
    const nightDiffPay = this.calculateNightDiffPay(nightDiffHours);

    // Holiday pay: additional 100% for regular holidays, 30% for special
    const holidayPay = this.calculateHolidayPay(holidayHours, isRestDay);

    return basePay + overtimePay + nightDiffPay + holidayPay;
  }

  /**
   * POLYMORPHISM: Override overtime calculation for crew members.
   * Regular day OT: +25% of hourly rate per OT hour
   * Rest day / Special holiday OT: +30% of hourly rate per OT hour
   */
  calculateOvertimePay(overtimeHours: number, isRestDay: boolean): number {
    if (overtimeHours <= 0) return 0;

    const otMultiplier = isRestDay ? 0.30 : 0.25;
    // OT pay = hourlyRate × (1 + multiplier) × overtimeHours
    return this._hourlyRate * (1 + otMultiplier) * overtimeHours;
  }

  /**
   * Calculate holiday pay for crew members (hourly-based).
   * Regular holiday: +100% premium
   * Special non-working holiday: +30% premium
   */
  private calculateHolidayPay(
    holidayHours: number,
    isRestDay: boolean,
  ): number {
    if (holidayHours <= 0) return 0;

    // Regular holiday premium on rest day is higher
    const holidayMultiplier = isRestDay ? 1.30 : 1.00;
    return this._hourlyRate * holidayMultiplier * holidayHours;
  }

  /**
   * POLYMORPHISM: Returns the employee type identifier.
   * Used by the PayrollCalculatorFactory to select the correct calculator.
   */
  getEmployeeType(): string {
    return 'CREW_MEMBER';
  }
}
