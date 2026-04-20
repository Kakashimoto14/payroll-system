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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAdminDashboard() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const [employees, payrollStats, attendance, recentPayrolls, leaveRequests] = await Promise.all([
            this.prisma.employee.groupBy({
                by: ['role'],
                where: { status: 'ACTIVE' },
                _count: { id: true },
            }),
            this.prisma.payroll.aggregate({
                where: { periodStart: { gte: monthStart }, periodEnd: { lte: monthEnd } },
                _sum: { grossPay: true, netPay: true, totalDeductions: true },
                _count: true,
            }),
            this.prisma.attendance.aggregate({
                where: { clockIn: { gte: monthStart, lte: monthEnd }, hoursWorked: { not: null } },
                _avg: { hoursWorked: true },
                _count: true,
            }),
            this.prisma.payroll.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    employee: { select: { firstName: true, lastName: true, role: true, employeeId: true } },
                },
            }),
            this.prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
        ]);
        const employeeCounts = { CREW_MEMBER: 0, SHIFT_MANAGER: 0, HR_ADMIN: 0, total: 0 };
        employees.forEach((e) => { employeeCounts[e.role] = e._count.id; employeeCounts.total += e._count.id; });
        const payrollTrend = [];
        for (let i = 5; i >= 0; i--) {
            const ms = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const me = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const data = await this.prisma.payroll.aggregate({
                where: { periodStart: { gte: ms }, periodEnd: { lte: me } },
                _sum: { grossPay: true, netPay: true },
                _count: true,
            });
            payrollTrend.push({
                month: ms.toLocaleString('en-PH', { month: 'short', year: 'numeric' }),
                grossPay: data._sum.grossPay || 0,
                netPay: data._sum.netPay || 0,
                count: data._count,
            });
        }
        return {
            employees: employeeCounts,
            payroll: {
                totalGrossPay: payrollStats._sum.grossPay || 0,
                totalNetPay: payrollStats._sum.netPay || 0,
                totalDeductions: payrollStats._sum.totalDeductions || 0,
                payrollCount: payrollStats._count,
            },
            attendance: {
                totalRecords: attendance._count,
                averageHoursWorked: Math.round((attendance._avg.hoursWorked || 0) * 100) / 100,
            },
            pendingLeaves: leaveRequests,
            recentPayrolls,
            payrollTrend,
        };
    }
    async getCrewDashboard(employeeId) {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [todayAttendance, monthAttendance, recentPayrolls, pendingLeaves] = await Promise.all([
            this.prisma.attendance.findFirst({
                where: { employeeId, clockIn: { gte: today, lt: tomorrow } },
                orderBy: { clockIn: 'desc' },
                include: { branch: { select: { name: true } } },
            }),
            this.prisma.attendance.aggregate({
                where: { employeeId, clockIn: { gte: monthStart }, hoursWorked: { not: null } },
                _sum: { hoursWorked: true, overtimeHours: true, nightDiffHours: true },
                _count: true,
            }),
            this.prisma.payroll.findMany({
                where: { employeeId },
                take: 5,
                orderBy: { periodStart: 'desc' },
            }),
            this.prisma.leaveRequest.count({
                where: { employeeId, status: 'PENDING' },
            }),
        ]);
        const employee = await this.prisma.employee.findUnique({
            where: { id: employeeId },
            select: { hourlyRate: true, dailyRate: true, monthlySalary: true, role: true },
        });
        const totalHoursThisMonth = monthAttendance._sum.hoursWorked || 0;
        const estimatedPay = (employee?.hourlyRate || 68.75) * totalHoursThisMonth;
        return {
            todayStatus: todayAttendance
                ? todayAttendance.clockOut ? 'CLOCKED_OUT' : 'CLOCKED_IN'
                : 'NOT_CLOCKED_IN',
            todayAttendance,
            thisMonth: {
                hoursWorked: Math.round(totalHoursThisMonth * 100) / 100,
                overtimeHours: Math.round((monthAttendance._sum.overtimeHours || 0) * 100) / 100,
                nightDiffHours: Math.round((monthAttendance._sum.nightDiffHours || 0) * 100) / 100,
                daysPresent: monthAttendance._count,
                estimatedPay: Math.round(estimatedPay * 100) / 100,
            },
            recentPayrolls,
            pendingLeaves,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map