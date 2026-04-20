// ============================================================================
// Employee Controller — REST API endpoints for employee management
// ============================================================================

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  /**
   * POST /api/employees — Create a new employee (Admin only).
   */
  @Post()
  @Roles('HR_ADMIN')
  create(@Body() createDto: CreateEmployeeDto) {
    return this.employeesService.create(createDto);
  }

  /**
   * GET /api/employees — List all employees with optional filters.
   */
  @Get()
  @Roles('HR_ADMIN', 'SHIFT_MANAGER')
  findAll(
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('branchId') branchId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.employeesService.findAll({
      role,
      status,
      branchId,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  /**
   * GET /api/employees/count — Get employee count by role.
   */
  @Get('count')
  @Roles('HR_ADMIN')
  getCount() {
    return this.employeesService.getCountByRole();
  }

  /**
   * GET /api/employees/:id — Get a single employee.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  /**
   * PATCH /api/employees/:id — Update an employee (Admin only).
   */
  @Patch(':id')
  @Roles('HR_ADMIN')
  update(@Param('id') id: string, @Body() updateDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateDto);
  }

  /**
   * DELETE /api/employees/:id — Soft-delete (terminate) an employee.
   */
  @Delete(':id')
  @Roles('HR_ADMIN')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
