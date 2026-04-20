// ============================================================================
// ABSTRACTION — ITimeTracker Interface
// OOP Pillar: ABSTRACTION
// Purpose: Abstracts time-tracking operations. The controller layer uses
// this interface without knowing how geolocation verification works internally.
// ============================================================================

/**
 * Interface for time tracking operations.
 * Hides the complexity of geolocation verification, hour calculation,
 * and night differential detection behind a clean contract.
 */
export interface ITimeTracker {
  /**
   * Record a clock-in event with geolocation verification.
   * @param employeeId - The employee's UUID
   * @param latitude - GPS latitude from the employee's device
   * @param longitude - GPS longitude from the employee's device
   * @returns Clock-in result with geoverification status
   */
  clockIn(
    employeeId: string,
    latitude: number,
    longitude: number,
  ): Promise<ClockInResult>;

  /**
   * Record a clock-out event and calculate hours worked dynamically.
   * Hours are never hardcoded — always computed from actual clock times.
   * @param attendanceId - The attendance record UUID
   * @param latitude - GPS latitude at clock-out
   * @param longitude - GPS longitude at clock-out
   * @returns Clock-out result with computed hours
   */
  clockOut(
    attendanceId: string,
    latitude: number,
    longitude: number,
  ): Promise<ClockOutResult>;

  /**
   * Calculate total hours between two timestamps.
   * Returns fractional hours (e.g., 4.5 for 4 hours 30 minutes).
   */
  calculateHoursWorked(clockIn: Date, clockOut: Date): number;

  /**
   * Calculate night differential hours (10PM-6AM overlap).
   */
  calculateNightDiffHours(clockIn: Date, clockOut: Date): number;

  /**
   * Determine if overtime was worked beyond scheduled hours.
   * @param hoursWorked - Actual hours worked (dynamic)
   * @param scheduledHours - Scheduled hours for the day (dynamic, not fixed)
   */
  calculateOvertimeHours(
    hoursWorked: number,
    scheduledHours: number,
  ): number;
}

/**
 * Result returned after a successful clock-in.
 */
export interface ClockInResult {
  attendanceId: string;
  clockInTime: Date;
  isGeoverified: boolean;
  branchName: string | null;
  message: string;
}

/**
 * Result returned after a successful clock-out.
 */
export interface ClockOutResult {
  attendanceId: string;
  clockOutTime: Date;
  hoursWorked: number;
  overtimeHours: number;
  nightDiffHours: number;
  message: string;
}
