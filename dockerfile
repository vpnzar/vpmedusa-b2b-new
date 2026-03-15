FROM node:20-slim

# Системні штуки для Node.js
RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /app/backend

# Копіюємо лише package.json
COPY backend/package*.json ./

# Встановлюємо пакети (ігноруємо помилки скриптів)
RUN npm install --ignore-scripts

# Копіюємо код
COPY backend/ .

# ВАЖЛИВО: ми НЕ запускаємо npx medusa build тут. 
# Ми запускаємо develop прямо при старті контейнера.
EXPOSE 9000

CMD ["npx", "medusa", "develop"]