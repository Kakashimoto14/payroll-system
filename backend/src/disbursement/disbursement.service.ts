// ============================================================================
// Disbursement Service — Mock Adapter Pattern (PayMongo/Maya API)
// Handles payroll disbursement to employee bank accounts.
// ============================================================================

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../notifications/sms.service';
import { EmailService } from '../notifications/email.service';
import { PayslipPdfService } from '../notifications/payslip-pdf.service';

interface IDisbursementProvider {
  processPayment(options: {
    amount: number;
    recipientName: string;
    bankName: string;
    accountNumber: string;
    referenceId: string;
  }): Promise<{ success: boolean; referenceNumber: string; provider: string; message: string }>;
}

class MockPaymentAdapter implements IDisbursementProvider {
  async processPayment(options: {
    amount: number;
    recipientName: string;
    bankName: string;
    accountNumber: string;
    referenceId: string;
  }) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      success: true,
      referenceNumber: `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      provider: 'PayMongo/Maya (Mock)',
      message: `Successfully processed PHP ${options.amount.toLocaleString()} to ${options.recipientName}`,
    };
  }
}

@Injectable()
export class DisbursementService {
  private readonly logger = new Logger(DisbursementService.name);
  private readonly provider: IDisbursementProvider;

  constructor(
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
    private readonly payslipPdfService: PayslipPdfService,
  ) {
    this.provider = new MockPaymentAdapter();
  }

  async disburse(payrollId: string) {
    const payroll = await this.prisma.payroll.findUnique({
      where: { id: payrollId },
      include: { employee: true },
    });

    if (!payroll) throw new NotFoundException('Payroll record not found');
    if (payroll.status !== 'APPROVED') {
      throw new Error('Payroll must be approved before disbursement');
    }

    const employee = payroll.employee;

    const paymentResult = await this.provider.processPayment({
      amount: payroll.netPay,
      recipientName: `${employee.firstName} ${employee.lastName}`,
      bankName: employee.bankName || 'N/A',
      accountNumber: employee.bankAccountNumber || 'N/A',
      referenceId: payrollId,
    });

    const disbursement = await this.prisma.disbursement.create({
      data: {
        payrollId,
        employeeId: employee.id,
        amount: payroll.netPay,
        referenceNumber: paymentResult.referenceNumber,
        method: 'BANK_TRANSFER',
        status: paymentResult.success ? 'SUCCESS' : 'FAILED',
        bankName: employee.bankName,
        accountNumber: employee.bankAccountNumber,
        processedAt: new Date(),
      },
    });

    await this.prisma.payroll.update({
      where: { id: payrollId },
      data: { status: 'DISBURSED', payDate: new Date() },
    });

    try {
      const { buffer, password } =
        await this.payslipPdfService.generatePayslipPdf(payrollId);

      await this.emailService.sendPayslipEmail(
        employee.id,
        employee.email,
        `${employee.firstName} ${employee.lastName}`,
        payroll.payrollPeriod,
        buffer,
        password,
      );

      await this.smsService.sendSalaryCreditedNotification(
        employee.id,
        employee.phone,
        employee.firstName,
        payroll.netPay,
        payroll.payrollPeriod,
      );
    } catch (error) {
      this.logger.error(`Notification failed for ${employee.employeeId}:`, error);
    }

    return { disbursement, payment: paymentResult };
  }

  async bulkDisburse(periodStart: Date, periodEnd: Date) {
    const approvedPayrolls = await this.prisma.payroll.findMany({
      where: {
        status: 'APPROVED',
        periodStart: { gte: periodStart },
        periodEnd: { lte: periodEnd },
      },
    });

    const results = [];
    for (const payroll of approvedPayrolls) {
      try {
        const result = await this.disburse(payroll.id);
        results.push({ payrollId: payroll.id, success: true, ...result });
      } catch (error) {
        results.push({ payrollId: payroll.id, success: false, error: (error as Error).message });
      }
    }
    return results;
  }
}
