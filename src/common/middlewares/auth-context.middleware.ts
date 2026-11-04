import { Injectable, NestMiddleware } from '@nestjs/common'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { NextFunction, Response } from 'express'
import { MiddlewareError } from '../enums/errors.enum'
import { AuthRequest } from '../types/auth-request.type'
import { JwtPayload } from '../types/jwt-payload.type'

// Đọc access token nếu có và gắn req.user. KHÔNG chặn request:
// việc cho qua hay trả 401/403 là trách nhiệm của AuthGuard và RolesGuard.
@Injectable()
export class AuthContextMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: AuthRequest, _res: Response, next: NextFunction) {
    const [type, token] = req.headers.authorization?.split(' ') ?? []

    if (type?.toLowerCase() === 'bearer' && token) {
      try {
        const { sub, email, role, position } = await this.jwtService.verifyAsync<JwtPayload>(token)
        req.user = { sub, email, role, position }
      } catch (error) {
        req.authError = error instanceof TokenExpiredError ? MiddlewareError.TOKEN_EXPIRED : MiddlewareError.TOKEN_INVALID
      }
    }

    next()
  }
}
