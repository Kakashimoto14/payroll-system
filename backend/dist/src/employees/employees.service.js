"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
const employee_dto_1 = require("./dto/employee.dto");
let EmployeesService = class EmployeesService {
    prisma;
    authService;
    constructor(prisma, authService) {
        this.prisma = prisma;
        this.authService = authService;
    }
    async generateEmployeeId() {
        const count = await this.prisma.employee.count();
        const nextId = (count + 1).toString().padStart(6, '0');
        return `MCD-${nextId}`;
    }
    async create(dto) {
        const existing = await this.prisma.employee.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('An employee with this email already exists');
        }
        const employeeId = await this.generateEmployeeId();
        const passwordHash = await this.authService.hashPassword(dto.password);
        let dailyRate = dto.dailyRate || 550.0;
        let hourlyRate = dto.hourlyRate || 68.75;
        let monthlySalary = dto.monthlySalary || null;
        if (dto.role === 'SHIFT_MANAGER' && !monthlySalary) {
            monthlySalary = 25000;
            dailyRate = monthlySalary / 22;
            hourlyRate = dailyRate / 8;
        }
        else if (dto.role === 'HR_ADMIN' && !monthlySalary) {
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
                role: dto.role,
                employmentType: dto.employmentType || 'FULL_TIME',
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
        return employee_dto_1.EmployeeResponseDto.fromEntity(employee);
    }
    async findAll(query) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query?.role) {
            where.role = query.role;
        }
        if (query?.status) {
            where.status = query.status;
        }
        else {
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
            data: employees.map((e) => employee_dto_1.EmployeeResponseDto.fromEntity(e)),
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const employee = await this.prisma.employee.findUnique({
            where: { id },
            include: { branch: true },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee_dto_1.EmployeeResponseDto.fromEntity(employee);
    }
    async update(id, dto) {
        const existing = await this.prisma.employee.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
        const employee = await this.prisma.employee.update({
            where: { id },
            data: {
                ...(dto.firstName && { firstName: dto.firstName }),
                ...(dto.lastName && { lastName: dto.lastName }),
                ...(dto.email && { email: dto.email }),
                ...(dto.phone && { phone: dto.phone }),
                ...(dto.role && { role: dto.role }),
                ...(dto.employmentType && { employmentType: dto.employmentType }),
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
                ...(dto.status && { status: dto.status }),
            },
            include: { branch: true },
        });
        return employee_dto_1.EmployeeResponseDto.fromEntity(employee);
    }
    async remove(id) {
        const existing = await this.prisma.employee.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
        await this.prisma.employee.update({
            where: { id },
            data: { status: 'TERMINATED' },
        });
        return { message: `Employee ${existing.employeeId} has been terminated` };
    }
    async getCountByRole() {
        const counts = await this.prisma.employee.groupBy({
            by: ['role'],
            where: { status: 'ACTIVE' },
            _count: { id: true },
        });
        const result = {
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
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map