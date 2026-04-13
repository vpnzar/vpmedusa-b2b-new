FROM node:20-alpine

# Системні залежності для Strapi
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

WORKDIR /srv/app

# Копіюємо лише файли залежностей (це пришвидшує білд)
COPY package*.json ./

# Встановлюємо залежності
RUN npm install --legacy-peer-deps

# Копіюємо все інше
COPY . .

# Виставляємо порт
EXPOSE 1337

# Запускаємо в режимі розробки (він сам збере адмінку при старті)
CMD ["npm", "run", "develop"]