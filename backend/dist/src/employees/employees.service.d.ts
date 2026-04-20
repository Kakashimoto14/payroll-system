import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeResponseDto } from './dto/employee.dto';
export declare class EmployeesService {
    private readonly prisma;
    private readonly authService;
    constructor(prisma: PrismaService, authService: AuthService);
    private generateEmployeeId;
    create(dto: CreateEmployeeDto): Promise<EmployeeResponseDto>;
    findAll(query?: {
        role?: string;
        status?: string;
        branchId?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: EmployeeResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<EmployeeResponseDto>;
    update(id: string, dto: UpdateEmployeeDto): Promise<EmployeeResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getCountByRole(): Promise<Record<string, number>>;
}
