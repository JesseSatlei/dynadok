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
const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:example@mongo_db:27017/clientdb'; // Atualizando para o nome do serviço mongo no Docker

// Configuração do logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

// Função para iniciar o servidor apenas quando MongoDB e Redis estiverem conectados
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('✅ MongoDB conectado com sucesso!');

    await RedisClient.connect(); // Usa o método atualizado que evita múltiplas conexões

    app.listen(PORT, () => {
      logger.info(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1); // Sai da aplicação em caso de erro
  }
};

// Iniciar consumidor de mensagens
MessageConsumer.getInstance().then(consumer => {
  consumer.startListening();
});

app.get('/', (req, res) => {
  res.send('🚀 API rodando...');
});

startServer();
