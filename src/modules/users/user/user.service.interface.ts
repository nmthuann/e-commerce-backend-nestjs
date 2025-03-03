import { UpdateUserDto } from './dtos/update-user.dto'
import { UserAuthenticationDto } from './dtos/user-authentication.dto'
import { UserDto } from './dtos/user.dto'

export interface IUserService {
  getOneByEmail(email: string): Promise<UserAuthenticationDto>
  updateOneById(id: string, data: UpdateUserDto): Promise<UserDto>
  updateRefreshToken(id: string, refreshToken: string)
}
