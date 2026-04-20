import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { DisbursementService } from './disbursement.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('api/disbursement')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DisbursementController {
  constructor(private readonly disbursementService: DisbursementService) {}

  @Post(':payrollId')
  @Roles('HR_ADMIN')
  async disburse(@Param('payrollId') payrollId: string) {
    return this.disbursementService.disburse(payrollId);
  }

  @Post('bulk/process')
  @Roles('HR_ADMIN')
  async bulkDisburse(@Body() body: { periodStart: string; periodEnd: string }) {
    return this.disbursementService.bulkDisburse(
      new Date(body.periodStart),
      new Date(body.periodEnd),
    );
  }
}
