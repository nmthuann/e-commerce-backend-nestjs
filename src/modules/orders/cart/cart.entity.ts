import { UserEntity } from 'src/modules/users/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/modules/bases/base.entity';

@Entity({ name: 'Carts' })
export class CartEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  cart_id: number;

  @OneToOne(() => UserEntity) // specify inverse side as a second parameter
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  status: boolean;

  // @ManyToOne(() => CartDetailEntity, (cart_detail) => cart_detail.carts)
  // cart_detail: CartDetailEntity
}
