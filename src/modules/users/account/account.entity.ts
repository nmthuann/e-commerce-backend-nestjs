
import { BaseEntity } from "src/modules/bases/base.entity";
import { Role } from "src/modules/bases/enums/role.enum";
import { Entity,  Column, CreateDateColumn, DeepPartial, PrimaryColumn, BeforeInsert, JoinColumn, OneToOne, AfterUpdate, AfterInsert } from "typeorm"


@Entity({name:'AccountUsers'})
export class AccountUserEntity extends BaseEntity { 
    @PrimaryColumn()
    email: string

    @Column({nullable: false})
    password: string

    @Column({ default: 'active' })
    status: string;

    @Column({default: null})
    refresh_token: string;

    @Column({type: 'enum', enum: Role, default: Role.User})
    role: Role

    // @OneToOne(() => InformationUserEntity, (infor) => infor.account, { cascade: true })
    // @JoinColumn()
    // infor: InformationUserEntity;

    @BeforeInsert()
    emailToLowerCase(){
        this.email = this.email.toLowerCase();
    } 

    
}