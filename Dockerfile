# Usa uma imagem oficial do Node.js como base
FROM node:18

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos do projeto para dentro do contêiner
COPY package*.json tsconfig.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Compila o código TypeScript antes de rodar
RUN npm run build

# Expõe a porta da aplicação
EXPOSE ${APP_PORT}

# Comando para iniciar a aplicação
CMD ["node", "dist/src/server.js"]
