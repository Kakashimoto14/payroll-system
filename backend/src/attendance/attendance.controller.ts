// ============================================================================
// Attendance Controller — Clock In/Out and attendance history endpoints
// ============================================================================

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('api/attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * POST /api/attendance/clock-in — Clock in with geolocation.
   */
  @Post('clock-in')
  async clockIn(
    @Body() body: { latitude: number; longitude: number },
    @Request() req: any,
  ) {
    return this.attendanceService.clockIn(
      req.user.sub,
      body.latitude,
      body.longitude,
    );
  }

  /**
   * POST /api/attendance/clock-out — Clock out with geolocation.
   */
  @Post('clock-out')
  async clockOut(
    @Body() body: { latitude: number; longitude: number },
    @Request() req: any,
  ) {
    return this.attendanceService.clockOut(
      req.user.sub,
      body.latitude,
      body.longitude,
    );
  }

  /**
   * GET /api/attendance/today — Get today's clock-in status.
   */
  @Get('today')
  async getTodayStatus(@Request() req: any) {
    return this.attendanceService.getTodayStatus(req.user.sub);
  }

  /**
   * GET /api/attendance/history — Get attendance history.
   */
  @Get('history')
  async getHistory(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getHistory(
      req.user.sub,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  /**
   * GET /api/attendance/stats — Attendance analytics (Admin/Manager).
   */
  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('HR_ADMIN', 'SHIFT_MANAGER')
  async getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getAttendanceStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}
