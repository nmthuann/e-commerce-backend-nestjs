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

  @Column({ length: 255, nullable: true })
  subId?: string;

  @Column('text')
  password: string;

  @Column({ type: 'varchar', length: 50 })
  status!: 'ACTIVE' | 'INACTIVE' | 'BANNED';

  @Column('text', { nullable: true })
  refreshToken?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  phone?: string;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({ type: 'varchar', length: 10, default: 'USER' })
  roleType!: 'USER' | 'ADMIN';
  
  @Column({type: 'varchar', length: 50, nullable: false }) //select: false
  authMethod!: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
