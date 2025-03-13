export interface IBaseRepository<T> {
  create(data: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: string): Promise<boolean>;
}
