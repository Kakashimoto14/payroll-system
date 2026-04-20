// ============================================================================
// Attendance Service — Clock In/Out with dynamic hours computation
// All hours are computed from actual timestamps — NEVER hardcoded.
// ============================================================================

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeolocationService } from './geolocation/geolocation.service';

@Injectable()
export class AttendanceService {
  /** Standard scheduled hours per day (used only for OT threshold, not pay) */
  private readonly DEFAULT_SCHEDULED_HOURS = 8;

  constructor(
    private readonly prisma: PrismaService,
    private readonly geolocationService: GeolocationService,
  ) {}

  /**
   * Clock in an employee with geolocation verification.
   * The system validates the employee is within 500m of a branch.
   */
  async clockIn(
    employeeId: string,
    latitude: number,
    longitude: number,
  ) {
    // Check if employee exists
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    // Check if already clocked in today (no duplicate clock-in)
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
      throw new BadRequestException(
        'You are already clocked in. Please clock out first.',
      );
    }

    // Verify geolocation — must be within 500m of any branch
    const geoResult = await this.geolocationService.verifyLocation(
      latitude,
      longitude,
    );

    if (!geoResult.isWithinRange) {
      throw new BadRequestException(geoResult.message);
    }

    // Create attendance record
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

  /**
   * Clock out an employee and compute all hours DYNAMICALLY.
   * Hours worked, overtime, and night differential are all calculated
   * from actual clock-in/clock-out timestamps.
   */
  async clockOut(
    employeeId: string,
    latitude: number,
    longitude: number,
  ) {
    // Find open attendance record
    const attendance = await this.prisma.attendance.findFirst({
      where: {
        employeeId,
        clockOut: null,
      },
      orderBy: { clockIn: 'desc' },
    });

    if (!attendance) {
      throw new BadRequestException(
        'No active clock-in found. Please clock in first.',
      );
    }

    const clockOut = new Date();
    const clockIn = new Date(attendance.clockIn);

    // ====================================================================
    // DYNAMIC HOURS COMPUTATION
    // All hours are calculated from actual timestamps, never hardcoded.
    // A crew member could work 4 hours, 5.5 hours, 7 hours, 12 hours, etc.
    // ====================================================================

    // Total hours worked (fractional)
    const hoursWorked = this.calculateHoursWorked(clockIn, clockOut);

    // Night differential hours (10PM-6AM overlap)
    const nightDiffHours = this.calculateNightDiffHours(clockIn, clockOut);

    // Overtime hours (anything beyond scheduled hours for the day)
    const overtimeHours = Math.max(
      0,
      hoursWorked - this.DEFAULT_SCHEDULED_HOURS,
    );

    // Update attendance record
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

  /**
   * Calculate total hours between clock-in and clock-out.
   * Returns fractional hours (e.g., 5.5 for 5 hours 30 minutes).
   */
  private calculateHoursWorked(clockIn: Date, clockOut: Date): number {
    const diffMs = clockOut.getTime() - clockIn.getTime();
    return diffMs / (1000 * 60 * 60); // Convert milliseconds to hours
  }

  /**
   * Calculate night differential hours — the overlap between the
   * employee's shift and the 10:00 PM to 6:00 AM window.
   *
   * Philippine Labor Code: Night shift differential of 10% applies
   * for all hours worked between 10:00 PM and 6:00 AM.
   */
  private calculateNightDiffHours(clockIn: Date, clockOut: Date): number {
    let nightHours = 0;
    const current = new Date(clockIn);

    // Iterate hour by hour to check night differential window
    while (current < clockOut) {
      const hour = current.getHours();
      // Night diff window: 22:00 (10PM) to 05:59 (6AM)
      if (hour >= 22 || hour < 6) {
        // Calculate the fraction of this hour that falls within the shift
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

  /**
   * Get attendance history for an employee.
   */
  async getHistory(
    employeeId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: any = { employeeId };

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

  /**
   * Get today's attendance status for an employee.
   */
  async getTodayStatus(employeeId: string) {
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

  /**
   * Get attendance analytics for dashboard.
   */
  async getAttendanceStats(startDate?: Date, endDate?: Date) {
    const today = new Date();
    const start = startDate || new Date(today.getFullYear(), today.getMonth(), 1);
    const end = endDate || today;

    const [totalRecords, presentCount, lateCount, absentCount] =
      await Promise.all([
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

    // Average hours worked
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
      attendanceRate:
        totalRecords > 0
          ? Math.round((presentCount / totalRecords) * 100)
          : 0,
    };
  }
}
