import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeEntity } from "./employee.entity";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";

@Module({
    imports:[
       TypeOrmModule.forFeature([EmployeeEntity])
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