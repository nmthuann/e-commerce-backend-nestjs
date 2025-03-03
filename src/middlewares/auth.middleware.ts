import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt'
import { Request, NextFunction, Response } from 'express'
import * as dotenv from 'dotenv'
import { MiddlewareError } from 'src/constants/errors.enum'
dotenv.config()

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedException(MiddlewareError.TOKEN_MISSING)
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim()
    if (!token) {
      throw new UnauthorizedException(MiddlewareError.TOKEN_INVALID)
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY
      })
      console.log('decoded:::', decoded)
      req['user'] = decoded['payload']
      req['token'] = token
      next()
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(MiddlewareError.TOKEN_EXPIRED)
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(MiddlewareError.TOKEN_INVALID)
      }
      throw new UnauthorizedException(MiddlewareError.TOKEN_INVALID)
    }
  }
}
