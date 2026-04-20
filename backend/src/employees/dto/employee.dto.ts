// ============================================================================
// ENCAPSULATION — Employee DTOs (Data Transfer Objects)
// OOP Pillar: ENCAPSULATION
// Purpose: DTOs act as a controlled gateway for data entering and leaving
// the system. Sensitive fields (passwords, raw government IDs) are NEVER
// exposed in response DTOs.
// ============================================================================

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * ENCAPSULATION: Only the fields needed for creation are accepted.
 * The password is received here but NEVER returned in any response DTO.
 */
export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsEnum(['CREW_MEMBER', 'SHIFT_MANAGER', 'HR_ADMIN'])
  role: 'CREW_MEMBER' | 'SHIFT_MANAGER' | 'HR_ADMIN';

  @IsEnum(['FULL_TIME', 'PART_TIME'])
  @IsOptional()
  employmentType?: 'FULL_TIME' | 'PART_TIME';

  @IsNumber()
  @IsOptional()
  dailyRate?: number;

  @IsNumber()
  @IsOptional()
  hourlyRate?: number;

  @IsNumber()
  @IsOptional()
  monthlySalary?: number;

  // Government IDs — accepted but stored encrypted, never returned raw
  @IsString()
  @IsOptional()
  sssNumber?: string;

  @IsString()
  @IsOptional()
  philhealthNumber?: string;

  @IsString()
  @IsOptional()
  pagibigNumber?: string;

  @IsString()
  @IsOptional()
  tinNumber?: string;

  @IsString()
  @IsOptional()
  bankAccountNumber?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsOptional()
  dateHired?: Date;

  @IsOptional()
  dateOfBirth?: Date;
}

/**
 * ENCAPSULATION: Update DTO — all fields optional, no password change here.
 */
export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(['CREW_MEMBER', 'SHIFT_MANAGER', 'HR_ADMIN'])
  @IsOptional()
  role?: 'CREW_MEMBER' | 'SHIFT_MANAGER' | 'HR_ADMIN';

  @IsEnum(['FULL_TIME', 'PART_TIME'])
  @IsOptional()
  employmentType?: 'FULL_TIME' | 'PART_TIME';

  @IsNumber()
  @IsOptional()
  dailyRate?: number;

  @IsNumber()
  @IsOptional()
  hourlyRate?: number;

  @IsNumber()
  @IsOptional()
  monthlySalary?: number;

  @IsString()
  @IsOptional()
  sssNumber?: string;

  @IsString()
  @IsOptional()
  philhealthNumber?: string;

  @IsString()
  @IsOptional()
  pagibigNumber?: string;

  @IsString()
  @IsOptional()
  tinNumber?: string;

  @IsString()
  @IsOptional()
  bankAccountNumber?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsEnum(['ACTIVE', 'INACTIVE', 'TERMINATED'])
  @IsOptional()
  status?: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
}

/**
 * ENCAPSULATION: Response DTO — sensitive data is MASKED or EXCLUDED.
 * - Password hash is NEVER included
 * - Government IDs are MASKED (only last 4 digits shown)
 * - Bank account is partially masked
 */
export class EmployeeResponseDto {
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
  // ENCAPSULATION: Masked government IDs
  sssNumber: string;        // "**-*******-1234"
  philhealthNumber: string; // "**-*********-1"
  pagibigNumber: string;    // "****-****-1234"
  tinNumber: string;        // "***-***-***-1234"
  bankName: string | null;
  bankAccountMasked: string | null; // "****1234"
  dateHired: Date;
  status: string;
  branchId: string | null;
  createdAt: Date;

  /**
   * ENCAPSULATION: Static factory method to create a safe response DTO
   * from a raw database record. All sensitive fields are masked.
   */
  static fromEntity(entity: any): EmployeeResponseDto {
    const dto = new EmployeeResponseDto();
    dto.id = entity.id;
    dto.employeeId = entity.employeeId;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.fullName = `${entity.firstName} ${entity.lastName}`;
    dto.email = entity.email;
    dto.phone = entity.phone;
    dto.role = entity.role;
    dto.employmentType = entity.employmentType;
    dto.dailyRate = entity.dailyRate;
    dto.hourlyRate = entity.hourlyRate;
    dto.monthlySalary = entity.monthlySalary;
    // Mask government IDs
    dto.sssNumber = maskId(entity.sssNumber, '**-*******-');
    dto.philhealthNumber = maskId(entity.philhealthNumber, '**-*********-');
    dto.pagibigNumber = maskId(entity.pagibigNumber, '****-****-');
    dto.tinNumber = maskId(entity.tinNumber, '***-***-***-');
    dto.bankName = entity.bankName;
    dto.bankAccountMasked = entity.bankAccountNumber
      ? `****${entity.bankAccountNumber.slice(-4)}`
      : null;
    dto.dateHired = entity.dateHired;
    dto.status = entity.status;
    dto.branchId = entity.branchId;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}

/**
 * Utility to mask an ID string, showing only the last N characters.
 */
function maskId(value: string | null | undefined, prefix: string): string {
  if (!value) return `${prefix}****`;
  const lastDigits = value.replace(/[^0-9]/g, '').slice(-4);
  return `${prefix}${lastDigits || '****'}`;
}
