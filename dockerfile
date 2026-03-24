FROM node:20-slim
RUN apt-get update && apt-get install -y python3 make g++
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --ignore-scripts --legacy-peer-deps
COPY backend/ .
EXPOSE 9000
CMD ["npx", "medusa", "develop"]