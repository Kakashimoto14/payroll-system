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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const payroll_calculator_factory_1 = require("./calculators/payroll-calculator.factory");
const sss_service_1 = require("./deductions/sss.service");
const philhealth_service_1 = require("./deductions/philhealth.service");
const pagibig_service_1 = require("./deductions/pagibig.service");
const withholding_tax_service_1 = require("./deductions/withholding-tax.service");
let PayrollService = class PayrollService {
    prisma;
    calculatorFactory;
    sssService;
    philHealthService;
    pagIBIGService;
    withholdingTaxService;
    constructor(prisma, calculatorFactory, sssService, philHealthService, pagIBIGService, withholdingTaxService) {
        this.prisma = prisma;
        this.calculatorFactory = calculatorFactory;
        this.sssService = sssService;
        this.philHealthService = philHealthService;
        this.pagIBIGService = pagIBIGService;
        this.withholdingTaxService = withholdingTaxService;
    }
    async computePayroll(periodStart, periodEnd, processedById) {
        const employees = await this.prisma.employee.findMany({
            where: { status: 'ACTIVE' },
        });
        const payrollRecords = [];
        for (const employee of employees) {
            const attendanceRecords = await this.prisma.attendance.findMany({
                where: {
                    employeeId: employee.id,
                    clockIn: { gte: periodStart },
                    clockOut: { lte: periodEnd },
                    status: 'PRESENT',
                },
            });
            let totalHoursWorked = 0;
            let totalOvertimeHours = 0;
            let totalNightDiffHours = 0;
            for (const record of attendanceRecords) {
                totalHoursWorked += record.hoursWorked || 0;
                totalOvertimeHours += record.overtimeHours || 0;
                totalNightDiffHours += record.nightDiffHours || 0;
            }
            const holidays = await this.prisma.holiday.findMany({
                where: {
                    date: { gte: periodStart, lte: periodEnd },
                },
            });
            const holidayDates = new Set(holidays.map((h) => h.date.toISOString().split('T')[0]));
            let holidayHours = 0;
            for (const record of attendanceRecords) {
                const recordDate = record.clockIn.toISOString().split('T')[0];
                if (holidayDates.has(recordDate)) {
                    holidayHours += record.hoursWorked || 0;
                }
            }
            const calculator = this.calculatorFactory.createCalculator(employee.role, {
                employeeId: employee.employeeId,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                phone: employee.phone,
                hourlyRate: employee.hourlyRate,
                dailyRate: employee.dailyRate,
                monthlySalary: employee.monthlySalary || undefined,
            });
            const grossPay = calculator.calculateGrossPay(totalHoursWorked, totalOvertimeHours, totalNightDiffHours, holidayHours, false);
            const overtimePay = calculator.calculateOvertimePay(totalOvertimeHours, false);
            const nightDiffPay = calculator.calculateNightDiffPay(totalNightDiffHours);
            const estimatedMonthlySalary = employee.monthlySalary || grossPay * 2;
            const sss = this.sssService.calculate(estimatedMonthlySalary);
            const philHealth = this.philHealthService.calculate(estimatedMonthlySalary);
            const pagIBIG = this.pagIBIGService.calculate(estimatedMonthlySalary);
            const sssDeduction = Math.round((sss.employeeShare / 2) * 100) / 100;
            const philhealthDeduction = Math.round((philHealth.employeeShare / 2) * 100) / 100;
            const pagibigDeduction = Math.round((pagIBIG.employeeShare / 2) * 100) / 100;
            const totalMandatoryDeductions = sssDeduction + philhealthDeduction + pagibigDeduction;
            const taxableIncome = grossPay - totalMandatoryDeductions;
            const monthlyTaxableEstimate = taxableIncome * 2;
            const monthlyTax = this.withholdingTaxService.calculate(monthlyTaxableEstimate);
            const withholdingTax = Math.round((monthlyTax / 2) * 100) / 100;
            const totalDeductions = totalMandatoryDeductions + withholdingTax;
            const netPay = Math.round((grossPay - totalDeductions) * 100) / 100;
            const payrollPeriod = `${periodStart.toISOString().split('T')[0]} to ${periodEnd.toISOString().split('T')[0]}`;
            const payroll = await this.prisma.payroll.upsert({
                where: {
                    id: await this.findExistingPayrollId(employee.id, periodStart, periodEnd),
                },
                create: {
                    employeeId: employee.id,
                    payrollPeriod,
                    periodStart,
                    periodEnd,
                    totalHoursWorked,
                    basicPay: calculator.getHourlyRate() * totalHoursWorked,
                    overtimePay,
                    nightDiffPay,
                    holidayPay: holidayHours > 0 ? calculator.getHourlyRate() * holidayHours : 0,
                    grossPay,
                    sssDeduction,
                    philhealthDeduction: philhealthDeduction,
                    pagibigDeduction: pagibigDeduction,
                    withholdingTax,
                    totalDeductions,
                    netPay,
                    status: 'COMPUTED',
                    processedAt: new Date(),
                    processedById,
                },
                update: {
                    totalHoursWorked,
                    basicPay: calculator.getHourlyRate() * totalHoursWorked,
                    overtimePay,
                    nightDiffPay,
                    holidayPay: holidayHours > 0 ? calculator.getHourlyRate() * holidayHours : 0,
                    grossPay,
                    sssDeduction,
                    philhealthDeduction: philhealthDeduction,
                    pagibigDeduction: pagibigDeduction,
                    withholdingTax,
                    totalDeductions,
                    netPay,
                    status: 'COMPUTED',
                    processedAt: new Date(),
                    processedById,
                },
            });
            payrollRecords.push(payroll);
        }
        return payrollRecords;
    }
    async findExistingPayrollId(employeeId, periodStart, periodEnd) {
        const existing = await this.prisma.payroll.findFirst({
            where: { employeeId, periodStart, periodEnd },
        });
        return existing?.id || 'non-existing-id-' + Date.now();
    }
    async getPayrollByPeriod(periodStart, periodEnd) {
        return this.prisma.payroll.findMany({
            where: { periodStart, periodEnd },
            include: {
                employee: {
                    select: {
                        id: true,
                        employeeId: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        email: true,
                    },
                },
            },
            orderBy: { employee: { lastName: 'asc' } },
        });
    }
    async getEmployeePayroll(employeeId) {
        return this.prisma.payroll.findMany({
            where: { employeeId },
            orderBy: { periodStart: 'desc' },
            take: 12,
        });
    }
    async getPayrollById(id) {
        const payroll = await this.prisma.payroll.findUnique({
            where: { id },
            include: {
                employee: {
                    select: {
                        id: true,
                        employeeId: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        email: true,
                        phone: true,
                        sssNumber: true,
                        philhealthNumber: true,
                        pagibigNumber: true,
                        tinNumber: true,
                    },
                },
            },
        });
        if (!payroll) {
            throw new common_1.NotFoundException(`Payroll record ${id} not found`);
        }
        return payroll;
    }
    async approvePayroll(id, approvedById) {
        const payroll = await this.prisma.payroll.findUnique({ where: { id } });
        if (!payroll)
            throw new common_1.NotFoundException('Payroll not found');
        if (payroll.status !== 'COMPUTED') {
            throw new common_1.BadRequestException('Payroll must be in COMPUTED status to approve');
        }
        return this.prisma.payroll.update({
            where: { id },
            data: {
                status: 'APPROVED',
                processedById: approvedById,
                processedAt: new Date(),
            },
        });
    }
    async getPayrollStats() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const monthStart = new Date(currentYear, currentMonth, 1);
        const monthEnd = new Date(currentYear, currentMonth + 1, 0);
        const [totalPayroll, pendingPayroll, disbursedPayroll, employeeCount] = await Promise.all([
            this.prisma.payroll.aggregate({
                where: {
                    periodStart: { gte: monthStart },
                    periodEnd: { lte: monthEnd },
                },
                _sum: { grossPay: true, netPay: true, totalDeductions: true },
                _count: true,
            }),
            this.prisma.payroll.count({
                where: { status: { in: ['DRAFT', 'COMPUTED'] } },
            }),
            this.prisma.payroll.count({
                where: {
                    status: 'DISBURSED',
                    periodStart: { gte: monthStart },
                },
            }),
            this.prisma.employee.count({ where: { status: 'ACTIVE' } }),
        ]);
        return {
            totalGrossPay: totalPayroll._sum.grossPay || 0,
            totalNetPay: totalPayroll._sum.netPay || 0,
            totalDeductions: totalPayroll._sum.totalDeductions || 0,
            payrollCount: totalPayroll._count,
            pendingPayroll,
            disbursedPayroll,
            activeEmployees: employeeCount,
        };
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payroll_calculator_factory_1.PayrollCalculatorFactory,
        sss_service_1.SSSService,
        philhealth_service_1.PhilHealthService,
        pagibig_service_1.PagIBIGService,
        withholding_tax_service_1.WithholdingTaxService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map