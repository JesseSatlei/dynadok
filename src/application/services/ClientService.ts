import { Client } from '../../domain/entities/Client';
import RedisClient from '../../infrastructure/cache/RedisClient';
import { ClientUseCase } from '../use-cases/ClientUseCase';
import { MessageProducer } from './MessageProducer';

export class ClientService {
  private clientUseCase: ClientUseCase;
  private cacheExpiration = 300; // 5 minutos
  private redis = RedisClient.getInstance(); // Obtém a instância do Redis
  private messageProducer!: MessageProducer;

  constructor() {
    this.clientUseCase = new ClientUseCase();
    MessageProducer.getInstance().then(instance => {
      this.messageProducer = instance;
    });
  }

  async createClient(name: string, email: string, phone: string): Promise<Client> {
    const client = await this.clientUseCase.create(name, email, phone);

    // Invalida o cache da lista de clientes
    await this.redis.del('clients');

    // Envia mensagem para a fila
    if (this.messageProducer) {
      await this.messageProducer.sendMessage('client_created', JSON.stringify(client));
    }

    return client;
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client | null> {
    const updatedClient = await this.clientUseCase.update(id, data);

    if (updatedClient) {
      await this.redis.set(`client:${id}`, JSON.stringify(updatedClient), { EX: this.cacheExpiration });
      await this.redis.del('clients'); // Invalida o cache da lista de clientes
    }

    return updatedClient;
  }

  async getClientById(id: string): Promise<Client | null> {
    const cacheKey = `client:${id}`;

    // Verifica se o cliente está no cache
    const cachedClient = await this.redis.get(cacheKey);
    if (cachedClient) {
      return JSON.parse(cachedClient);
    }

    // Se não estiver no cache, busca no banco de dados
    const client = await this.clientUseCase.getById(id);
    if (client) {
      await this.redis.set(cacheKey, JSON.stringify(client), { EX: this.cacheExpiration });
    }

    return client;
  }

  async listClients(): Promise<Client[]> {
    const cacheKey = 'clients';

    // Verifica se a lista de clientes está no cache
    const cachedClients = await this.redis.get(cacheKey);
    if (cachedClients) {
      return JSON.parse(cachedClients);
    }

    // Se não estiver no cache, busca no banco de dados
    const clients = await this.clientUseCase.list();
    await this.redis.set(cacheKey, JSON.stringify(clients), { EX: this.cacheExpiration });

    return clients;
  }

  async deleteClient(id: string): Promise<boolean> {
    const deleted = await this.clientUseCase.delete(id);

    if (deleted) {
      await this.redis.del(`client:${id}`);
      await this.redis.del('clients'); // Invalida o cache da lista de clientes
    }

    return deleted;
  }
}
