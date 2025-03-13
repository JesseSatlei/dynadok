import { IBaseRepository } from "./IBaseRepository";
import { Client } from "../entities/Client";

export interface IClientRepository extends IBaseRepository<Client> {
  findByEmail(email: string): Promise<Client | null>;
}
