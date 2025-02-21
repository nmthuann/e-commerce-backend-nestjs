import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty ()
  firstName: string;
        
  @IsNotEmpty()  
  lastName: string
  
  @IsNotEmpty()  
  avatarUrl: string
}
