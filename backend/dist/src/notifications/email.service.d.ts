import { PrismaService } from '../prisma/prisma.service';
export declare class EmailService {
    private readonly prisma;
    private readonly logger;
    private readonly provider;
    constructor(prisma: PrismaService);
    sendPayslipEmail(employeeId: string, email: string, employeeName: string, payPeriod: string, pdfBuffer: Buffer, pdfPassword: string): Promise<void>;
}
