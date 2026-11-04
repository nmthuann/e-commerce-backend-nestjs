import { Injectable, NestMiddleware } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { NextFunction, Response } from 'express'
import { AuthRequest } from '../types/auth-request.type'

const REQUEST_ID_PATTERN = /^[\w-]{1,64}$/

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: AuthRequest, res: Response, next: NextFunction) {
    const incoming = req.header('x-request-id')
    req.id = incoming && REQUEST_ID_PATTERN.test(incoming) ? incoming : randomUUID()
    res.setHeader('X-Request-Id', req.id)
    next()
  }
}
