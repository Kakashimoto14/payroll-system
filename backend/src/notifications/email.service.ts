// ============================================================================
// Email Notification Service — Mock Adapter Pattern (Resend API)
//
// Uses ADAPTER PATTERN for provider flexibility.
// Currently implements mock adapter; swap to real Resend adapter for production.
// ============================================================================

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * ABSTRACTION — Email Provider interface (Adapter Pattern)
 */
interface IEmailProvider {
  sendEmail(options: EmailOptions): Promise<EmailResult>;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

interface EmailResult {
  success: boolean;
  messageId: string;
  provider: string;
}

/**
 * Mock Email Adapter — simulates email sending.
 */
class MockResendAdapter implements IEmailProvider {
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      success: true,
      messageId: `MOCK-EMAIL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      provider: 'Resend (Mock)',
    };
  }
}

/**
 * Production Resend adapter (commented for reference).
 */
// class ResendEmailAdapter implements IEmailProvider {
//   private readonly apiKey: string;
//
//   constructor(apiKey: string) {
//     this.apiKey = apiKey;
//   }
//
//   async sendEmail(options: EmailOptions): Promise<EmailResult> {
//     const { Resend } = require('resend');
//     const resend = new Resend(this.apiKey);
//     const data = await resend.emails.send({
//       from: 'McDPayroll <payroll@mcdonalds-montalban.com>',
//       to: options.to,
//       subject: options.subject,
//       html: options.html,
//       attachments: options.attachments?.map(a => ({
//         filename: a.filename,
//         content: a.content,
//       })),
//     });
//     return { success: true, messageId: data.id, provider: 'Resend' };
//   }
// }

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly provider: IEmailProvider;

  constructor(private readonly prisma: PrismaService) {
    this.provider = new MockResendAdapter();
  }

  /**
   * Send payslip email with attached PDF.
   */
  async sendPayslipEmail(
    employeeId: string,
    email: string,
    employeeName: string,
    payPeriod: string,
    pdfBuffer: Buffer,
    pdfPassword: string,
  ): Promise<void> {
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FFC72C 0%, #E8A800 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #27251F; margin: 0; font-size: 24px;">🍟 McDonald's Payroll</h1>
          <p style="color: #27251F; margin: 5px 0 0; opacity: 0.8;">Montalban (Rodriguez), Rizal</p>
        </div>
        <div style="background: #FFFFFF; padding: 30px; border: 1px solid #E5E7EB; border-top: none;">
          <p style="color: #27251F; font-size: 16px;">Hi <strong>${employeeName}</strong>,</p>
          <p style="color: #6B7280; line-height: 1.6;">
            Your payslip for the period <strong>${payPeriod}</strong> is attached to this email.
          </p>
          <div style="background: #FFFBF0; border: 1px solid #FFC72C; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="color: #27251F; margin: 0; font-weight: 600;">🔒 PDF Password</p>
            <p style="color: #DA291C; font-family: monospace; font-size: 18px; margin: 8px 0 0; letter-spacing: 2px;">${pdfPassword}</p>
            <p style="color: #6B7280; font-size: 12px; margin: 8px 0 0;">Use this password to open the attached payslip PDF.</p>
          </div>
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            If you have any questions about your payslip, please contact your HR department.
          </p>
        </div>
        <div style="background: #27251F; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="color: #6B7280; font-size: 12px; margin: 0;">
            This is an automated message from McDonald's Montalban Payroll System.
          </p>
        </div>
      </div>
    `;

    try {
      const result = await this.provider.sendEmail({
        to: email,
        subject: `Your Payslip — ${payPeriod} | McDonald's Montalban`,
        html,
        attachments: [
          {
            filename: `Payslip_${payPeriod.replace(/\s/g, '_')}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });

      await this.prisma.notification.create({
        data: {
          employeeId,
          type: 'EMAIL',
          subject: `Payslip — ${payPeriod}`,
          message: `Payslip sent to ${email}`,
          status: result.success ? 'SENT' : 'FAILED',
          sentAt: result.success ? new Date() : null,
        },
      });

      this.logger.log(`Email sent to ${email} [${result.provider}]: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}:`, error);

      await this.prisma.notification.create({
        data: {
          employeeId,
          type: 'EMAIL',
          subject: `Payslip — ${payPeriod}`,
          message: `Failed to send payslip to ${email}`,
          status: 'FAILED',
        },
      });
    }
  }
}
