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
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
class MockSemaphoreAdapter {
    async sendSms(to, message) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return {
            success: true,
            messageId: `MOCK-SMS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            provider: 'Semaphore (Mock)',
        };
    }
}
let SmsService = SmsService_1 = class SmsService {
    prisma;
    logger = new common_1.Logger(SmsService_1.name);
    provider;
    constructor(prisma) {
        this.prisma = prisma;
        this.provider = new MockSemaphoreAdapter();
    }
    async sendSalaryCreditedNotification(employeeId, phone, employeeName, amount, payPeriod) {
        const message = `Hi ${employeeName}! Your salary of PHP ${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} ` +
            `for the period ${payPeriod} has been credited to your account. ` +
            `Check your payslip in the McDonald's Payroll System. — McDPayroll`;
        try {
            const result = await this.provider.sendSms(phone, message);
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
            this.logger.log(`SMS sent to ${phone} [${result.provider}]: ${result.messageId}`);
        }
        catch (error) {
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
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SmsService);
//# sourceMappingURL=sms.service.js.map