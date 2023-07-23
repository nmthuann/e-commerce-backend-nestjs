import { DeleteResult, Repository } from "typeorm";
import { IBaseService } from "./base.interface";

export abstract class BaseService<T> implements IBaseService<T>{
  constructor(private readonly baseRepository: Repository<T>) {}

  async getAll(): Promise<T[]> {
    return await this.baseRepository.find();
  }

  async getOneById(id: number): Promise<T> {
    return await this.baseRepository.findOneById(id);
  }

  async createOne(data: T): Promise<T> {
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