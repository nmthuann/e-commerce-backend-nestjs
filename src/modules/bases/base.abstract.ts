import { DeleteResult, ObjectId, Repository } from "typeorm";
import { IBaseService } from "./base.interface";
import { InjectRepository } from "@nestjs/typeorm";

export abstract class BaseService<T> implements IBaseService <T>{
  constructor(
     // @InjectRepository(<T>) 
    private readonly baseRepository: Repository<T>) {}

  async getAll(): Promise<T[]> {
    return await this.baseRepository.find();
  }

  async getOneById(id: number | string | ObjectId): Promise<T | any> {
    return await this.baseRepository.findOneById(id);
  }

  async createOne(data: T | any): Promise<T> {
    return await this.baseRepository.save(data);
  }

  async updateOneById(id: number, data: T): Promise<T> {
    const item = await this.baseRepository.findOneById(id);
    return await this.baseRepository.save({ ...item, ...data });
  }

  async deleteOneById(id: number): Promise<DeleteResult> {
    return await this.baseRepository.softDelete(id)
  }
}