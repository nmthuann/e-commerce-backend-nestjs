import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { PageMetaDto } from '../dto/page-meta.dto'
import { PageDto } from '../dto/page.dto'

export type ApiResponse<T> = {
  success: true
  data: T
  meta?: PageMetaDto
}

// Bọc mọi response thành công về cùng 1 envelope: { success, data, meta? }
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<unknown>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<unknown>> {
    return next.handle().pipe(
      map(result =>
        result instanceof PageDto
          ? { success: true, data: result.data, meta: result.meta }
          : { success: true, data: result ?? null }
      )
    )
  }
}
