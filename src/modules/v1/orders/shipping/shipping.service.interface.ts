import { IBaseService } from 'src/common/bases/base.interface';
import { ShippingDto } from './shipping.dto';

export type IShippingService = IBaseService<ShippingDto>;
