import { Logger } from '@nestjs/common'
import { Role } from 'src/common/enums/role.enum'
import { UserStatus } from 'src/common/enums/user-status.enum'
import { hashPassword, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from 'src/common/utils/password.util'
import { UserEntity } from 'src/modules/users/users/user.entity'
import type { Seeder } from './run-seed'

// Tài khoản ADMIN đầu tiên, lấy từ biến môi trường SEED_ADMIN_* (xem .env.example)
export const adminSeeder: Seeder = {
  name: 'admin account',
  run: async dataSource => {
    const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase()
    const password = process.env.SEED_ADMIN_PASSWORD
    if (!email || !password) {
      throw new Error('Thiếu SEED_ADMIN_EMAIL hoặc SEED_ADMIN_PASSWORD trong .env')
    }
    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
      throw new Error(`SEED_ADMIN_PASSWORD phải dài ${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} ký tự`)
    }

    const repository = dataSource.getRepository(UserEntity)
    if (await repository.exists({ where: { email } })) {
      // Không ghi đè mật khẩu của tài khoản đã có
      new Logger('Seed').log(`Admin ${email} đã tồn tại, bỏ qua`)
      return
    }

    await repository.save(
      repository.create({
        email,
        passwordHash: await hashPassword(password),
        fullName: process.env.SEED_ADMIN_NAME?.trim() || 'Administrator',
        role: Role.ADMIN,
        status: UserStatus.ACTIVE
      })
    )
  }
}
