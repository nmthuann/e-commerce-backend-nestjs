import { Exclude, classToPlain } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/modules/bases/enums/role.enum';
import { UserDto } from '../../user/user-dto/user.dto';


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
