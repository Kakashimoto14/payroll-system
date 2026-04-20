import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    clockIn(body: {
        latitude: number;
        longitude: number;
    }, req: any): Promise<{
        id: string;
        clockIn: Date;
        isGeoverified: boolean;
        branch: string | undefined;
        distance: number | undefined;
        message: string;
    }>;
    clockOut(body: {
        latitude: number;
        longitude: number;
    }, req: any): Promise<{
        id: string;
        clockIn: Date;
        clockOut: Date | null;
        hoursWorked: number | null;
        overtimeHours: number;
        nightDiffHours: number;
        message: string;
    }>;
    getTodayStatus(req: any): Promise<{
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
    getHistory(req: any, startDate?: string, endDate?: string): Promise<({
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
    getStats(startDate?: string, endDate?: string): Promise<{
        totalRecords: number;
        presentCount: number;
        lateCount: number;
        absentCount: number;
        averageHoursWorked: number;
        attendanceRate: number;
    }>;
}
