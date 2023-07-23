import { 
    CreateDateColumn, 
    DeleteDateColumn, 
    Entity, 
    UpdateDateColumn 
} from "typeorm";

@Entity()
export abstract class BaseEntity{

    @CreateDateColumn({
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' 
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
    })
    deletedAt: Date;
}