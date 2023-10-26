import { IBaseService } from 'src/modules/bases/base.interface';
import { ShippingDto } from './shipping.dto';

export type IShippingService = IBaseService<ShippingDto>;
