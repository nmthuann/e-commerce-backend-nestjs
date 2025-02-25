import { BrandDto } from "./brand.dto";

export interface IBrandService {
    getAll(): Promise<BrandDto[]>
}