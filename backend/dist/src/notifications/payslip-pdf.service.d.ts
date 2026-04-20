import { PrismaService } from '../prisma/prisma.service';
export declare class PayslipPdfService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generatePayslipPdf(payrollId: string): Promise<{
        buffer: Buffer;
        password: string;
        payslipNumber: string;
    }>;
    private createPdfBuffer;
    private generatePassword;
}
