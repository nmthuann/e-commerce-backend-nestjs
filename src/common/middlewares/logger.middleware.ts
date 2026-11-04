import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import { AuthRequest } from '../types/auth-request.type'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP')

  use(req: AuthRequest, res: Response, next: NextFunction) {
    const startedAt = Date.now()

    res.on('finish', () => {
      const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms user=${req.user?.sub ?? '-'} id=${req.id}`
      if (res.statusCode >= 500) this.logger.error(message)
      else if (res.statusCode >= 400) this.logger.warn(message)
      else this.logger.log(message)
    })

    next()
  }
}
