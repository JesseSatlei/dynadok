import { RabbitMQ } from '../../infrastructure/messaging/RabbitMQ';

export class MessageProducer {
  private static instance: MessageProducer;
  private rabbitMQ!: RabbitMQ;

  private constructor() {}

  static async getInstance(): Promise<MessageProducer> {
    if (!MessageProducer.instance) {
      MessageProducer.instance = new MessageProducer();
      MessageProducer.instance.rabbitMQ = await RabbitMQ.getInstance();
    }
    return MessageProducer.instance;
  }

  async sendMessage(queue: string, message: string) {
    await this.rabbitMQ.publish(queue, message);
  }
}
