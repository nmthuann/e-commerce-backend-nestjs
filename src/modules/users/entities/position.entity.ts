import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name: 'positions'})
export class PositionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
