import * as bcrypt from 'bcrypt'

const BCRYPT_ROUNDS = 10

// bcrypt chỉ dùng 72 byte đầu → DTO giới hạn mật khẩu tối đa 72 ký tự
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 72

export const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, BCRYPT_ROUNDS)

export const comparePassword = (password: string, hash: string): Promise<boolean> => bcrypt.compare(password, hash)
