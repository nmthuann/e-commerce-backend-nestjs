import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/modules/v1/constants/role.enum';

export class AccountForEmployeeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  status: string;
  refresh_token: string;
  role: Role;

  // @IsNotEmpty()
  // @Exclude({
  //     toPlainOnly: true
  // })
  password!: string;
}
