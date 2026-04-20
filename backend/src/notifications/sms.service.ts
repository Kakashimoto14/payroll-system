// ============================================================================
// SMS Notification Service — Mock Adapter Pattern (Semaphore API)
//
// This service uses the ADAPTER PATTERN to allow easy swapping between
// mock and real SMS providers. Currently implements a mock adapter.
// To use real Semaphore API, replace MockSmsAdapter with SemaphoreSmsAdapter.
// ============================================================================

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * ABSTRACTION — SMS Provider interface (Adapter Pattern)
 * Any SMS provider (Semaphore, Twilio, etc.) must implement this interface.
 */
interface ISmsProvider {
  sendSms(to: string, message: string): Promise<SmsResult>;
}

interface SmsResult {
  success: boolean;
  messageId: string;
  provider: string;
}

/**
 * Mock SMS Adapter — simulates SMS sending for development/demo.
 * In production, replace with real Semaphore API adapter.
 */
class MockSemaphoreAdapter implements ISmsProvider {
  async sendSms(to: string, message: string): Promise<SmsResult> {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      success: true,
      messageId: `MOCK-SMS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      provider: 'Semaphore (Mock)',
    };
  }
}

/**
 * Production-ready Semaphore SMS adapter (commented for reference).
 * Uncomment and configure API key to use real SMS.
 */
// class SemaphoreSmsAdapter implements ISmsProvider {
//   private readonly apiKey: string;
//   private readonly senderName: string = 'McDPayroll';
//
//   constructor(apiKey: string) {
//     this.apiKey = apiKey;
//   }
//
//   async sendSms(to: string, message: string): Promise<SmsResult> {
//     const response = await fetch('https://api.semaphore.co/api/v4/messages', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         apikey: this.apiKey,
//         number: to,
//         message,
//         sendername: this.senderName,
//       }),
//     });
//     const data = await response.json();
//     return {
//       success: response.ok,
//       messageId: data[0]?.message_id || 'unknown',
//       provider: 'Semaphore',
//     };
//   }
// }

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly provider: ISmsProvider;

  constructor(private readonly prisma: PrismaService) {
    // ADAPTER PATTERN: Swap this to use real provider
    this.provider = new MockSemaphoreAdapter();
  }

  /**
   * Send salary credited notification via SMS.
   */
  async sendSalaryCreditedNotification(
    employeeId: string,
    phone: string,
    employeeName: string,
    amount: number,
    payPeriod: string,
  ): Promise<void> {
    const message =
      `Hi ${employeeName}! Your salary of PHP ${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} ` +
      `for the period ${payPeriod} has been credited to your account. ` +
      `Check your payslip in the McDonald's Payroll System. — McDPayroll`;

    try {
      const result = await this.provider.sendSms(phone, message);

      // Log notification
      await this.prisma.notification.create({
        data: {
          employeeId,
          type: 'SMS',
          subject: 'Salary Credited',
          message,
          status: result.success ? 'SENT' : 'FAILED',
          sentAt: result.success ? new Date() : null,
        },
      });

      this.logger.log(
        `SMS sent to ${phone} [${result.provider}]: ${result.messageId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${phone}:`, error);

      await this.prisma.notification.create({
        data: {
          employeeId,
          type: 'SMS',
          subject: 'Salary Credited',
          message,
          status: 'FAILED',
        },
      });
    }
  }
}
