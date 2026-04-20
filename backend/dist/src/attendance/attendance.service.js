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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const geolocation_service_1 = require("./geolocation/geolocation.service");
let AttendanceService = class AttendanceService {
    prisma;
    geolocationService;
    DEFAULT_SCHEDULED_HOURS = 8;
    constructor(prisma, geolocationService) {
        this.prisma = prisma;
        this.geolocationService = geolocationService;
    }
    async clockIn(employeeId, latitude, longitude) {
        const employee = await this.prisma.employee.findUnique({
            where: { id: employeeId },
        });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const existingAttendance = await this.prisma.attendance.findFirst({
            where: {
                employeeId,
                clockIn: { gte: today, lt: tomorrow },
                clockOut: null,
            },
        });
        if (existingAttendance) {
            throw new common_1.BadRequestException('You are already clocked in. Please clock out first.');
        }
        const geoResult = await this.geolocationService.verifyLocation(latitude, longitude);
        if (!geoResult.isWithinRange) {
            throw new common_1.BadRequestException(geoResult.message);
        }
        const attendance = await this.prisma.attendance.create({
            data: {
                employeeId,
                clockIn: new Date(),
                clockInLatitude: latitude,
                clockInLongitude: longitude,
                isGeoverified: true,
                branchId: geoResult.nearestBranch?.id || null,
                status: 'PRESENT',
                remarks: `Clocked in at ${geoResult.nearestBranch?.name} (${geoResult.nearestBranch?.distance}m)`,
            },
        });
        return {
            id: attendance.id,
            clockIn: attendance.clockIn,
            isGeoverified: attendance.isGeoverified,
            branch: geoResult.nearestBranch?.name,
            distance: geoResult.nearestBranch?.distance,
            message: `Successfully clocked in at ${geoResult.nearestBranch?.name}`,
        };
    }
    async clockOut(employeeId, latitude, longitude) {
        const attendance = await this.prisma.attendance.findFirst({
            where: {
                employeeId,
                clockOut: null,
            },
            orderBy: { clockIn: 'desc' },
        });
        if (!attendance) {
            throw new common_1.BadRequestException('No active clock-in found. Please clock in first.');
        }
        const clockOut = new Date();
        const clockIn = new Date(attendance.clockIn);
        const hoursWorked = this.calculateHoursWorked(clockIn, clockOut);
        const nightDiffHours = this.calculateNightDiffHours(clockIn, clockOut);
        const overtimeHours = Math.max(0, hoursWorked - this.DEFAULT_SCHEDULED_HOURS);
        const updated = await this.prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                clockOut,
                clockOutLatitude: latitude,
                clockOutLongitude: longitude,
                hoursWorked: Math.round(hoursWorked * 100) / 100,
                overtimeHours: Math.round(overtimeHours * 100) / 100,
                nightDiffHours: Math.round(nightDiffHours * 100) / 100,
            },
        });
        return {
            id: updated.id,
            clockIn: updated.clockIn,
            clockOut: updated.clockOut,
            hoursWorked: updated.hoursWorked,
            overtimeHours: updated.overtimeHours,
            nightDiffHours: updated.nightDiffHours,
            message: `Clocked out. Total: ${hoursWorked.toFixed(2)} hours`,
        };
    }
    calculateHoursWorked(clockIn, clockOut) {
        const diffMs = clockOut.getTime() - clockIn.getTime();
        return diffMs / (1000 * 60 * 60);
    }
    calculateNightDiffHours(clockIn, clockOut) {
        let nightHours = 0;
        const current = new Date(clockIn);
        while (current < clockOut) {
            const hour = current.getHours();
            if (hour >= 22 || hour < 6) {
                const nextHour = new Date(current);
                nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
                const overlapStart = current > clockIn ? current : clockIn;
                const overlapEnd = nextHour < clockOut ? nextHour : clockOut;
                if (overlapEnd > overlapStart) {
                    nightHours +=
                        (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60);
                }
            }
            current.setHours(current.getHours() + 1, 0, 0, 0);
        }
        return nightHours;
    }
    async getHistory(employeeId, startDate, endDate) {
        const where = { employeeId };
        if (startDate && endDate) {
            where.clockIn = { gte: startDate, lte: endDate };
        }
        return this.prisma.attendance.findMany({
            where,
            orderBy: { clockIn: 'desc' },
            take: 30,
            include: {
                branch: { select: { name: true } },
            },
        });
    }
    async getTodayStatus(employeeId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const attendance = await this.prisma.attendance.findFirst({
            where: {
                employeeId,
                clockIn: { gte: today, lt: tomorrow },
            },
            orderBy: { clockIn: 'desc' },
            include: { branch: { select: { name: true } } },
        });
        if (!attendance) {
            return { status: 'NOT_CLOCKED_IN', attendance: null };
        }
        if (!attendance.clockOut) {
            return { status: 'CLOCKED_IN', attendance };
        }
        return { status: 'CLOCKED_OUT', attendance };
    }
    async getAttendanceStats(startDate, endDate) {
        const today = new Date();
        const start = startDate || new Date(today.getFullYear(), today.getMonth(), 1);
        const end = endDate || today;
        const [totalRecords, presentCount, lateCount, absentCount] = await Promise.all([
            this.prisma.attendance.count({
                where: { clockIn: { gte: start, lte: end } },
            }),
            this.prisma.attendance.count({
                where: { clockIn: { gte: start, lte: end }, status: 'PRESENT' },
            }),
            this.prisma.attendance.count({
                where: { clockIn: { gte: start, lte: end }, status: 'LATE' },
            }),
            this.prisma.attendance.count({
                where: { clockIn: { gte: start, lte: end }, status: 'ABSENT' },
            }),
        ]);
        const avgHours = await this.prisma.attendance.aggregate({
            where: {
                clockIn: { gte: start, lte: end },
                hoursWorked: { not: null },
            },
            _avg: { hoursWorked: true },
        });
        return {
            totalRecords,
            presentCount,
            lateCount,
            absentCount,
            averageHoursWorked: Math.round((avgHours._avg.hoursWorked || 0) * 100) / 100,
            attendanceRate: totalRecords > 0
                ? Math.round((presentCount / totalRecords) * 100)
                : 0,
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        geolocation_service_1.GeolocationService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map