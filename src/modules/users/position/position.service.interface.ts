import { IBaseService } from "src/modules/bases/base.interface";
import { PositionDto } from "./position.dto";
import { PositionEntity } from "./position.entity";

export interface IPositionService extends IBaseService<PositionEntity>{
    
}