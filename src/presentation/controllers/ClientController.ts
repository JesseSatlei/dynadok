import { Request, Response } from 'express';
import { ClientService } from '../../application/services/ClientService';

export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone } = req.body;
      const client = await this.clientService.createClient(name, email, phone);
      res.status(201).json(client);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const client = await this.clientService.updateClient(id, req.body);
      if (!client) {
        res.status(404).json({ error: 'Cliente não encontrado' });
        return;
      }
      res.json(client);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const client = await this.clientService.getClientById(id);
      if (!client) {
        res.status(404).json({ error: 'Cliente não encontrado' });
        return;
      }
      res.json(client);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const clients = await this.clientService.listClients();
      res.json(clients);
    } catch (error: unknown) {
      console.log('detalhes do erro', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.clientService.deleteClient(id);
      if (!deleted) {
        res.status(404).json({ error: 'Cliente não encontrado' });
        return;
      }
      res.json({ message: 'Cliente removido com sucesso' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }
}
