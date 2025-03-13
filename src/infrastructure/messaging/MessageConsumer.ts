import { RabbitMQ } from './RabbitMQ';

export class MessageConsumer {
  private static instance: MessageConsumer;
  private rabbitMQ!: RabbitMQ;

  private constructor() {}

  static async getInstance(): Promise<MessageConsumer> {
    if (!MessageConsumer.instance) {
      MessageConsumer.instance = new MessageConsumer();
      MessageConsumer.instance.rabbitMQ = await RabbitMQ.getInstance();
    }
    return MessageConsumer.instance;
  }

  async startListening() {
    await this.rabbitMQ.consume('client_created', (msg) => {
      if (msg) {
        const client = JSON.parse(msg.content.toString());
        console.log(`📥 Cliente cadastrado: Nome: ${client.name}, Email: ${client.email}, Telefone: ${client.phone}`);
      }
    });
  }
}
