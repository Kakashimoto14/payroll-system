"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
class MockResendAdapter {
    async sendEmail(options) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return {
            success: true,
            messageId: `MOCK-EMAIL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            provider: 'Resend (Mock)',
        };
    }
}
let EmailService = EmailService_1 = class EmailService {
    prisma;
    logger = new common_1.Logger(EmailService_1.name);
    provider;
    constructor(prisma) {
        this.prisma = prisma;
        this.provider = new MockResendAdapter();
    }
    async sendPayslipEmail(employeeId, email, employeeName, payPeriod, pdfBuffer, pdfPassword) {
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
        }
        catch (error) {
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmailService);
//# sourceMappingURL=email.service.js.map