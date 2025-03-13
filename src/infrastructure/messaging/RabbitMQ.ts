import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib';

export class RabbitMQ {
  private static instance: RabbitMQ;
  private connection!: amqp.ChannelModel;
  private channel!: amqp.Channel;

  private constructor() {}

  static async getInstance(): Promise<RabbitMQ> {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ();
      await RabbitMQ.instance.connect();
    }
    return RabbitMQ.instance;
  }

  private async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost') as amqp.ChannelModel;

      this.channel = await this.connection.createChannel();
      console.log('✅ RabbitMQ conectado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao conectar no RabbitMQ:', error);
    }
  }

  async publish(queue: string, message: string) {
    if (!this.channel) return;
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message));
    console.log(`📤 Mensagem enviada para a fila '${queue}': ${message}`);
  }

  async consume(queue: string, callback: (msg: ConsumeMessage | null) => void) {
    if (!this.channel) return;
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, callback, { noAck: true });
  }
}
