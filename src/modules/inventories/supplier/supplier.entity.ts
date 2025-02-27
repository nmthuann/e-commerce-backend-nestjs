import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'suppliers' })
export class SupplierEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;
}
