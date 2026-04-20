"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEmployee = void 0;
class BaseEmployee {
    _employeeId;
    _firstName;
    _lastName;
    _email;
    _phone;
    _sssNumber;
    _philhealthNumber;
    _pagibigNumber;
    _tinNumber;
    _dailyRate;
    _hourlyRate;
    _monthlySalary;
    _bankAccountNumber;
    _bankName;
    _dateHired;
    _status;
    constructor(employeeId, firstName, lastName, email, phone, dailyRate = 550.0, hourlyRate = 68.75, monthlySalary = 0, dateHired = new Date()) {
        this._employeeId = employeeId;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._phone = phone;
        this._dailyRate = dailyRate;
        this._hourlyRate = hourlyRate;
        this._monthlySalary = monthlySalary;
        this._dateHired = dateHired;
        this._status = 'ACTIVE';
        this._sssNumber = '';
        this._philhealthNumber = '';
        this._pagibigNumber = '';
        this._tinNumber = '';
        this._bankAccountNumber = '';
        this._bankName = '';
    }
    get employeeId() {
        return this._employeeId;
    }
    get firstName() {
        return this._firstName;
    }
    get lastName() {
        return this._lastName;
    }
    get fullName() {
        return `${this._firstName} ${this._lastName}`;
    }
    get email() {
        return this._email;
    }
    get phone() {
        return this._phone;
    }
    get dailyRate() {
        return this._dailyRate;
    }
    get hourlyRate() {
        return this._hourlyRate;
    }
    get monthlySalary() {
        return this._monthlySalary;
    }
    get dateHired() {
        return this._dateHired;
    }
    get status() {
        return this._status;
    }
    get maskedSssNumber() {
        if (!this._sssNumber || this._sssNumber.length < 4)
            return '***-*******-****';
        return `***-*******-${this._sssNumber.slice(-4)}`;
    }
    get maskedTinNumber() {
        if (!this._tinNumber || this._tinNumber.length < 4)
            return '***-***-***-****';
        return `***-***-***-${this._tinNumber.slice(-4)}`;
    }
    set sssNumber(value) {
        if (value && !/^\d{2}-\d{7}-\d{1}$/.test(value)) {
            throw new Error('Invalid SSS number format. Expected: XX-XXXXXXX-X');
        }
        this._sssNumber = value;
    }
    get sssNumber() {
        return this._sssNumber;
    }
    set philhealthNumber(value) {
        if (value && !/^\d{2}-\d{9}-\d{1}$/.test(value)) {
            throw new Error('Invalid PhilHealth number format. Expected: XX-XXXXXXXXX-X');
        }
        this._philhealthNumber = value;
    }
    get philhealthNumber() {
        return this._philhealthNumber;
    }
    set pagibigNumber(value) {
        if (value && !/^\d{4}-\d{4}-\d{4}$/.test(value)) {
            throw new Error('Invalid Pag-IBIG number format. Expected: XXXX-XXXX-XXXX');
        }
        this._pagibigNumber = value;
    }
    get pagibigNumber() {
        return this._pagibigNumber;
    }
    set tinNumber(value) {
        if (value && !/^\d{3}-\d{3}-\d{3}-\d{3,4}$/.test(value)) {
            throw new Error('Invalid TIN format. Expected: XXX-XXX-XXX-XXX(X)');
        }
        this._tinNumber = value;
    }
    get tinNumber() {
        return this._tinNumber;
    }
    set bankAccountNumber(value) {
        this._bankAccountNumber = value;
    }
    get bankAccountNumber() {
        return this._bankAccountNumber;
    }
    set bankName(value) {
        this._bankName = value;
    }
    get bankName() {
        return this._bankName;
    }
    setStatus(status) {
        this._status = status;
    }
    calculateNightDiffPay(nightDiffHours) {
        return this._hourlyRate * 0.10 * nightDiffHours;
    }
    getHourlyRate() {
        return this._hourlyRate;
    }
    toSafeDTO() {
        return {
            employeeId: this._employeeId,
            firstName: this._firstName,
            lastName: this._lastName,
            fullName: this.fullName,
            email: this._email,
            phone: this._phone,
            role: this.getEmployeeType(),
            dailyRate: this._dailyRate,
            hourlyRate: this._hourlyRate,
            monthlySalary: this._monthlySalary,
            sssNumber: this.maskedSssNumber,
            tinNumber: this.maskedTinNumber,
            dateHired: this._dateHired,
            status: this._status,
        };
    }
}
exports.BaseEmployee = BaseEmployee;
//# sourceMappingURL=employee.base.js.map