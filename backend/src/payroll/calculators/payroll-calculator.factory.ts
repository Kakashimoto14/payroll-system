// ============================================================================
// Payroll Calculator Factory — POLYMORPHISM + Factory Pattern
// OOP Pillar: POLYMORPHISM
//
// The factory creates the correct payroll calculator based on employee role.
// Each calculator implements IPayrollCalculator differently, but the
// consumer code treats them uniformly through the interface.
// ============================================================================

import { Injectable } from '@nestjs/common';
import { IPayrollCalculator } from '../../employees/interfaces/payroll-calculator.interface';
import { CrewMember } from '../../employees/models/crew-member.model';
import { ShiftManager } from '../../employees/models/shift-manager.model';
import { HRAdmin } from '../../employees/models/hr-admin.model';

@Injectable()
export class PayrollCalculatorFactory {
  /**
   * POLYMORPHISM — Factory method that returns the correct calculator
   * based on employee role. The caller doesn't need to know which
   * concrete class is being used — they all satisfy IPayrollCalculator.
   *
   * @param role - Employee role (CREW_MEMBER, SHIFT_MANAGER, HR_ADMIN)
   * @param employeeData - Employee data from database
   * @returns An IPayrollCalculator instance (polymorphic dispatch)
   */
  createCalculator(
    role: string,
    employeeData: {
      employeeId: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      hourlyRate: number;
      dailyRate: number;
      monthlySalary?: number;
    },
  ): IPayrollCalculator {
    switch (role) {
      case 'CREW_MEMBER':
        // POLYMORPHISM: CrewMember.calculateGrossPay() uses hourly rate × dynamic hours
        return new CrewMember(
          employeeData.employeeId,
          employeeData.firstName,
          employeeData.lastName,
          employeeData.email,
          employeeData.phone,
          employeeData.hourlyRate,
          employeeData.dailyRate,
        );

      case 'SHIFT_MANAGER':
        // POLYMORPHISM: ShiftManager.calculateGrossPay() uses monthly salary proration
        return new ShiftManager(
          employeeData.employeeId,
          employeeData.firstName,
          employeeData.lastName,
          employeeData.email,
          employeeData.phone,
          employeeData.monthlySalary || 25000,
        );

      case 'HR_ADMIN':
        // POLYMORPHISM: HRAdmin.calculateGrossPay() uses fixed monthly (OT-exempt)
        return new HRAdmin(
          employeeData.employeeId,
          employeeData.firstName,
          employeeData.lastName,
          employeeData.email,
          employeeData.phone,
          employeeData.monthlySalary || 35000,
        );

      default:
        // Default to CrewMember for unknown roles
        return new CrewMember(
          employeeData.employeeId,
          employeeData.firstName,
          employeeData.lastName,
          employeeData.email,
          employeeData.phone,
          employeeData.hourlyRate,
          employeeData.dailyRate,
        );
    }
  }
}
