import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/modules/bases/enums/role.enum';
import { UserDto } from '../../user/user-dto/user.dto';


export class AccountDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    status: string;

    refresh_token: string;

    role: Role;

    @Exclude()
    @IsNotEmpty()
    password: string;

    user: UserDto;
}
