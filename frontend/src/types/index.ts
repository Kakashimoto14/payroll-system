export interface User {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'CREW_MEMBER' | 'SHIFT_MANAGER' | 'HR_ADMIN';
  branchId: string | null;
  branch: { name: string } | null;
}

export interface Employee {
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
  dateHired: string;
  status: string;
  branchId: string | null;
  createdAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  clockIn: string;
  clockOut: string | null;
  hoursWorked: number | null;
  overtimeHours: number;
  nightDiffHours: number;
  isGeoverified: boolean;
  status: string;
  remarks: string | null;
  branch: { name: string } | null;
}

export interface Payroll {
  id: string;
  employeeId: string;
  payrollPeriod: string;
  periodStart: string;
  periodEnd: string;
  totalHoursWorked: number;
  basicPay: number;
  overtimePay: number;
  nightDiffPay: number;
  holidayPay: number;
  grossPay: number;
  sssDeduction: number;
  philhealthDeduction: number;
  pagibigDeduction: number;
  withholdingTax: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  status: string;
  employee?: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface DashboardStats {
  employees: Record<string, number>;
  payroll: {
    totalGrossPay: number;
    totalNetPay: number;
    totalDeductions: number;
    payrollCount: number;
  };
  attendance: {
    totalRecords: number;
    averageHoursWorked: number;
  };
  pendingLeaves: number;
  recentPayrolls: Payroll[];
  payrollTrend: Array<{
    month: string;
    grossPay: number;
    netPay: number;
    count: number;
  }>;
}

export interface CrewDashboard {
  todayStatus: 'NOT_CLOCKED_IN' | 'CLOCKED_IN' | 'CLOCKED_OUT';
  todayAttendance: Attendance | null;
  thisMonth: {
    hoursWorked: number;
    overtimeHours: number;
    nightDiffHours: number;
    daysPresent: number;
    estimatedPay: number;
  };
  recentPayrolls: Payroll[];
  pendingLeaves: number;
}
