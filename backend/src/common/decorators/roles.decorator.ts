// ============================================================================
// Roles Decorator — Used to annotate controller methods with required roles
// Usage: @Roles('HR_ADMIN', 'SHIFT_MANAGER')
// ============================================================================

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
