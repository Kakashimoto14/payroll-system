import { PrismaService } from '../prisma/prisma.service';
import { GeolocationService } from './geolocation/geolocation.service';
export declare class AttendanceService {
    private readonly prisma;
    private readonly geolocationService;
    private readonly DEFAULT_SCHEDULED_HOURS;
    constructor(prisma: PrismaService, geolocationService: GeolocationService);
    clockIn(employeeId: string, latitude: number, longitude: number): Promise<{
        id: string;
        clockIn: Date;
        isGeoverified: boolean;
        branch: string | undefined;
        distance: number | undefined;
        message: string;
    }>;
    clockOut(employeeId: string, latitude: number, longitude: number): Promise<{
        id: string;
        clockIn: Date;
        clockOut: Date | null;
        hoursWorked: number | null;
        overtimeHours: number;
        nightDiffHours: number;
        message: string;
    }>;
    private calculateHoursWorked;
    private calculateNightDiffHours;
    getHistory(employeeId: string, startDate?: Date, endDate?: Date): Promise<({
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
    })[]>;
    getTodayStatus(employeeId: string): Promise<{
        status: string;
        attendance: null;
    } | {
        status: string;
        attendance: {
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
        };
    }>;
    getAttendanceStats(startDate?: Date, endDate?: Date): Promise<{
        totalRecords: number;
        presentCount: number;
        lateCount: number;
        absentCount: number;
        averageHoursWorked: number;
        attendanceRate: number;
    }>;
}
