import { Entity, Column, PrimaryColumn, BeforeInsert, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { Role } from '../../../constants/role.enum'

@Entity({ name: 'accounts' })
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @PrimaryColumn({ length: 50 })
  email: string

  @Column({ nullable: false }) //select: false
  password: string

  @Column({ default: true }) // 0: false  1: true
  status: boolean

  @Column({ default: null })
  refresh_token: string

  @Column({ length: 10, default: Role.User })
  role: string

  @OneToOne(() => UserEntity, user => user.account)
  user: UserEntity

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase()
  }
}
