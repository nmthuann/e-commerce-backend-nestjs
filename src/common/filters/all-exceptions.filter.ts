import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Response } from 'express'
import { QueryFailedError } from 'typeorm'
import { DatabaseError, SystemError } from '../enums/errors.enum'
import { AuthRequest } from '../types/auth-request.type'

type ErrorResult = { statusCode: number; message: string | string[] }

// Mã lỗi PostgreSQL: https://www.postgresql.org/docs/current/errcodes-appendix.html
const PG_ERRORS: Record<string, ErrorResult> = {
  '23505': { statusCode: HttpStatus.CONFLICT, message: DatabaseError.DUPLICATE },
  '23503': { statusCode: HttpStatus.BAD_REQUEST, message: DatabaseError.FOREIGN_KEY },
  '22P02': { statusCode: HttpStatus.BAD_REQUEST, message: DatabaseError.INVALID_INPUT }
}

// Gom mọi lỗi về 1 định dạng: { success:false, statusCode, message, path, timestamp, requestId }
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<AuthRequest>()
    const response = ctx.getResponse<Response>()
    const { statusCode, message } = this.resolve(exception)

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const stack = exception instanceof Error ? exception.stack : String(exception)
      this.logger.error(`${request.method} ${request.originalUrl} id=${request.id}`, stack)
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
      requestId: request.id
    })
  }

  private resolve(exception: unknown): ErrorResult {
    if (exception instanceof HttpException) {
      const body = exception.getResponse()
      const message = typeof body === 'string' ? body : ((body as { message?: string | string[] }).message ?? exception.message)
      return { statusCode: exception.getStatus(), message }
    }

    if (exception instanceof QueryFailedError) {
      const code = (exception.driverError as { code?: string } | undefined)?.code
      if (code && PG_ERRORS[code]) return PG_ERRORS[code]
    }

    return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: SystemError.INTERNAL_SERVER_ERROR }
  }
}
