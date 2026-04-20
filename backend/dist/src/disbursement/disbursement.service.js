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
var DisbursementService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisbursementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const sms_service_1 = require("../notifications/sms.service");
const email_service_1 = require("../notifications/email.service");
const payslip_pdf_service_1 = require("../notifications/payslip-pdf.service");
class MockPaymentAdapter {
    async processPayment(options) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return {
            success: true,
            referenceNumber: `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
            provider: 'PayMongo/Maya (Mock)',
            message: `Successfully processed PHP ${options.amount.toLocaleString()} to ${options.recipientName}`,
        };
    }
}
let DisbursementService = DisbursementService_1 = class DisbursementService {
    prisma;
    smsService;
    emailService;
    payslipPdfService;
    logger = new common_1.Logger(DisbursementService_1.name);
    provider;
    constructor(prisma, smsService, emailService, payslipPdfService) {
        this.prisma = prisma;
        this.smsService = smsService;
        this.emailService = emailService;
        this.payslipPdfService = payslipPdfService;
        this.provider = new MockPaymentAdapter();
    }
    async disburse(payrollId) {
        const payroll = await this.prisma.payroll.findUnique({
            where: { id: payrollId },
            include: { employee: true },
        });
        if (!payroll)
            throw new common_1.NotFoundException('Payroll record not found');
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
            const { buffer, password } = await this.payslipPdfService.generatePayslipPdf(payrollId);
            await this.emailService.sendPayslipEmail(employee.id, employee.email, `${employee.firstName} ${employee.lastName}`, payroll.payrollPeriod, buffer, password);
            await this.smsService.sendSalaryCreditedNotification(employee.id, employee.phone, employee.firstName, payroll.netPay, payroll.payrollPeriod);
        }
        catch (error) {
            this.logger.error(`Notification failed for ${employee.employeeId}:`, error);
        }
        return { disbursement, payment: paymentResult };
    }
    async bulkDisburse(periodStart, periodEnd) {
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
            }
            catch (error) {
                results.push({ payrollId: payroll.id, success: false, error: error.message });
            }
        }
        return results;
    }
};
exports.DisbursementService = DisbursementService;
exports.DisbursementService = DisbursementService = DisbursementService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        sms_service_1.SmsService,
        email_service_1.EmailService,
        payslip_pdf_service_1.PayslipPdfService])
], DisbursementService);
//# sourceMappingURL=disbursement.service.js.map