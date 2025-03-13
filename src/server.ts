import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import RedisClient from './infrastructure/cache/RedisClient';
import winston from 'winston';
import { MessageConsumer } from './infrastructure/messaging/MessageConsumer';
import clientRoutes from './presentation/routes/client.routes';
import cors from 'cors';
import { errorMiddleware } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());
app.use(errorMiddleware);

app.use('/clients', clientRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:example@mongo_db:27017/clientdb';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('✅ MongoDB conectado com sucesso!');

    await RedisClient.connect();

    app.listen(PORT, () => {
      logger.info(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

MessageConsumer.getInstance().then(consumer => {
  consumer.startListening();
});

app.get('/', (req, res) => {
  res.send('🚀 API rodando...');
});

startServer();
