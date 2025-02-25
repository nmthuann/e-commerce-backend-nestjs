import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BrandEntity } from "./brand.entity";
import { IBrandService } from "./brand.service.interface";
import { BrandDto } from "./brand.dto";

@Injectable()
export class BrandService implements IBrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) {
  }

  async getAll(): Promise<BrandDto[]> {
    const brands = await this.brandRepository.find();
    return brands.map(brand => new BrandDto(brand));
  }
}
