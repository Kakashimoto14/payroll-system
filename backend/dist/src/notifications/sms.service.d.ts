import { PrismaService } from '../prisma/prisma.service';
export declare class SmsService {
    private readonly prisma;
    private readonly logger;
    private readonly provider;
    constructor(prisma: PrismaService);
    sendSalaryCreditedNotification(employeeId: string, phone: string, employeeName: string, amount: number, payPeriod: string): Promise<void>;
}
