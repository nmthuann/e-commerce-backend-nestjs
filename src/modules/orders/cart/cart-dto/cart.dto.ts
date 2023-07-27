import { UserDto } from "src/modules/users/user/user-dto/user.dto";

export class CartDto {
  cart_id: number;
  user: UserDto; 
  status: number;
}