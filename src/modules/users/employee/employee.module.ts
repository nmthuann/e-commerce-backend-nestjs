import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeEntity } from "./employee.entity";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { UserEntity } from "../user/user.entity";
import { PositionEntity } from "../position/position.entity";
import { UserModule } from "../user/user.module";
import { PositionModule } from "../position/position.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([EmployeeEntity]), //EmployeeEntity, , PositionEntity UserEntity
        UserModule,
        PositionModule,
    ],
    controllers: [EmployeeController],
    providers: [
        {
            provide: 'IEmployeeService',
            useClass: EmployeeService,
        },
    ],
    exports: ['IEmployeeService',]
})
export class EmployeeModule {}