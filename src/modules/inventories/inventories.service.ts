import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductSerialEntity } from "./entities/product-serial.entity";

@Injectable()
export class InventoriesService {
  constructor(
  @InjectRepository(ProductSerialEntity)
    private readonly inventoriesRepository: Repository<ProductSerialEntity>,
  ) {
  }

  async getAll(): Promise<ProductSerialEntity[]> {
    return await this.inventoriesRepository.find()
  }
}
