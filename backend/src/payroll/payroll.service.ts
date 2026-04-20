// ============================================================================
// Payroll Service — Core payroll computation engine
// Uses POLYMORPHISM via PayrollCalculatorFactory to compute pay differently
// per employee type, and integrates all PH deduction services.
// ============================================================================

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PayrollCalculatorFactory } from './calculators/payroll-calculator.factory';
import { SSSService } from './deductions/sss.service';
import { PhilHealthService } from './deductions/philhealth.service';
import { PagIBIGService } from './deductions/pagibig.service';
import { WithholdingTaxService } from './deductions/withholding-tax.service';

@Injectable()
export class PayrollService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calculatorFactory: PayrollCalculatorFactory,
    private readonly sssService: SSSService,
    private readonly philHealthService: PhilHealthService,
    private readonly pagIBIGService: PagIBIGService,
    private readonly withholdingTaxService: WithholdingTaxService,
  ) {}

  /**
   * Compute payroll for all active employees in a given pay period.
   * Pay is computed DYNAMICALLY from actual attendance records — never hardcoded hours.
   */
  async computePayroll(
    periodStart: Date,
    periodEnd: Date,
    processedById: string,
  ): Promise<any[]> {
    const employees = await this.prisma.employee.findMany({
      where: { status: 'ACTIVE' },
    });

    const payrollRecords = [];

    for (const employee of employees) {
      // Get attendance records for the period
      const attendanceRecords = await this.prisma.attendance.findMany({
        where: {
          employeeId: employee.id,
          clockIn: { gte: periodStart },
          clockOut: { lte: periodEnd },
          status: 'PRESENT',
        },
      });

      // Sum up hours DYNAMICALLY from actual attendance
      let totalHoursWorked = 0;
      let totalOvertimeHours = 0;
      let totalNightDiffHours = 0;

      for (const record of attendanceRecords) {
        totalHoursWorked += record.hoursWorked || 0;
        totalOvertimeHours += record.overtimeHours || 0;
        totalNightDiffHours += record.nightDiffHours || 0;
      }

      // Check for holiday hours in the period
      const holidays = await this.prisma.holiday.findMany({
        where: {
          date: { gte: periodStart, lte: periodEnd },
        },
      });

      const holidayDates = new Set(
        holidays.map((h) => h.date.toISOString().split('T')[0]),
      );

      let holidayHours = 0;
      for (const record of attendanceRecords) {
        const recordDate = record.clockIn.toISOString().split('T')[0];
        if (holidayDates.has(recordDate)) {
          holidayHours += record.hoursWorked || 0;
        }
      }

      // POLYMORPHISM: Factory creates the correct calculator based on role
      const calculator = this.calculatorFactory.createCalculator(
        employee.role,
        {
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
          hourlyRate: employee.hourlyRate,
          dailyRate: employee.dailyRate,
          monthlySalary: employee.monthlySalary || undefined,
        },
      );

      // POLYMORPHISM: Same method call, different behavior per employee type
      const grossPay = calculator.calculateGrossPay(
        totalHoursWorked,
        totalOvertimeHours,
        totalNightDiffHours,
        holidayHours,
        false, // isRestDay — simplified for batch processing
      );

      const overtimePay = calculator.calculateOvertimePay(
        totalOvertimeHours,
        false,
      );
      const nightDiffPay = calculator.calculateNightDiffPay(totalNightDiffHours);

      // Estimate monthly salary for deduction computation
      const estimatedMonthlySalary =
        employee.monthlySalary || grossPay * 2; // Semi-monthly → monthly estimate

      // Calculate Philippine mandatory deductions
      const sss = this.sssService.calculate(estimatedMonthlySalary);
      const philHealth = this.philHealthService.calculate(estimatedMonthlySalary);
      const pagIBIG = this.pagIBIGService.calculate(estimatedMonthlySalary);

      // Semi-monthly deductions (half of monthly)
      const sssDeduction = Math.round((sss.employeeShare / 2) * 100) / 100;
      const philhealthDeduction = Math.round((philHealth.employeeShare / 2) * 100) / 100;
      const pagibigDeduction = Math.round((pagIBIG.employeeShare / 2) * 100) / 100;

      // Taxable income = Gross - mandatory deductions
      const totalMandatoryDeductions = sssDeduction + philhealthDeduction + pagibigDeduction;
      const taxableIncome = grossPay - totalMandatoryDeductions;
      const monthlyTaxableEstimate = taxableIncome * 2; // Estimate monthly

      // Withholding tax (semi-monthly portion)
      const monthlyTax = this.withholdingTaxService.calculate(monthlyTaxableEstimate);
      const withholdingTax = Math.round((monthlyTax / 2) * 100) / 100;

      const totalDeductions = totalMandatoryDeductions + withholdingTax;
      const netPay = Math.round((grossPay - totalDeductions) * 100) / 100;

      const payrollPeriod = `${periodStart.toISOString().split('T')[0]} to ${periodEnd.toISOString().split('T')[0]}`;

      // Upsert payroll record
      const payroll = await this.prisma.payroll.upsert({
        where: {
          id: await this.findExistingPayrollId(employee.id, periodStart, periodEnd),
        },
        create: {
          employeeId: employee.id,
          payrollPeriod,
          periodStart,
          periodEnd,
          totalHoursWorked,
          basicPay: calculator.getHourlyRate() * totalHoursWorked,
          overtimePay,
          nightDiffPay,
          holidayPay: holidayHours > 0 ? calculator.getHourlyRate() * holidayHours : 0,
          grossPay,
          sssDeduction,
          philhealthDeduction: philhealthDeduction,
          pagibigDeduction: pagibigDeduction,
          withholdingTax,
          totalDeductions,
          netPay,
          status: 'COMPUTED',
          processedAt: new Date(),
          processedById,
        },
        update: {
          totalHoursWorked,
          basicPay: calculator.getHourlyRate() * totalHoursWorked,
          overtimePay,
          nightDiffPay,
          holidayPay: holidayHours > 0 ? calculator.getHourlyRate() * holidayHours : 0,
          grossPay,
          sssDeduction,
          philhealthDeduction: philhealthDeduction,
          pagibigDeduction: pagibigDeduction,
          withholdingTax,
          totalDeductions,
          netPay,
          status: 'COMPUTED',
          processedAt: new Date(),
          processedById,
        },
      });

      payrollRecords.push(payroll);
    }

    return payrollRecords;
  }

  /**
   * Helper to find existing payroll record or generate a new UUID.
   */
  private async findExistingPayrollId(
    employeeId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<string> {
    const existing = await this.prisma.payroll.findFirst({
      where: { employeeId, periodStart, periodEnd },
    });
    return existing?.id || 'non-existing-id-' + Date.now();
  }

  /**
   * Get all payroll records for a period.
   */
  async getPayrollByPeriod(periodStart: Date, periodEnd: Date) {
    return this.prisma.payroll.findMany({
      where: { periodStart, periodEnd },
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            role: true,
            email: true,
          },
        },
      },
      orderBy: { employee: { lastName: 'asc' } },
    });
  }

  /**
   * Get payroll records for a specific employee.
   */
  async getEmployeePayroll(employeeId: string) {
    return this.prisma.payroll.findMany({
      where: { employeeId },
      orderBy: { periodStart: 'desc' },
      take: 12, // Last 12 pay periods
    });
  }

  /**
   * Get a single payroll record.
   */
  async getPayrollById(id: string) {
    const payroll = await this.prisma.payroll.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            role: true,
            email: true,
            phone: true,
            sssNumber: true,
            philhealthNumber: true,
            pagibigNumber: true,
            tinNumber: true,
          },
        },
      },
    });

    if (!payroll) {
      throw new NotFoundException(`Payroll record ${id} not found`);
    }

    return payroll;
  }

  /**
   * Approve a computed payroll.
   */
  async approvePayroll(id: string, approvedById: string) {
    const payroll = await this.prisma.payroll.findUnique({ where: { id } });
    if (!payroll) throw new NotFoundException('Payroll not found');
    if (payroll.status !== 'COMPUTED') {
      throw new BadRequestException('Payroll must be in COMPUTED status to approve');
    }

    return this.prisma.payroll.update({
      where: { id },
      data: {
        status: 'APPROVED',
        processedById: approvedById,
        processedAt: new Date(),
      },
    });
  }

  /**
   * Get payroll summary statistics for dashboard.
   */
  async getPayrollStats() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);

    const [totalPayroll, pendingPayroll, disbursedPayroll, employeeCount] =
      await Promise.all([
        this.prisma.payroll.aggregate({
          where: {
            periodStart: { gte: monthStart },
            periodEnd: { lte: monthEnd },
          },
          _sum: { grossPay: true, netPay: true, totalDeductions: true },
          _count: true,
        }),
        this.prisma.payroll.count({
          where: { status: { in: ['DRAFT', 'COMPUTED'] } },
        }),
        this.prisma.payroll.count({
          where: {
            status: 'DISBURSED',
            periodStart: { gte: monthStart },
          },
        }),
        this.prisma.employee.count({ where: { status: 'ACTIVE' } }),
      ]);

    return {
      totalGrossPay: totalPayroll._sum.grossPay || 0,
      totalNetPay: totalPayroll._sum.netPay || 0,
      totalDeductions: totalPayroll._sum.totalDeductions || 0,
      payrollCount: totalPayroll._count,
      pendingPayroll,
      disbursedPayroll,
      activeEmployees: employeeCount,
    };
  }
}
