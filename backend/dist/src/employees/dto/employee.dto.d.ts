export declare class CreateEmployeeDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: 'CREW_MEMBER' | 'SHIFT_MANAGER' | 'HR_ADMIN';
    employmentType?: 'FULL_TIME' | 'PART_TIME';
    dailyRate?: number;
    hourlyRate?: number;
    monthlySalary?: number;
    sssNumber?: string;
    philhealthNumber?: string;
    pagibigNumber?: string;
    tinNumber?: string;
    bankAccountNumber?: string;
    bankName?: string;
    address?: string;
    branchId?: string;
    dateHired?: Date;
    dateOfBirth?: Date;
}
export declare class UpdateEmployeeDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    role?: 'CREW_MEMBER' | 'SHIFT_MANAGER' | 'HR_ADMIN';
    employmentType?: 'FULL_TIME' | 'PART_TIME';
    dailyRate?: number;
    hourlyRate?: number;
    monthlySalary?: number;
    sssNumber?: string;
    philhealthNumber?: string;
    pagibigNumber?: string;
    tinNumber?: string;
    bankAccountNumber?: string;
    bankName?: string;
    address?: string;
    branchId?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
}
export declare class EmployeeResponseDto {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    employmentType: string;
    dailyRate: number;
    hourlyRate: number;
    monthlySalary: number | null;
    sssNumber: string;
    philhealthNumber: string;
    pagibigNumber: string;
    tinNumber: string;
    bankName: string | null;
    bankAccountMasked: string | null;
    dateHired: Date;
    status: string;
    branchId: string | null;
    createdAt: Date;
    static fromEntity(entity: any): EmployeeResponseDto;
}
