import { Client } from '../../domain/entities/Client';
import RedisClient from '../../infrastructure/cache/RedisClient';
import { AppError } from '../../shared/AppError';
import { ClientUseCase } from '../use-cases/ClientUseCase';
import { MessageProducer } from './MessageProducer';

export class ClientService {
  private clientUseCase: ClientUseCase;
  private cacheExpiration = 300;
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
    try {
      const client = await this.clientUseCase.create(name, email, phone);

      await this.redis.del('clients');

      if (this.messageProducer) {
        await this.messageProducer.sendMessage('client_created', JSON.stringify(client));
      }

      return client;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      }
      throw new AppError('An unknown error occurred', 400);
    }
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client | null> {
    try {
      const updatedClient = await this.clientUseCase.update(id, data);

      if (updatedClient) {
        await this.redis.set(`client:${id}`, JSON.stringify(updatedClient), { EX: this.cacheExpiration });
        await this.redis.del('clients');
      }

      return updatedClient;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      }
      throw new AppError('An unknown error occurred', 400);
    }
  }

  async getClientById(id: string): Promise<Client | null> {
    try {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      }
      throw new AppError('An unknown error occurred', 400);
    }
  }

  async listClients(): Promise<Client[]> {
    try {
      const cacheKey = 'clients';

      const cachedClients = await this.redis.get(cacheKey);
      if (cachedClients) {
        return JSON.parse(cachedClients);
      }

      const clients = await this.clientUseCase.list();
      await this.redis.set(cacheKey, JSON.stringify(clients), { EX: this.cacheExpiration });

      return clients;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      }
      throw new AppError('An unknown error occurred', 400);
    }
  }

  async deleteClient(id: string): Promise<boolean> {
    try {
      const deleted = await this.clientUseCase.delete(id);

      if (deleted) {
        await this.redis.del(`client:${id}`);
        await this.redis.del('clients');
      }

      return deleted;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      }
      throw new AppError('An unknown error occurred', 400);
    }
  }
}
