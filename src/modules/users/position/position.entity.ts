import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'Positions' })
export class PositionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    position_id: number;

    @Column({ nullable: false })
    position_name: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    offer: number;
}
