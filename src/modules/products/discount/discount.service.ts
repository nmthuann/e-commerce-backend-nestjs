import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DiscountEntity } from "./discount.entity";
import { Repository } from "typeorm";
import { BaseService } from "src/modules/bases/base.abstract";
import { DiscountDto } from "./discount-dto/discount.dto";
import { IDiscountService } from "./discount.service.interface";

@Injectable()
export class DiscountService extends BaseService<DiscountEntity> implements IDiscountService {
  constructor(
    @InjectRepository(DiscountEntity) 
    private discountRepository: Repository<DiscountEntity>) {
        super(discountRepository);
    }
}