import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BrandEntity } from "../entities/brand.entity";

@Injectable()
export class BrandService {
  constructor(
  @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) {
  }

  async getAll(): Promise<BrandEntity[]> {
    return await this.brandRepository.find()
  }
}
