import { Client } from '../../domain/entities/Client';
import { MongoClientRepository } from '../../infrastructure/database/MongoClientRepository';
import { AppError } from '../../shared/AppError';  // Adicione a importação do AppError

export class ClientUseCase {
  private mongoClientRepository: MongoClientRepository;

  constructor(mongoClientRepository?: MongoClientRepository) {
    this.mongoClientRepository = mongoClientRepository ?? new MongoClientRepository();
  }

  async create(name: string, email: string, phone: string): Promise<Client> {
    const existingClient = await this.mongoClientRepository.findByEmail(email);
    if (existingClient) {
      throw new AppError('E-mail já cadastrado.', 400);
    }

    const client = new Client(name, email, phone);
    return this.mongoClientRepository.create(client);
  }

  async update(id: string, data: Partial<Client>): Promise<Client | null> {
    const existingClient = await this.mongoClientRepository.findById(id);
    if (!existingClient) {
      throw new AppError('Cliente não encontrado.', 404);
    }

    return this.mongoClientRepository.update(id, data);
  }

  async getById(id: string): Promise<Client | null> {
    return this.mongoClientRepository.findById(id);
  }

  async list(): Promise<Client[]> {
    return this.mongoClientRepository.findAll();
  }

  async delete(id: string): Promise<boolean> {
    const existingClient = await this.mongoClientRepository.findById(id);
    if (!existingClient) {
      throw new AppError('Cliente não encontrado.', 404);
    }

    return this.mongoClientRepository.delete(id);
  }
}
