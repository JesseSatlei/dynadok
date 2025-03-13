import { Client } from '../../domain/entities/Client';
import { ClientRepository } from '../../infrastructure/database/ClientRepository';

export class ClientUseCase {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  async create(name: string, email: string, phone: string): Promise<Client> {
    const existingClient = await this.clientRepository.findByEmail(email);
    if (existingClient) {
      throw new Error('E-mail já cadastrado.');
    }
    const client = new Client(name, email, phone);
    return this.clientRepository.create(client);
  }

  async update(id: string, data: Partial<Client>): Promise<Client | null> {
    return this.clientRepository.update(id, data);
  }

  async getById(id: string): Promise<Client | null> {
    return this.clientRepository.findById(id);
  }

  async list(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }

  async delete(id: string): Promise<boolean> {
    return this.clientRepository.delete(id);
  }
}
