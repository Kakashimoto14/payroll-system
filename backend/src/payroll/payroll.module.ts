import { Module } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { PayrollCalculatorFactory } from './calculators/payroll-calculator.factory';
import { SSSService } from './deductions/sss.service';
import { PhilHealthService } from './deductions/philhealth.service';
import { PagIBIGService } from './deductions/pagibig.service';
import { WithholdingTaxService } from './deductions/withholding-tax.service';

@Module({
  controllers: [PayrollController],
  providers: [
    PayrollService,
    PayrollCalculatorFactory,
    SSSService,
    PhilHealthService,
    PagIBIGService,
    WithholdingTaxService,
  ],
  exports: [PayrollService, SSSService, PhilHealthService, PagIBIGService, WithholdingTaxService],
})
export class PayrollModule {}
