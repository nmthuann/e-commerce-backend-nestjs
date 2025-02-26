import { UserDto } from 'src/modules/v1/modules/users/user/user-dto/user.dto'

export class CartDto {
  cart_id: number
  user: UserDto
  status: number
}
