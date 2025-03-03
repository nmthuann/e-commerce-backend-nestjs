import { AuthResponse } from './dtos/responses/auth.response'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'

export interface IAuthService {
  login(data: LoginDto): Promise<AuthResponse>
  register(data: RegisterDto): Promise<AuthResponse>
}
