export interface ITimeTracker {
    clockIn(employeeId: string, latitude: number, longitude: number): Promise<ClockInResult>;
    clockOut(attendanceId: string, latitude: number, longitude: number): Promise<ClockOutResult>;
    calculateHoursWorked(clockIn: Date, clockOut: Date): number;
    calculateNightDiffHours(clockIn: Date, clockOut: Date): number;
    calculateOvertimeHours(hoursWorked: number, scheduledHours: number): number;
}
export interface ClockInResult {
    attendanceId: string;
    clockInTime: Date;
    isGeoverified: boolean;
    branchName: string | null;
    message: string;
}
export interface ClockOutResult {
    attendanceId: string;
    clockOutTime: Date;
    hoursWorked: number;
    overtimeHours: number;
    nightDiffHours: number;
    message: string;
}
