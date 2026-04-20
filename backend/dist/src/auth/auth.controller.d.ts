import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            employeeId: any;
            firstName: any;
            lastName: any;
            email: any;
            role: any;
            branchId: any;
            branch: any;
        };
    }>;
    refresh(refreshDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(req: any): Promise<{
        branch: {
            id: string;
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            radius: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        id: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        employmentType: import(".prisma/client").$Enums.EmploymentType;
        dailyRate: number;
        hourlyRate: number;
        monthlySalary: number | null;
        sssNumber: string | null;
        philhealthNumber: string | null;
        pagibigNumber: string | null;
        tinNumber: string | null;
        bankAccountNumber: string | null;
        bankName: string | null;
        dateHired: Date;
        dateOfBirth: Date | null;
        status: import(".prisma/client").$Enums.EmployeeStatus;
        branchId: string | null;
    }>;
}
