import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { EmailService } from './email.service';
import { PayslipPdfService } from './payslip-pdf.service';

@Module({
  providers: [SmsService, EmailService, PayslipPdfService],
  exports: [SmsService, EmailService, PayslipPdfService],
})
export class NotificationsModule {}
