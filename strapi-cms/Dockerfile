FROM node:18-alpine
# Системні залежності
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev
WORKDIR /srv/app
# Копіюємо файли (вони вже мають там бути після кроку №1)
COPY package*.json ./
RUN npm install pg --legacy-peer-deps && npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 1337
CMD ["npm", "run", "develop"]