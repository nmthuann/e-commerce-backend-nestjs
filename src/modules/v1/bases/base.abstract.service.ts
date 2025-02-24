import { DeleteResult, ObjectId, Repository } from 'typeorm';
import { IBaseService } from './base.interface';

export abstract class AbstractBaseService<T> implements IBaseService<T> {
  constructor(
    private readonly baseRepository: Repository<T>,
  ) {}

  async getAll(): Promise<T[]> {
    try {
      const tableName = this.baseRepository.metadata.tableName; 
      return await this.baseRepository
        .createQueryBuilder(tableName)
        .getMany();
    } catch (error) {
      console.error('Error in getAll:', error);
      throw new Error('Failed to fetch data.');
    }
  }

  async getOneById(id: number | string | ObjectId): Promise<T | null> {
    try {
      const tableName = this.baseRepository.metadata.tableName; 
      return await this.baseRepository
        .createQueryBuilder(tableName)
        .where(`${tableName}.id = :id`, { id })
        .getOne();
    } catch (error) {
      console.error(`Error in getOneById (id=${id}):`, error);
      throw new Error('Failed to retrieve the item.');
    }
  }

  async createOne(data: T): Promise<T> {
    try {
      const newEntity = this.baseRepository.create(data);
      return await this.baseRepository.save(newEntity);
    } catch (error) {
      console.error('Error in createOne:', error);
      throw new Error('Failed to create item.');
    }
  }

  async updateOneById(id: number, data: Partial<T>): Promise<T | null> {
    try {
      const tableName = this.baseRepository.metadata.tableName; 
      const entity = await this.baseRepository
        .createQueryBuilder(tableName)
        .where(`${tableName}.id = :id`, { id })
        .getOne();

      if (!entity) {
        console.warn(`Warning: updateOneById - Entity not found (id=${id})`);
        return null;
      }

      const updatedEntity = { ...entity, ...data };
      return await this.baseRepository.save(updatedEntity);
    } catch (error) {
      console.error(`Error in updateOneById (id=${id}):`, error);
      throw new Error('Failed to update item.');
    }
  }

  async deleteOneById(id: number): Promise<DeleteResult> {
    try {
      return await this.baseRepository
        .createQueryBuilder()
        .softDelete()
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      console.error(`Error in deleteOneById (id=${id}):`, error);
      throw new Error('Failed to delete item.');
    }
  }
}
