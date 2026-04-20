import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { GeolocationService } from './geolocation/geolocation.service';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, GeolocationService],
  exports: [AttendanceService, GeolocationService],
})
export class AttendanceModule {}
