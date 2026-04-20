import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly SALT_ROUNDS;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
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
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    hashPassword(password: string): Promise<string>;
    getProfile(userId: string): Promise<{
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
