import { ObjectId } from 'typeorm';

export interface IBaseService<T> {
  getAll(): Promise<T[]>;
  getOneById(id: number | string | ObjectId): Promise<T>;
  createOne(data: T): Promise<T>;
  updateOneById(id: number | string, data: T): Promise<T>;
  deleteOneById(id: number): Promise<void>;
}
