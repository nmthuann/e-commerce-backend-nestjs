import { DeleteResult, ObjectId } from 'typeorm';

export interface IBaseService<T> {
  getAll(): Promise<T[] | any>;
  getOneById(id: number | string | ObjectId): Promise<T | any>;
  createOne(data: T | any): Promise<T>;
  updateOneById(id: number | string, data: T | any): Promise<T | any>;
  deleteOneById(id: number): Promise<DeleteResult>;
}
