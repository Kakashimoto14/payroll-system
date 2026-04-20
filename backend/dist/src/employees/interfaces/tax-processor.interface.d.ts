export interface ITaxProcessor {
    calculateAllDeductions(grossPay: number, monthlyBasicSalary: number): DeductionBreakdown;
    calculateSSS(monthlyBasicSalary: number): SSSContribution;
    calculatePhilHealth(monthlyBasicSalary: number): PhilHealthContribution;
    calculatePagIBIG(monthlyBasicSalary: number): PagIBIGContribution;
    calculateWithholdingTax(monthlyTaxableIncome: number): number;
}
export interface DeductionBreakdown {
    sss: SSSContribution;
    philHealth: PhilHealthContribution;
    pagIBIG: PagIBIGContribution;
    withholdingTax: number;
    totalDeductions: number;
}
export interface SSSContribution {
    monthlySalaryCredit: number;
    employeeShare: number;
    employerShare: number;
    totalContribution: number;
    ecContribution: number;
}
export interface PhilHealthContribution {
    baseSalary: number;
    employeeShare: number;
    employerShare: number;
    totalPremium: number;
}
export interface PagIBIGContribution {
    monthlyCompensation: number;
    employeeShare: number;
    employerShare: number;
    totalContribution: number;
}
