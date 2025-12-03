FROM node:18-alpine

WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json* ./
RUN npm install --production

# Copiar código
COPY . .

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "src/index.js"]
