import { Exclude } from 'class-transformer'

export class UserDto {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  subId?: string
  @Exclude()
  password: string
  status: string
  refreshToken?: string
  createdAt: Date
  updatedAt: Date
  gender?: string
  phone?: string
  birthday?: Date
  roleType: string
  authMethod: string
}
