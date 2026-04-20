import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../notifications/sms.service';
import { EmailService } from '../notifications/email.service';
import { PayslipPdfService } from '../notifications/payslip-pdf.service';
export declare class DisbursementService {
    private readonly prisma;
    private readonly smsService;
    private readonly emailService;
    private readonly payslipPdfService;
    private readonly logger;
    private readonly provider;
    constructor(prisma: PrismaService, smsService: SmsService, emailService: EmailService, payslipPdfService: PayslipPdfService);
    disburse(payrollId: string): Promise<{
        disbursement: {
            id: string;
            createdAt: Date;
            employeeId: string;
            bankName: string | null;
            status: import(".prisma/client").$Enums.DisbursementStatus;
            processedAt: Date | null;
            payrollId: string;
            amount: number;
            referenceNumber: string | null;
            method: import(".prisma/client").$Enums.DisbursementMethod;
            accountNumber: string | null;
        };
        payment: {
            success: boolean;
            referenceNumber: string;
            provider: string;
            message: string;
        };
    }>;
    bulkDisburse(periodStart: Date, periodEnd: Date): Promise<({
        disbursement: {
            id: string;
            createdAt: Date;
            employeeId: string;
            bankName: string | null;
            status: import(".prisma/client").$Enums.DisbursementStatus;
            processedAt: Date | null;
            payrollId: string;
            amount: number;
            referenceNumber: string | null;
            method: import(".prisma/client").$Enums.DisbursementMethod;
            accountNumber: string | null;
        };
        payment: {
            success: boolean;
            referenceNumber: string;
            provider: string;
            message: string;
        };
        payrollId: string;
        success: boolean;
        error?: undefined;
    } | {
        payrollId: string;
        success: boolean;
        error: string;
    })[]>;
}
