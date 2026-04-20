import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('HR_ADMIN')
  async getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('crew')
  async getCrewDashboard(@Request() req: any) {
    return this.dashboardService.getCrewDashboard(req.user.sub);
  }
}
