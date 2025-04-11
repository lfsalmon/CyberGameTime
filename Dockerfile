FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production
FROM node:18-alpine
RUN npm install -g http-server
COPY --from=builder /app/dist/cyber-game-time/browser /usr/share/nginx/html
EXPOSE 8081
CMD ["http-server", "/usr/share/nginx/html", "-p", "8081"]
