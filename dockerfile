FROM node:20-slim
# Додаємо libvips, який часто потрібен для обробки зображень у Medusa/Sharp
RUN apt-get update && apt-get install -y python3 make g++ libvips-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /app/backend
COPY package*.json ./
RUN npm install --ignore-scripts --legacy-peer-deps
COPY . .
EXPOSE 9000
CMD ["npx", "medusa", "develop"]