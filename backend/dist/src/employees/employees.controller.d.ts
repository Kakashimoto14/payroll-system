import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    create(createDto: CreateEmployeeDto): Promise<import("./dto/employee.dto").EmployeeResponseDto>;
    findAll(role?: string, status?: string, branchId?: string, search?: string, page?: string, limit?: string): Promise<{
        data: import("./dto/employee.dto").EmployeeResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    getCount(): Promise<Record<string, number>>;
    findOne(id: string): Promise<import("./dto/employee.dto").EmployeeResponseDto>;
    update(id: string, updateDto: UpdateEmployeeDto): Promise<import("./dto/employee.dto").EmployeeResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
