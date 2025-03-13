export class Client {
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string, email: string, phone: string, id?: string) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
