import { IBaseService } from 'src/modules/v1/bases/base.interface';
import { PositionEntity } from './position.entity';

export type IPositionService = IBaseService<PositionEntity>;
