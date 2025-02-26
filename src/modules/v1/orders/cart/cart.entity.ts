import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from 'src/modules/v1/bases/base.entity'
import { UserEntity } from '../../users/user/user.entity'

@Entity({ name: 'Carts' })
export class CartEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  cart_id: number

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @Column()
  status: boolean
}
