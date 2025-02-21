import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity({name: 'brands'})
export class BrandEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'brand_name', type: 'varchar', length: 50, nullable: false, unique: true })
  brandName!: string;

  @Column({name:'brand_url', type: 'varchar', length: 255, nullable: false, unique: true })
  brandUrl!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({name:'brand_abbreviation', type: 'varchar', length: 10, nullable: false, unique: true })
  brandAbbreviation!: string;
}
