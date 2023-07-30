import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterDto { //extends LoginUserDto 

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

}