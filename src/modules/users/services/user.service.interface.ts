import { UpdateUserDto } from '../domain/dtos/update-user.dto'
import { UserAuthenticationDto } from '../domain/dtos/user-authentication.dto'
import { UserDto } from '../domain/dtos/user.dto'

export interface IUserService {
  getOneByEmail(email: string): Promise<UserAuthenticationDto>
  updateOneById(id: string, data: UpdateUserDto): Promise<UserDto>
  updateRefreshToken(id: string, refreshToken: string)
}
