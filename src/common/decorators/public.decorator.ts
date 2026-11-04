import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

// Route không cần đăng nhập; nếu có token hợp lệ thì @CurrentUser() vẫn dùng được
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
