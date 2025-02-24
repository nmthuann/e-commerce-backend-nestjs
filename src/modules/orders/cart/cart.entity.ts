import { UserEntity } from 'src/modules/users/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/bases/base.entity';

@Entity({ name: 'Carts' })
export class CartEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  cart_id: number;

  @OneToOne(() => UserEntity) 
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  status: boolean; 
}
