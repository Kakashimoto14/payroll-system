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
exports.EmployeeResponseDto = exports.UpdateEmployeeDto = exports.CreateEmployeeDto = void 0;
const class_validator_1 = require("class-validator");
class CreateEmployeeDto {
    firstName;
    lastName;
    email;
    phone;
    password;
    role;
    employmentType;
    dailyRate;
    hourlyRate;
    monthlySalary;
    sssNumber;
    philhealthNumber;
    pagibigNumber;
    tinNumber;
    bankAccountNumber;
    bankName;
    address;
    branchId;
    dateHired;
    dateOfBirth;
}
exports.CreateEmployeeDto = CreateEmployeeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['CREW_MEMBER', 'SHIFT_MANAGER', 'HR_ADMIN']),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['FULL_TIME', 'PART_TIME']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "employmentType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateEmployeeDto.prototype, "dailyRate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateEmployeeDto.prototype, "hourlyRate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateEmployeeDto.prototype, "monthlySalary", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "sssNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "philhealthNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "pagibigNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "tinNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "bankAccountNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateEmployeeDto.prototype, "dateHired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateEmployeeDto.prototype, "dateOfBirth", void 0);
class UpdateEmployeeDto {
    firstName;
    lastName;
    email;
    phone;
    role;
    employmentType;
    dailyRate;
    hourlyRate;
    monthlySalary;
    sssNumber;
    philhealthNumber;
    pagibigNumber;
    tinNumber;
    bankAccountNumber;
    bankName;
    address;
    branchId;
    status;
}
exports.UpdateEmployeeDto = UpdateEmployeeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['CREW_MEMBER', 'SHIFT_MANAGER', 'HR_ADMIN']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['FULL_TIME', 'PART_TIME']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "employmentType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateEmployeeDto.prototype, "dailyRate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateEmployeeDto.prototype, "hourlyRate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateEmployeeDto.prototype, "monthlySalary", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "sssNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "philhealthNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "pagibigNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "tinNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "bankAccountNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['ACTIVE', 'INACTIVE', 'TERMINATED']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "status", void 0);
class EmployeeResponseDto {
    id;
    employeeId;
    firstName;
    lastName;
    fullName;
    email;
    phone;
    role;
    employmentType;
    dailyRate;
    hourlyRate;
    monthlySalary;
    sssNumber;
    philhealthNumber;
    pagibigNumber;
    tinNumber;
    bankName;
    bankAccountMasked;
    dateHired;
    status;
    branchId;
    createdAt;
    static fromEntity(entity) {
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
exports.EmployeeResponseDto = EmployeeResponseDto;
function maskId(value, prefix) {
    if (!value)
        return `${prefix}****`;
    const lastDigits = value.replace(/[^0-9]/g, '').slice(-4);
    return `${prefix}${lastDigits || '****'}`;
}
//# sourceMappingURL=employee.dto.js.map