import { Position, Role } from '../enums/role.enum'

export type JwtPayload = {
  sub: string
  email: string
  role: Role
  position?: Position
}
