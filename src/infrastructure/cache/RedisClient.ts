import { createClient } from 'redis';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export default class RedisClient {
  private static instance: ReturnType<typeof createClient>;

  private constructor() {}

  static getInstance() {
    if (!RedisClient.instance) {
      RedisClient.instance = createClient({
        socket: { host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT) || 6379 },
      });

      RedisClient.instance.on('error', (err) => logger.error('❌ Erro no Redis:', err));
    }

    return RedisClient.instance;
  }

  static async connect() {
    if (!RedisClient.instance) {
      RedisClient.getInstance();
    }

    if (!RedisClient.instance.isOpen) {
      await RedisClient.instance.connect();
      logger.info('✅ Redis conectado com sucesso!');
    } else {
      logger.info('🔄 Redis já está conectado.');
    }
  }
}
