import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto {
  //extends LoginUserDto

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class CheckOTPDto {
  //extends LoginUserDto

  email: string;
  otp: string;
}
