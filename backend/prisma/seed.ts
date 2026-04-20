// ============================================================================
// Database Seed — Demo data for McDonald's Montalban Payroll System
// Run: npx prisma db seed
// ============================================================================

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding McDonald\'s Montalban Payroll Database...\n');

  // ========================================================================
  // 1. Create Branches (Geolocation verification points)
  // ========================================================================
  const branch1 = await prisma.branch.upsert({
    where: { id: 'branch-montalban-hwy' },
    update: {},
    create: {
      id: 'branch-montalban-hwy',
      name: "McDonald's Montalban Highway",
      address: 'E. Rodriguez Ave, Rodriguez (Montalban), 1860 Rizal',
      latitude: 14.7308,
      longitude: 121.1384,
      radius: 500,
    },
  });

  const branch2 = await prisma.branch.upsert({
    where: { id: 'branch-primark-kasiglahan' },
    update: {},
    create: {
      id: 'branch-primark-kasiglahan',
      name: "McDonald's Primark Kasiglahan",
      address: 'Kasiglahan Village, Rodriguez (Montalban), 1860 Rizal',
      latitude: 14.7500,
      longitude: 121.1400,
      radius: 500,
    },
  });

  console.log('✅ Branches created');

  // ========================================================================
  // 2. Create Employees
  // ========================================================================
  const passwordHash = await bcrypt.hash('password123', 12);

  // HR Admin
  const admin = await prisma.employee.upsert({
    where: { email: 'maria.santos@mcd-montalban.com' },
    update: {},
    create: {
      employeeId: 'MCD-000001',
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'maria.santos@mcd-montalban.com',
      phone: '09171234567',
      passwordHash,
      role: 'HR_ADMIN',
      employmentType: 'FULL_TIME',
      dailyRate: 1590.91,
      hourlyRate: 198.86,
      monthlySalary: 35000,
      sssNumber: '34-1234567-8',
      philhealthNumber: '12-123456789-0',
      pagibigNumber: '1234-5678-9012',
      tinNumber: '123-456-789-000',
      bankAccountNumber: '1234567890',
      bankName: 'BDO Unibank',
      dateHired: new Date('2020-03-15'),
      dateOfBirth: new Date('1988-06-22'),
      address: 'Brgy. San Rafael, Rodriguez, Rizal',
      branchId: branch1.id,
    },
  });

  // Shift Managers
  const manager1 = await prisma.employee.upsert({
    where: { email: 'juan.delacruz@mcd-montalban.com' },
    update: {},
    create: {
      employeeId: 'MCD-000002',
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      email: 'juan.delacruz@mcd-montalban.com',
      phone: '09182345678',
      passwordHash,
      role: 'SHIFT_MANAGER',
      employmentType: 'FULL_TIME',
      dailyRate: 1136.36,
      hourlyRate: 142.05,
      monthlySalary: 25000,
      sssNumber: '34-2345678-9',
      philhealthNumber: '12-234567890-1',
      pagibigNumber: '2345-6789-0123',
      tinNumber: '234-567-890-000',
      bankAccountNumber: '2345678901',
      bankName: 'BPI',
      dateHired: new Date('2021-01-10'),
      dateOfBirth: new Date('1992-11-05'),
      address: 'Brgy. San Jose, Rodriguez, Rizal',
      branchId: branch1.id,
    },
  });

  const manager2 = await prisma.employee.upsert({
    where: { email: 'ana.reyes@mcd-montalban.com' },
    update: {},
    create: {
      employeeId: 'MCD-000003',
      firstName: 'Ana',
      lastName: 'Reyes',
      email: 'ana.reyes@mcd-montalban.com',
      phone: '09193456789',
      passwordHash,
      role: 'SHIFT_MANAGER',
      employmentType: 'FULL_TIME',
      dailyRate: 1136.36,
      hourlyRate: 142.05,
      monthlySalary: 25000,
      sssNumber: '34-3456789-0',
      philhealthNumber: '12-345678901-2',
      pagibigNumber: '3456-7890-1234',
      tinNumber: '345-678-901-000',
      bankAccountNumber: '3456789012',
      bankName: 'Metrobank',
      dateHired: new Date('2021-06-01'),
      dateOfBirth: new Date('1995-03-18'),
      address: 'Brgy. Burgos, Rodriguez, Rizal',
      branchId: branch2.id,
    },
  });

  // Crew Members
  const crewData = [
    { id: 'MCD-000004', fn: 'Carlo', ln: 'Garcia', email: 'carlo.garcia@mcd-montalban.com', phone: '09201234567', branch: branch1.id },
    { id: 'MCD-000005', fn: 'Jasmine', ln: 'Villanueva', email: 'jasmine.villanueva@mcd-montalban.com', phone: '09212345678', branch: branch1.id },
    { id: 'MCD-000006', fn: 'Miguel', ln: 'Ramos', email: 'miguel.ramos@mcd-montalban.com', phone: '09223456789', branch: branch2.id },
    { id: 'MCD-000007', fn: 'Patricia', ln: 'Bautista', email: 'patricia.bautista@mcd-montalban.com', phone: '09234567890', branch: branch2.id },
    { id: 'MCD-000008', fn: 'Rafael', ln: 'Mendoza', email: 'rafael.mendoza@mcd-montalban.com', phone: '09245678901', branch: branch1.id },
  ];

  for (const c of crewData) {
    await prisma.employee.upsert({
      where: { email: c.email },
      update: {},
      create: {
        employeeId: c.id,
        firstName: c.fn,
        lastName: c.ln,
        email: c.email,
        phone: c.phone,
        passwordHash,
        role: 'CREW_MEMBER',
        employmentType: 'FULL_TIME',
        dailyRate: 550,
        hourlyRate: 68.75,
        monthlySalary: null,
        dateHired: new Date('2024-01-15'),
        address: 'Rodriguez, Rizal',
        branchId: c.branch,
      },
    });
  }

  console.log('✅ Employees created (1 Admin, 2 Managers, 5 Crew)');

  // ========================================================================
  // 3. Create Holidays (2026)
  // ========================================================================
  const holidays = [
    { name: "New Year's Day", date: new Date('2026-01-01'), type: 'REGULAR' as const },
    { name: 'Araw ng Kagitingan', date: new Date('2026-04-09'), type: 'REGULAR' as const },
    { name: 'Maundy Thursday', date: new Date('2026-03-26'), type: 'REGULAR' as const },
    { name: 'Good Friday', date: new Date('2026-03-27'), type: 'REGULAR' as const },
    { name: 'Labor Day', date: new Date('2026-05-01'), type: 'REGULAR' as const },
    { name: 'Independence Day', date: new Date('2026-06-12'), type: 'REGULAR' as const },
    { name: 'National Heroes Day', date: new Date('2026-08-31'), type: 'REGULAR' as const },
    { name: 'Bonifacio Day', date: new Date('2026-11-30'), type: 'REGULAR' as const },
    { name: 'Christmas Day', date: new Date('2026-12-25'), type: 'REGULAR' as const },
    { name: 'Rizal Day', date: new Date('2026-12-30'), type: 'REGULAR' as const },
    { name: 'Ninoy Aquino Day', date: new Date('2026-08-21'), type: 'SPECIAL_NON_WORKING' as const },
    { name: "All Saints' Day", date: new Date('2026-11-01'), type: 'SPECIAL_NON_WORKING' as const },
    { name: 'Christmas Eve', date: new Date('2026-12-24'), type: 'SPECIAL_NON_WORKING' as const },
    { name: "New Year's Eve", date: new Date('2026-12-31'), type: 'SPECIAL_NON_WORKING' as const },
  ];

  for (const h of holidays) {
    await prisma.holiday.create({ data: { ...h, isNationwide: true } });
  }

  console.log('✅ 2026 Philippine holidays seeded');

  // ========================================================================
  // 4. Sample Attendance Records
  // ========================================================================
  const employees = await prisma.employee.findMany({ where: { role: 'CREW_MEMBER' } });
  const baseDate = new Date('2026-04-14');

  for (const emp of employees) {
    for (let d = 0; d < 5; d++) {
      const day = new Date(baseDate);
      day.setDate(day.getDate() + d);

      const clockInHour = 6 + Math.floor(Math.random() * 4);
      const hoursWorked = 4 + Math.random() * 6;
      const clockIn = new Date(day); clockIn.setHours(clockInHour, Math.floor(Math.random() * 30), 0);
      const clockOut = new Date(clockIn.getTime() + hoursWorked * 3600000);

      const nightDiffHours = clockOut.getHours() >= 22 || clockIn.getHours() < 6
        ? Math.min(hoursWorked, 2) : 0;
      const overtimeHours = Math.max(0, hoursWorked - 8);

      await prisma.attendance.create({
        data: {
          employeeId: emp.id,
          clockIn,
          clockOut,
          hoursWorked: Math.round(hoursWorked * 100) / 100,
          overtimeHours: Math.round(overtimeHours * 100) / 100,
          nightDiffHours: Math.round(nightDiffHours * 100) / 100,
          clockInLatitude: 14.7308 + (Math.random() - 0.5) * 0.002,
          clockInLongitude: 121.1384 + (Math.random() - 0.5) * 0.002,
          isGeoverified: true,
          branchId: emp.branchId,
          status: 'PRESENT',
        },
      });
    }
  }

  console.log('✅ Sample attendance records created');
  console.log('\n🎉 Seed completed!\n');
  console.log('Login credentials:');
  console.log('  Admin:   maria.santos@mcd-montalban.com / password123');
  console.log('  Manager: juan.delacruz@mcd-montalban.com / password123');
  console.log('  Crew:    carlo.garcia@mcd-montalban.com / password123\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
