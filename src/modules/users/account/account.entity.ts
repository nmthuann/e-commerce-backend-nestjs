
import { BaseEntity } from "src/modules/bases/base.entity";
import { Role } from "src/modules/bases/enums/role.enum";
import { Entity,  Column, CreateDateColumn, DeepPartial, PrimaryColumn, BeforeInsert, JoinColumn, OneToOne, AfterUpdate, AfterInsert } from "typeorm"
import { UserEntity } from "../user/user.entity";


@Entity({name:'Accounts'})
export class AccountEntity { 
    @PrimaryColumn({ type: "nvarchar", length: 50})
    email: string

    @Column({nullable: false, select: false})
    password: string

    @Column({  default: true }) // 0: false  1: true
    status: boolean;

    @Column({default: null})
    refresh_token: string;

    //@Column({type: 'enum', enum: Role}) // , default: Role.User
    @Column({ type: "nvarchar", length: 10 , default: Role.User })
    role: string

    @OneToOne(() => UserEntity, (user) => user.account ) // { cascade: true }
    user: UserEntity;

    @BeforeInsert()
    emailToLowerCase(){
        this.email = this.email.toLowerCase();
    } 
    
}