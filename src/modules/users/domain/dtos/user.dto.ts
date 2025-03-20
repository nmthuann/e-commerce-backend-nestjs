import { PickType } from '@nestjs/swagger'
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

export class PublicUserDto extends PickType(UserDto, ['email', 'firstName', 'lastName', 'avatarUrl'] as const) {}
