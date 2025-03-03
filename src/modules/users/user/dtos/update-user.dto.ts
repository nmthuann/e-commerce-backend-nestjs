export class UpdateUserDto {
  firstName: string
  lastName: string
  avatarUrl?: string
  password: string
  status: string
  refreshToken?: string
  gender?: string
  phone?: string
  birthday?: Date
}
