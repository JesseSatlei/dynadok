import { Client } from '../../domain/entities/Client';
import RedisClient from '../../infrastructure/cache/RedisClient';
import { ClientUseCase } from '../use-cases/ClientUseCase';
import { MessageProducer } from './MessageProducer';

export class ClientService {
  private clientUseCase: ClientUseCase;
  private cacheExpiration = 300; // 5 minutos
  private redis = RedisClient.getInstance();
  private messageProducer: MessageProducer | null = null;

  constructor() {
    this.clientUseCase = new ClientUseCase();
    this.initializeMessageProducer();
  }

  private async initializeMessageProducer() {
    this.messageProducer = await MessageProducer.getInstance();
  }

  async createClient(name: string, email: string, phone: string): Promise<Client> {
    const client = await this.clientUseCase.create(name, email, phone);

    await this.redis.del('clients'); // Invalida o cache da lista de clientes

    if (this.messageProducer) {
      await this.messageProducer.sendMessage('client_created', JSON.stringify(client));
    }

    return client;
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client | null> {
    const updatedClient = await this.clientUseCase.update(id, data);

    if (updatedClient) {
      await this.redis.set(`client:${id}`, JSON.stringify(updatedClient), { EX: this.cacheExpiration });
      await this.redis.del('clients');
    }

    return updatedClient;
  }

  async getClientById(id: string): Promise<Client | null> {
    const cacheKey = `client:${id}`;

    const cachedClient = await this.redis.get(cacheKey);
    if (cachedClient) {
      return JSON.parse(cachedClient);
    }

    const client = await this.clientUseCase.getById(id);
    if (client) {
      await this.redis.set(cacheKey, JSON.stringify(client), { EX: this.cacheExpiration });
    }

    return client;
  }

  async listClients(): Promise<Client[]> {
    const cacheKey = 'clients';

    const cachedClients = await this.redis.get(cacheKey);
    if (cachedClients) {
      return JSON.parse(cachedClients);
    }

    const clients = await this.clientUseCase.list();
    await this.redis.set(cacheKey, JSON.stringify(clients), { EX: this.cacheExpiration });

    return clients;
  }

  async deleteClient(id: string): Promise<boolean> {
    const deleted = await this.clientUseCase.delete(id);

    if (deleted) {
      await this.redis.del(`client:${id}`);
      await this.redis.del('clients');
    }

    return deleted;
  }
}