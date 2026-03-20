FROM node:20-bookworm-slim

WORKDIR /usr/src/app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod" ]