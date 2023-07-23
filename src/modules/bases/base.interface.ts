import { DeleteResult } from "typeorm";

export interface IBaseService <T> {
    getAll(): Promise<T[]>;
    getOneById(id: number): Promise<T>;
    createOne(data: T): Promise<T>;
    updateOneById(id: number, data: T): Promise<T>;
    deleteOneById(id: number): Promise<DeleteResult>;
}