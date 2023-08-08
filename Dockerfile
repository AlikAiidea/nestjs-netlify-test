FROM node:19.8.1-slim

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

RUN chmod +x /app/entry.sh
ENTRYPOINT ["/app/entry.sh"]
