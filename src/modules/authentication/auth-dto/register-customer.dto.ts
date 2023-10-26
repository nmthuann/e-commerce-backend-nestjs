import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterCustomerDto {
  //extends LoginUserDto

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  first_name: string;
  @IsNotEmpty()
  last_name: string;
  @IsNotEmpty()
  gender: string;
  @IsNotEmpty()
  birthday: Date;
  @IsNotEmpty()
  phone: string;

  constructor(
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    gender: string,
    birthday: Date,
    phone: string,
  ) {
    this.email = email;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.gender = gender;
    this.birthday = birthday;
    this.phone = phone;
  }
}
