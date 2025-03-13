import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { Client } from "../../domain/entities/Client";
import ClientModel from "./models/ClientModel";

export class MongoClientRepository implements IClientRepository {
  async create(data: Client): Promise<Client> {
    const client = new ClientModel(data);
    await client.save();
    return client.toObject();
  }

  async update(id: string, data: Partial<Client>): Promise<Client | null> {
    const updatedClient = await ClientModel.findByIdAndUpdate(id, data, { new: true });
    return updatedClient ? updatedClient.toObject() : null;
  }

  async findById(id: string): Promise<Client | null> {
    const client = await ClientModel.findById(id);
    return client ? client.toObject() : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await ClientModel.findOne({ email });
    return client ? client.toObject() : null;
  }

  async findAll(): Promise<Client[]> {
    const clients = await ClientModel.find();
    return clients.map(client => client.toObject());
  }

  async delete(id: string): Promise<boolean> {
    const result = await ClientModel.findByIdAndDelete(id);
    return result !== null;
  }
}
