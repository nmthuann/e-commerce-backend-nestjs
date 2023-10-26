import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthExceptionMessages } from 'src/common/errors/auth.error';

export class AuthException extends HttpException {
  constructor(message: AuthExceptionMessages) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
