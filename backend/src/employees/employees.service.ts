// ============================================================================
// Employee Service — CRUD operations with OOP model integration
// ============================================================================

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeResponseDto,
} from './dto/employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Generate a unique employee ID in format MCD-XXXXXX.
   */
  private async generateEmployeeId(): Promise<string> {
    const count = await this.prisma.employee.count();
    const nextId = (count + 1).toString().padStart(6, '0');
    return `MCD-${nextId}`;
  }

  /**
   * Create a new employee with hashed password and generated employee ID.
   */
  async create(dto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    // Check for duplicate email
    const existing = await this.prisma.employee.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('An employee with this email already exists');
    }

    const employeeId = await this.generateEmployeeId();
    const passwordHash = await this.authService.hashPassword(dto.password);

    // Set default rates based on role
    let dailyRate = dto.dailyRate || 550.0;
    let hourlyRate = dto.hourlyRate || 68.75;
    let monthlySalary = dto.monthlySalary || null;

    if (dto.role === 'SHIFT_MANAGER' && !monthlySalary) {
      monthlySalary = 25000;
      dailyRate = monthlySalary / 22;
      hourlyRate = dailyRate / 8;
    } else if (dto.role === 'HR_ADMIN' && !monthlySalary) {
      monthlySalary = 35000;
      dailyRate = monthlySalary / 22;
      hourlyRate = dailyRate / 8;
    }

    const employee = await this.prisma.employee.create({
      data: {
        employeeId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: dto.role as any,
        employmentType: (dto.employmentType as any) || 'FULL_TIME',
        dailyRate,
        hourlyRate,
        monthlySalary,
        sssNumber: dto.sssNumber,
        philhealthNumber: dto.philhealthNumber,
        pagibigNumber: dto.pagibigNumber,
        tinNumber: dto.tinNumber,
        bankAccountNumber: dto.bankAccountNumber,
        bankName: dto.bankName,
        address: dto.address,
        branchId: dto.branchId,
        dateHired: dto.dateHired ? new Date(dto.dateHired) : new Date(),
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
      },
    });

    return EmployeeResponseDto.fromEntity(employee);
  }

  /**
   * Get all employees with optional filtering.
   */
  async findAll(query?: {
    role?: string;
    status?: string;
    branchId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: EmployeeResponseDto[]; total: number; page: number; limit: number }> {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query?.role) {
      where.role = query.role;
    }
    if (query?.status) {
      where.status = query.status;
    } else {
      where.status = 'ACTIVE';
    }
    if (query?.branchId) {
      where.branchId = query.branchId;
    }
    if (query?.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { employeeId: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { branch: true },
      }),
      this.prisma.employee.count({ where }),
    ]);

    return {
      data: employees.map((e) => EmployeeResponseDto.fromEntity(e)),
      total,
      page,
      limit,
    };
  }

  /**
   * Get a single employee by ID.
   */
  async findOne(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: { branch: true },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return EmployeeResponseDto.fromEntity(employee);
  }

  /**
   * Update an employee.
   */
  async update(
    id: string,
    dto: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    const existing = await this.prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    const employee = await this.prisma.employee.update({
      where: { id },
      data: {
        ...(dto.firstName && { firstName: dto.firstName }),
        ...(dto.lastName && { lastName: dto.lastName }),
        ...(dto.email && { email: dto.email }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.role && { role: dto.role as any }),
        ...(dto.employmentType && { employmentType: dto.employmentType as any }),
        ...(dto.dailyRate !== undefined && { dailyRate: dto.dailyRate }),
        ...(dto.hourlyRate !== undefined && { hourlyRate: dto.hourlyRate }),
        ...(dto.monthlySalary !== undefined && { monthlySalary: dto.monthlySalary }),
        ...(dto.sssNumber && { sssNumber: dto.sssNumber }),
        ...(dto.philhealthNumber && { philhealthNumber: dto.philhealthNumber }),
        ...(dto.pagibigNumber && { pagibigNumber: dto.pagibigNumber }),
        ...(dto.tinNumber && { tinNumber: dto.tinNumber }),
        ...(dto.bankAccountNumber && { bankAccountNumber: dto.bankAccountNumber }),
        ...(dto.bankName && { bankName: dto.bankName }),
        ...(dto.address && { address: dto.address }),
        ...(dto.branchId && { branchId: dto.branchId }),
        ...(dto.status && { status: dto.status as any }),
      },
      include: { branch: true },
    });

    return EmployeeResponseDto.fromEntity(employee);
  }

  /**
   * Soft-delete an employee (set status to TERMINATED).
   */
  async remove(id: string): Promise<{ message: string }> {
    const existing = await this.prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    await this.prisma.employee.update({
      where: { id },
      data: { status: 'TERMINATED' },
    });

    return { message: `Employee ${existing.employeeId} has been terminated` };
  }

  /**
   * Get employee count by role (for dashboard).
   */
  async getCountByRole(): Promise<Record<string, number>> {
    const counts = await this.prisma.employee.groupBy({
      by: ['role'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
    });

    const result: Record<string, number> = {
      CREW_MEMBER: 0,
      SHIFT_MANAGER: 0,
      HR_ADMIN: 0,
      total: 0,
    };

    counts.forEach((c) => {
      result[c.role] = c._count.id;
      result.total += c._count.id;
    });

    return result;
  }
}
