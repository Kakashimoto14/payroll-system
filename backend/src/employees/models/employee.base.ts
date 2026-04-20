// ============================================================================
// ABSTRACTION + ENCAPSULATION — Abstract Base Employee Class
// OOP Pillars: ABSTRACTION (abstract class, cannot be instantiated directly)
//              ENCAPSULATION (private fields, getter/setter methods)
//
// This is the foundation of the Employee class hierarchy.
// CrewMember, ShiftManager, and HRAdmin all INHERIT from this class.
// ============================================================================

import { IPayrollCalculator } from '../interfaces/payroll-calculator.interface';

/**
 * Abstract base class for all employee types in the McDonald's payroll system.
 *
 * ABSTRACTION: This class is abstract — it cannot be instantiated directly.
 * Child classes MUST implement calculateGrossPay() and other abstract methods.
 *
 * ENCAPSULATION: Sensitive fields (SSS, TIN, salary) are marked private
 * and can only be accessed through controlled getter/setter methods.
 */
export abstract class BaseEmployee implements IPayrollCalculator {
  // ========================================================================
  // ENCAPSULATION — Private fields protect sensitive employee data
  // These fields cannot be accessed directly from outside the class.
  // Only getter/setter methods provide controlled access.
  // ========================================================================

  /** Unique employee identifier (e.g., MCD-000001) */
  private _employeeId: string;

  /** Employee's first name */
  private _firstName: string;

  /** Employee's last name */
  private _lastName: string;

  /** Employee's email address */
  private _email: string;

  /** Employee's phone number */
  private _phone: string;

  // ENCAPSULATION — Highly sensitive government IDs (private, no direct access)
  private _sssNumber: string;
  private _philhealthNumber: string;
  private _pagibigNumber: string;
  private _tinNumber: string;

  // ENCAPSULATION — Financial data (protected to allow child class access)
  protected _dailyRate: number;
  protected _hourlyRate: number;
  protected _monthlySalary: number;

  /** Employee's bank account number */
  private _bankAccountNumber: string;

  /** Employee's bank name */
  private _bankName: string;

  /** Date the employee was hired */
  private _dateHired: Date;

  /** Employee's current status */
  private _status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';

  constructor(
    employeeId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dailyRate: number = 550.0,    // Rizal 1st-class municipality minimum wage
    hourlyRate: number = 68.75,   // ₱550 / 8 hours = ₱68.75/hr
    monthlySalary: number = 0,
    dateHired: Date = new Date(),
  ) {
    this._employeeId = employeeId;
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._phone = phone;
    this._dailyRate = dailyRate;
    this._hourlyRate = hourlyRate;
    this._monthlySalary = monthlySalary;
    this._dateHired = dateHired;
    this._status = 'ACTIVE';
    this._sssNumber = '';
    this._philhealthNumber = '';
    this._pagibigNumber = '';
    this._tinNumber = '';
    this._bankAccountNumber = '';
    this._bankName = '';
  }

  // ========================================================================
  // ENCAPSULATION — Getter methods provide controlled read access
  // ========================================================================

  get employeeId(): string {
    return this._employeeId;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get dailyRate(): number {
    return this._dailyRate;
  }

  get hourlyRate(): number {
    return this._hourlyRate;
  }

  get monthlySalary(): number {
    return this._monthlySalary;
  }

  get dateHired(): Date {
    return this._dateHired;
  }

  get status(): string {
    return this._status;
  }

  /**
   * ENCAPSULATION — Masked SSS number for display purposes.
   * Only the last 4 digits are visible: "**-*******-1234"
   */
  get maskedSssNumber(): string {
    if (!this._sssNumber || this._sssNumber.length < 4) return '***-*******-****';
    return `***-*******-${this._sssNumber.slice(-4)}`;
  }

  /**
   * ENCAPSULATION — Masked TIN for display purposes.
   * Only the last 4 digits are visible.
   */
  get maskedTinNumber(): string {
    if (!this._tinNumber || this._tinNumber.length < 4) return '***-***-***-****';
    return `***-***-***-${this._tinNumber.slice(-4)}`;
  }

  // ========================================================================
  // ENCAPSULATION — Setter methods provide controlled write access
  // with validation logic
  // ========================================================================

  set sssNumber(value: string) {
    // Validate SSS number format: XX-XXXXXXX-X
    if (value && !/^\d{2}-\d{7}-\d{1}$/.test(value)) {
      throw new Error('Invalid SSS number format. Expected: XX-XXXXXXX-X');
    }
    this._sssNumber = value;
  }

  get sssNumber(): string {
    return this._sssNumber;
  }

  set philhealthNumber(value: string) {
    if (value && !/^\d{2}-\d{9}-\d{1}$/.test(value)) {
      throw new Error(
        'Invalid PhilHealth number format. Expected: XX-XXXXXXXXX-X',
      );
    }
    this._philhealthNumber = value;
  }

  get philhealthNumber(): string {
    return this._philhealthNumber;
  }

  set pagibigNumber(value: string) {
    if (value && !/^\d{4}-\d{4}-\d{4}$/.test(value)) {
      throw new Error('Invalid Pag-IBIG number format. Expected: XXXX-XXXX-XXXX');
    }
    this._pagibigNumber = value;
  }

  get pagibigNumber(): string {
    return this._pagibigNumber;
  }

  set tinNumber(value: string) {
    if (value && !/^\d{3}-\d{3}-\d{3}-\d{3,4}$/.test(value)) {
      throw new Error('Invalid TIN format. Expected: XXX-XXX-XXX-XXX(X)');
    }
    this._tinNumber = value;
  }

  get tinNumber(): string {
    return this._tinNumber;
  }

  set bankAccountNumber(value: string) {
    this._bankAccountNumber = value;
  }

  get bankAccountNumber(): string {
    return this._bankAccountNumber;
  }

  set bankName(value: string) {
    this._bankName = value;
  }

  get bankName(): string {
    return this._bankName;
  }

  setStatus(status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED'): void {
    this._status = status;
  }

  // ========================================================================
  // ABSTRACTION — Abstract methods that child classes MUST implement
  // These define WHAT should be done, but not HOW.
  // The HOW is provided by each child class (POLYMORPHISM).
  // ========================================================================

  /**
   * ABSTRACTION + POLYMORPHISM — Each employee type calculates gross pay differently.
   *
   * - CrewMember: hourlyRate × hoursWorked + overtime + night diff
   *   (hours are DYNAMIC — 4hrs, 5.5hrs, 8hrs, etc.)
   * - ShiftManager: monthlySalary / workingDays × daysWorked + adjustments
   * - HRAdmin: fixed monthly salary + adjustments
   */
  abstract calculateGrossPay(
    hoursWorked: number,
    overtimeHours: number,
    nightDiffHours: number,
    holidayHours: number,
    isRestDay: boolean,
  ): number;

  /**
   * ABSTRACTION — Each employee type may calculate overtime differently.
   */
  abstract calculateOvertimePay(
    overtimeHours: number,
    isRestDay: boolean,
  ): number;

  /**
   * ABSTRACTION — Get the employee type string identifier.
   */
  abstract getEmployeeType(): string;

  // ========================================================================
  // Concrete methods shared by all employee types (INHERITANCE benefit)
  // ========================================================================

  /**
   * Calculate night shift differential pay.
   * Philippine Labor Code: 10% premium for hours worked between 10PM-6AM.
   * This method is shared across all employee types via INHERITANCE.
   */
  calculateNightDiffPay(nightDiffHours: number): number {
    // Night Diff = hourlyRate × 10% × nightDiffHours
    return this._hourlyRate * 0.10 * nightDiffHours;
  }

  /**
   * Get the hourly rate for this employee.
   */
  getHourlyRate(): number {
    return this._hourlyRate;
  }

  /**
   * Convert this employee model to a safe DTO (no sensitive data exposed).
   * ENCAPSULATION: Government IDs are masked, passwords are excluded.
   */
  toSafeDTO(): Record<string, unknown> {
    return {
      employeeId: this._employeeId,
      firstName: this._firstName,
      lastName: this._lastName,
      fullName: this.fullName,
      email: this._email,
      phone: this._phone,
      role: this.getEmployeeType(),
      dailyRate: this._dailyRate,
      hourlyRate: this._hourlyRate,
      monthlySalary: this._monthlySalary,
      sssNumber: this.maskedSssNumber,
      tinNumber: this.maskedTinNumber,
      dateHired: this._dateHired,
      status: this._status,
    };
  }
}
