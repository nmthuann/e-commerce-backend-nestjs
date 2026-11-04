import { SetMetadata } from '@nestjs/common'
import { Position, Role } from '../enums/role.enum'

export const ROLES_KEY = 'roles'
export const POSITIONS_KEY = 'positions'

// ADMIN luôn được qua RolesGuard.
// @Roles(Role.CUSTOMER)        → chỉ khách hàng (và ADMIN)
// @Positions(Position.SALES)   → nhân viên STAFF có vị trí SALES (và ADMIN)
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)

export const Positions = (...positions: Position[]) => SetMetadata(POSITIONS_KEY, positions)
