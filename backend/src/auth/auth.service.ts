// ============================================================================
// Authentication Service — JWT + Bcrypt
// Handles user login, token generation, and password hashing.
// ============================================================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate user credentials and return the user if valid.
   */
  async validateUser(email: string, password: string): Promise<any> {
    const employee = await this.prisma.employee.findUnique({
      where: { email },
      include: { branch: true },
    });

    if (!employee) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (employee.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is inactive or terminated');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      employee.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // ENCAPSULATION: Never return the password hash
    const { passwordHash, ...result } = employee;
    return result;
  }

  /**
   * Generate JWT access and refresh tokens.
   */
  async login(user: any) {
    const payload = {
      sub: user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // Log the login action
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'Employee',
        entityId: user.id,
      },
    });

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '8h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
        branch: user.branch,
      },
    };
  }

  /**
   * Refresh an expired access token using a valid refresh token.
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newPayload = {
        sub: payload.sub,
        employeeId: payload.employeeId,
        email: payload.email,
        role: payload.role,
        firstName: payload.firstName,
        lastName: payload.lastName,
      };
      return {
        accessToken: this.jwtService.sign(newPayload, { expiresIn: '8h' }),
        refreshToken: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Hash a plaintext password using bcrypt with 12 salt rounds.
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Get current user profile from token payload.
   */
  async getProfile(userId: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: userId },
      include: { branch: true },
    });

    if (!employee) {
      throw new UnauthorizedException('User not found');
    }

    const { passwordHash, ...result } = employee;
    return result;
  }
}
