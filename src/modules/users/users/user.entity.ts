import { ApiHideProperty } from '@nestjs/swagger'
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from 'src/common/entities/base.entity'
import { Role } from 'src/common/enums/role.enum'
import { UserStatus } from 'src/common/enums/user-status.enum'
import { EmployeeEntity } from '../employees/employee.entity'

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string

  // select: false → không bao giờ trả về trừ khi addSelect tường minh
  @ApiHideProperty()
  @Column({ name: 'password_hash', type: 'varchar', length: 255, select: false })
  passwordHash: string

  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone?: string

  @Column({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true })
  avatarUrl?: string

  @Column({ type: 'varchar', length: 20, default: Role.CUSTOMER })
  role: Role

  @Column({ type: 'varchar', length: 20, default: UserStatus.ACTIVE })
  status: UserStatus

  // SHA-256 của refresh token đang hiệu lực (null = đã đăng xuất / bị thu hồi)
  @ApiHideProperty()
  @Column({ name: 'refresh_token_hash', type: 'varchar', length: 64, nullable: true, select: false })
  refreshTokenHash?: string | null

  @OneToOne(() => EmployeeEntity, employee => employee.user)
  employee?: EmployeeEntity

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) this.email = this.email.trim().toLowerCase()
  }
}
