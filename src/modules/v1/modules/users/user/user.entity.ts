import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AccountEntity } from '../account/account.entity'
import { EmployeeEntity } from '../employee/employee.entity'
import { OrderEntity } from 'src/modules/v1/modules/orders/order/order.entity'
import { BaseEntity } from 'src/modules/v1/bases/base.entity'

/**
 * user_id, first_name, last_name
 * gender, birthday, address, phone,
 */

@Entity({ name: 'Users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number

  @Column({ length: 50, nullable: false })
  first_name: string

  @Column()
  last_name: string

  @Column() // 225
  avatar_url: string

  @Column({ length: 50 })
  gender: string

  @Column({ nullable: false })
  birthday: Date

  @Column() // 225
  address: string

  @Column({ length: 10, nullable: false })
  phone: string

  @OneToOne(() => AccountEntity, account => account.user) //  ,  (account) =>  account.email{ cascade: true }
  @JoinColumn({ name: 'email' }) // fix here
  account: AccountEntity

  @OneToOne(() => EmployeeEntity, employee => employee.user) // , { cascade: true }
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity

  @OneToMany(() => OrderEntity, order => order.user)
  orders: OrderEntity[]
}
