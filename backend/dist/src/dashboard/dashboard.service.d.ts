import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAdminDashboard(): Promise<{
        employees: Record<string, number>;
        payroll: {
            totalGrossPay: number;
            totalNetPay: number;
            totalDeductions: number;
            payrollCount: number;
        };
        attendance: {
            totalRecords: number;
            averageHoursWorked: number;
        };
        pendingLeaves: number;
        recentPayrolls: ({
            employee: {
                employeeId: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            createdAt: Date;
            employeeId: string;
            status: import(".prisma/client").$Enums.PayrollStatus;
            payrollPeriod: string;
            periodStart: Date;
            periodEnd: Date;
            payDate: Date | null;
            totalHoursWorked: number;
            basicPay: number;
            overtimePay: number;
            nightDiffPay: number;
            holidayPay: number;
            grossPay: number;
            sssDeduction: number;
            philhealthDeduction: number;
            pagibigDeduction: number;
            withholdingTax: number;
            otherDeductions: number;
            totalDeductions: number;
            netPay: number;
            processedAt: Date | null;
            processedById: string | null;
        })[];
        payrollTrend: {
            month: string;
            grossPay: number;
            netPay: number;
            count: number;
        }[];
    }>;
    getCrewDashboard(employeeId: string): Promise<{
        todayStatus: string;
        todayAttendance: ({
            branch: {
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            employeeId: string;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            branchId: string | null;
            clockIn: Date;
            clockOut: Date | null;
            hoursWorked: number | null;
            overtimeHours: number;
            nightDiffHours: number;
            clockInLatitude: number | null;
            clockInLongitude: number | null;
            clockOutLatitude: number | null;
            clockOutLongitude: number | null;
            isGeoverified: boolean;
            remarks: string | null;
        }) | null;
        thisMonth: {
            hoursWorked: number;
            overtimeHours: number;
            nightDiffHours: number;
            daysPresent: number;
            estimatedPay: number;
        };
        recentPayrolls: {
            id: string;
            createdAt: Date;
            employeeId: string;
            status: import(".prisma/client").$Enums.PayrollStatus;
            payrollPeriod: string;
            periodStart: Date;
            periodEnd: Date;
            payDate: Date | null;
            totalHoursWorked: number;
            basicPay: number;
            overtimePay: number;
            nightDiffPay: number;
            holidayPay: number;
            grossPay: number;
            sssDeduction: number;
            philhealthDeduction: number;
            pagibigDeduction: number;
            withholdingTax: number;
            otherDeductions: number;
            totalDeductions: number;
            netPay: number;
            processedAt: Date | null;
            processedById: string | null;
        }[];
        pendingLeaves: number;
    }>;
}
