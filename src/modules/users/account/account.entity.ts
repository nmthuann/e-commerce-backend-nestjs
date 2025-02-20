import { Role } from 'src/constants/role.enum';
import { Entity, Column, PrimaryColumn, BeforeInsert, OneToOne } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'Accounts' })
export class AccountEntity {
  @PrimaryColumn({ type: 'nvarchar', length: 50 })
  email: string;

  @Column({ nullable: false }) //select: false
  password: string;

  @Column({ default: true }) // 0: false  1: true
  status: boolean;

  @Column({ default: null })
  refresh_token: string;

  @Column({ type: 'nvarchar', length: 10, default: Role.User })
  role: string;

  @OneToOne(() => UserEntity, (user) => user.account)
  user: UserEntity;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
