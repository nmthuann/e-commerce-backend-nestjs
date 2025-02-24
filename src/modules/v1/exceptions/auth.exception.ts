import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthExceptionMessages } from '../constants/auth.error.enum';

export class AuthException extends HttpException {
  constructor(message: AuthExceptionMessages) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
