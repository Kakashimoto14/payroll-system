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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PayslipPdfService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayslipPdfService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = __importDefault(require("pdfkit"));
const prisma_service_1 = require("../prisma/prisma.service");
let PayslipPdfService = PayslipPdfService_1 = class PayslipPdfService {
    prisma;
    logger = new common_1.Logger(PayslipPdfService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generatePayslipPdf(payrollId) {
        const payroll = await this.prisma.payroll.findUnique({
            where: { id: payrollId },
            include: {
                employee: true,
            },
        });
        if (!payroll) {
            throw new Error(`Payroll record ${payrollId} not found`);
        }
        const password = this.generatePassword(payroll.employee);
        const payslipNumber = `PS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        const buffer = await this.createPdfBuffer(payroll, payslipNumber);
        await this.prisma.payslip.create({
            data: {
                payrollId,
                employeeId: payroll.employeeId,
                payslipNumber,
                pdfPassword: password,
                pdfUrl: `/payslips/${payslipNumber}.pdf`,
            },
        });
        return { buffer, password, payslipNumber };
    }
    createPdfBuffer(payroll, payslipNumber) {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({
                size: 'A4',
                margin: 50,
                info: {
                    Title: `Payslip - ${payroll.employee.firstName} ${payroll.employee.lastName}`,
                    Author: "McDonald's Montalban Payroll System",
                },
            });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            const emp = payroll.employee;
            const gold = '#FFC72C';
            const dark = '#27251F';
            const red = '#DA291C';
            doc.rect(0, 0, doc.page.width, 100).fill(dark);
            doc
                .fontSize(22)
                .fillColor(gold)
                .text("McDonald's Montalban Payroll", 50, 30, {
                align: 'center',
            });
            doc
                .fontSize(10)
                .fillColor('#FFFFFF')
                .text('Rodriguez (Montalban), Rizal, Philippines', 50, 58, {
                align: 'center',
            });
            doc
                .fontSize(9)
                .fillColor('#9CA3AF')
                .text(`Payslip No: ${payslipNumber}`, 50, 75, { align: 'center' });
            const y1 = 120;
            doc.fontSize(14).fillColor(dark).text('EMPLOYEE INFORMATION', 50, y1);
            doc
                .moveTo(50, y1 + 18)
                .lineTo(545, y1 + 18)
                .strokeColor(gold)
                .lineWidth(2)
                .stroke();
            const infoY = y1 + 30;
            doc.fontSize(10).fillColor('#6B7280');
            doc.text('Employee Name:', 50, infoY);
            doc.fillColor(dark).text(`${emp.firstName} ${emp.lastName}`, 170, infoY);
            doc.fillColor('#6B7280').text('Employee ID:', 50, infoY + 18);
            doc.fillColor(dark).text(emp.employeeId, 170, infoY + 18);
            doc.fillColor('#6B7280').text('Position:', 50, infoY + 36);
            doc.fillColor(dark).text(emp.role.replace('_', ' '), 170, infoY + 36);
            doc.fillColor('#6B7280').text('Pay Period:', 320, infoY);
            doc.fillColor(dark).text(payroll.payrollPeriod, 420, infoY);
            doc.fillColor('#6B7280').text('Pay Date:', 320, infoY + 18);
            doc
                .fillColor(dark)
                .text(payroll.payDate
                ? new Date(payroll.payDate).toLocaleDateString('en-PH')
                : 'N/A', 420, infoY + 18);
            doc.fillColor('#6B7280').text('Status:', 320, infoY + 36);
            doc.fillColor(dark).text(payroll.status, 420, infoY + 36);
            const earningsY = infoY + 70;
            doc.fontSize(14).fillColor(dark).text('EARNINGS', 50, earningsY);
            doc
                .moveTo(50, earningsY + 18)
                .lineTo(545, earningsY + 18)
                .strokeColor(gold)
                .lineWidth(2)
                .stroke();
            const formatPeso = (val) => `₱${val.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
            let ey = earningsY + 30;
            const drawRow = (label, value, bold = false) => {
                doc.fontSize(10);
                if (bold) {
                    doc.fillColor(dark).text(label, 70, ey, { continued: false });
                }
                else {
                    doc.fillColor('#6B7280').text(label, 70, ey, { continued: false });
                }
                doc
                    .fillColor(bold ? red : dark)
                    .text(value, 400, ey, { align: 'right', width: 145 });
                ey += 20;
            };
            drawRow('Hours Worked', `${payroll.totalHoursWorked?.toFixed(2) || '0.00'} hrs`);
            drawRow('Basic Pay', formatPeso(payroll.basicPay));
            drawRow('Overtime Pay', formatPeso(payroll.overtimePay));
            drawRow('Night Differential Pay', formatPeso(payroll.nightDiffPay));
            drawRow('Holiday Pay', formatPeso(payroll.holidayPay));
            doc
                .moveTo(70, ey)
                .lineTo(545, ey)
                .strokeColor('#E5E7EB')
                .lineWidth(1)
                .stroke();
            ey += 8;
            drawRow('GROSS PAY', formatPeso(payroll.grossPay), true);
            ey += 15;
            doc.fontSize(14).fillColor(dark).text('DEDUCTIONS', 50, ey);
            doc
                .moveTo(50, ey + 18)
                .lineTo(545, ey + 18)
                .strokeColor(red)
                .lineWidth(2)
                .stroke();
            ey += 30;
            drawRow('SSS Contribution', formatPeso(payroll.sssDeduction));
            drawRow('PhilHealth Contribution', formatPeso(payroll.philhealthDeduction));
            drawRow('Pag-IBIG (HDMF) Contribution', formatPeso(payroll.pagibigDeduction));
            drawRow('Withholding Tax (TRAIN Law)', formatPeso(payroll.withholdingTax));
            if (payroll.otherDeductions > 0) {
                drawRow('Other Deductions', formatPeso(payroll.otherDeductions));
            }
            doc
                .moveTo(70, ey)
                .lineTo(545, ey)
                .strokeColor('#E5E7EB')
                .lineWidth(1)
                .stroke();
            ey += 8;
            drawRow('TOTAL DEDUCTIONS', formatPeso(payroll.totalDeductions), true);
            ey += 20;
            doc
                .rect(50, ey, 495, 50)
                .fillAndStroke(dark, dark);
            doc
                .fontSize(16)
                .fillColor(gold)
                .text('NET PAY', 70, ey + 10);
            doc
                .fontSize(20)
                .fillColor('#FFFFFF')
                .text(formatPeso(payroll.netPay), 300, ey + 8, {
                align: 'right',
                width: 225,
            });
            ey += 80;
            doc
                .fontSize(8)
                .fillColor('#9CA3AF')
                .text('This is a system-generated payslip from the McDonald\'s Montalban Payroll System.', 50, ey, { align: 'center' });
            doc.text(`Generated on ${new Date().toLocaleString('en-PH')} | Confidential — For Employee Use Only`, 50, ey + 12, { align: 'center' });
            doc.end();
        });
    }
    generatePassword(employee) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
};
exports.PayslipPdfService = PayslipPdfService;
exports.PayslipPdfService = PayslipPdfService = PayslipPdfService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayslipPdfService);
//# sourceMappingURL=payslip-pdf.service.js.map