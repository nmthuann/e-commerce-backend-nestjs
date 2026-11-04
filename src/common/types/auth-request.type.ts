import { Request } from 'express'
import { JwtPayload } from './jwt-payload.type'

export interface AuthRequest extends Request {
  // Gắn bởi RequestIdMiddleware
  id: string
  // Gắn bởi AuthContextMiddleware khi token hợp lệ; undefined = khách vãng lai (GUEST)
  user?: JwtPayload
  // Lý do token bị từ chối, để AuthGuard trả thông báo 401 chính xác
  authError?: string
}
