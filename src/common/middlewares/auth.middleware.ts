import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, NextFunction, Response } from 'express';
import * as dotenv from 'dotenv';
import { MiddlewareError } from '../errors/errors';
dotenv.config();

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  /**
   *
   * @param req 1 check token
   * @param res
   * @param next -> class Guard
   * 1. thiếu token => 401: Unauthorized
   * 2. có token
   *  2a. hợp lệ
   *  2b. không hợp lệ
   */

  async use(req: Request, res: Response, next: NextFunction) {
    // get header from request
    const authHeader = req.headers.authorization;
    if (typeof authHeader === 'undefined') {
      throw new UnauthorizedException(MiddlewareError.TOKEN_MISSING);
    } else {
      const token: string = req
        .get('Authorization')
        .replace('Bearer', '')
        .trim();
      // const token: string = req.get('Authorization').replace('Bearer', '').trim();
      console.log('token: ', JSON.stringify(token));
      try {
        // await this.jwtService.verifyAsync(
        //     token,
        //     {
        //         secret: process.env.JWT_SECRET_KEY,
        //     }
        // );
        req['user'] = this.jwtService.decode(token)['payload'];
        req['token'] = token;
        console.log(req['user']);
        next(); // -> guard (1) -> qua bước phân quyền
      } catch (error) {
        throw new UnauthorizedException(MiddlewareError.TOKEN_INVALID);
      }
    }
  }
}
