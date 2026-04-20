// ============================================================================
// ABSTRACTION — IPayrollCalculator Interface
// OOP Pillar: ABSTRACTION
// Purpose: Defines a contract for payroll calculation without exposing
// implementation details. Each employee type implements this differently.
// ============================================================================

/**
 * Interface for payroll calculation operations.
 * Different employee types (CrewMember, ShiftManager, HRAdmin) provide
 * their own implementation — demonstrating POLYMORPHISM through this
 * ABSTRACTION layer.
 */
export interface IPayrollCalculator {
  /**
   * Calculate gross pay based on hours worked and applicable rates.
   * POLYMORPHISM: CrewMember calculates hourly, ShiftManager calculates monthly.
   * @param hoursWorked - Total regular hours worked in the period (dynamic, not fixed 8hrs)
   * @param overtimeHours - Total overtime hours
   * @param nightDiffHours - Hours worked between 10PM-6AM
   * @param holidayHours - Hours worked on holidays
   * @param isRestDay - Whether shift falls on a rest day
   */
  calculateGrossPay(
    hoursWorked: number,
    overtimeHours: number,
    nightDiffHours: number,
    holidayHours: number,
    isRestDay: boolean,
  ): number;

  /**
   * Calculate overtime premium.
   * Regular day: +25% of hourly rate
   * Rest day/special holiday: +30% of hourly rate
   */
  calculateOvertimePay(overtimeHours: number, isRestDay: boolean): number;

  /**
   * Calculate night shift differential (10% premium for 10PM-6AM).
   */
  calculateNightDiffPay(nightDiffHours: number): number;

  /**
   * Get the base hourly rate for this employee type.
   */
  getHourlyRate(): number;

  /**
   * Get the employee type identifier.
   */
  getEmployeeType(): string;
}
