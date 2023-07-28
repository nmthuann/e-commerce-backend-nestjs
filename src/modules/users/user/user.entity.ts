import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AccountEntity } from "../account/account.entity";
import { EmployeeEntity } from "../employee/employee.entity";
import { OrderEntity } from "src/modules/orders/order/order.entity";
import { BaseEntity } from "src/modules/bases/base.entity";

/**
 * user_id, first_name, last_name
 * gender, birthday, address, phone,  
 */

@Entity({name:'Users'})
export class UserEntity extends BaseEntity { 
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({type: "nvarchar", length: 50, nullable: false})
    first_name: string;

    @Column()
    last_name: string;

    @Column()  // 225
    avatar_url: string;

    @Column({type: "nvarchar", length: 50})
    gender: string;

    @Column({nullable: false})
    birthday: Date;

    @Column() // 225
    address: string;

    @Column({type: "nvarchar", length: 10, nullable: false})
    phone: string;  

    @OneToOne(() => AccountEntity, (account) => account.user, ) //  ,  (account) =>  account.email{ cascade: true }
    @JoinColumn({name: 'email'}) // fix here
    account: AccountEntity;

    @OneToOne(() => EmployeeEntity, (employee) => employee.user)// , { cascade: true }
    @JoinColumn({name: 'employee_id'})
    employee: EmployeeEntity

    @OneToOne(() => OrderEntity, (order) => order.user) // specify inverse side as a second parameter
    order: OrderEntity
}