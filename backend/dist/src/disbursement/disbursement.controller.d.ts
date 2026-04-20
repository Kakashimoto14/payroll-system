import { DisbursementService } from './disbursement.service';
export declare class DisbursementController {
    private readonly disbursementService;
    constructor(disbursementService: DisbursementService);
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
    bulkDisburse(body: {
        periodStart: string;
        periodEnd: string;
    }): Promise<({
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
