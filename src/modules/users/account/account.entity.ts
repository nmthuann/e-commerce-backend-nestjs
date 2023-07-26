
import { BaseEntity } from "src/modules/bases/base.entity";
import { Role } from "src/modules/bases/enums/role.enum";
import { Entity,  Column, CreateDateColumn, DeepPartial, PrimaryColumn, BeforeInsert, JoinColumn, OneToOne, AfterUpdate, AfterInsert } from "typeorm"
import { UserEntity } from "../user/user.entity";


@Entity({name:'Accounts'})
export class AccountEntity extends BaseEntity { 
    @PrimaryColumn()
    email: string

    @Column({nullable: false})
    password: string

    @Column({ default: 'active' })
    status: string;

    @Column({default: null})
    refresh_token: string;

    //@Column({type: 'enum', enum: Role}) // , default: Role.User
    @Column({ type: 'int', default: Role.User })
    role: number

    @OneToOne(() => UserEntity, (user) => user.account ) // { cascade: true }
    user: UserEntity;

    @BeforeInsert()
    emailToLowerCase(){
        this.email = this.email.toLowerCase();
    } 

    
}