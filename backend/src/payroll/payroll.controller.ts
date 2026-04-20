// ============================================================================
// Payroll Controller — Payroll computation and management endpoints
// ============================================================================

import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('api/payroll')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  /**
   * POST /api/payroll/compute — Compute payroll for a pay period.
   */
  @Post('compute')
  @Roles('HR_ADMIN')
  async computePayroll(
    @Body() body: { periodStart: string; periodEnd: string },
    @Request() req: any,
  ) {
    return this.payrollService.computePayroll(
      new Date(body.periodStart),
      new Date(body.periodEnd),
      req.user.sub,
    );
  }

  /**
   * GET /api/payroll — Get payroll records for a period.
   */
  @Get()
  @Roles('HR_ADMIN', 'SHIFT_MANAGER')
  async getPayroll(
    @Query('periodStart') periodStart: string,
    @Query('periodEnd') periodEnd: string,
  ) {
    if (periodStart && periodEnd) {
      return this.payrollService.getPayrollByPeriod(
        new Date(periodStart),
        new Date(periodEnd),
      );
    }
    return [];
  }

  /**
   * GET /api/payroll/stats — Dashboard statistics.
   */
  @Get('stats')
  @Roles('HR_ADMIN')
  async getStats() {
    return this.payrollService.getPayrollStats();
  }

  /**
   * GET /api/payroll/employee/:employeeId — Get payroll history for an employee.
   */
  @Get('employee/:employeeId')
  async getEmployeePayroll(@Param('employeeId') employeeId: string) {
    return this.payrollService.getEmployeePayroll(employeeId);
  }

  /**
   * GET /api/payroll/:id — Get a single payroll record.
   */
  @Get(':id')
  async getPayrollById(@Param('id') id: string) {
    return this.payrollService.getPayrollById(id);
  }

  /**
   * PATCH /api/payroll/:id/approve — Approve a payroll.
   */
  @Patch(':id/approve')
  @Roles('HR_ADMIN')
  async approvePayroll(@Param('id') id: string, @Request() req: any) {
    return this.payrollService.approvePayroll(id, req.user.sub);
  }
}
