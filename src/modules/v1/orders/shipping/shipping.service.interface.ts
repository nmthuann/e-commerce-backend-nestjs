import { IBaseService } from 'src/modules/v1/bases/base.interface';
import { ShippingDto } from './shipping.dto';

export type IShippingService = IBaseService<ShippingDto>;
