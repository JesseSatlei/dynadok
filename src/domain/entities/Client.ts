import { BaseEntity } from "./BaseEntity";

export class Client extends BaseEntity {
  name: string;
  email: string;
  phone: string;

  constructor(name: string, email: string, phone: string, id?: string) {
    super(id);
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
}
