import { Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  BeforeInsert 
} from 'typeorm';

@Entity({name: 'users'})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({name:'sub_id', length: 255, nullable: true })
  subId?: string;

  @Column('text')
  password: string;

  @Column({ type: 'varchar', length: 50 })
  status!: 'ACTIVE' | 'INACTIVE' | 'BANNED';

  @Column('text', {name:'refresh_token', nullable: true })
  refreshToken?: string;

  @CreateDateColumn({name:'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({name:'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  phone?: string;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({name:'role_type', type: 'varchar', length: 10, default: 'USER' })
  roleType!: 'USER' | 'ADMIN';
  
  @Column({name:'auth_method',type: 'varchar', length: 50, nullable: false }) //select: false
  authMethod!: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
