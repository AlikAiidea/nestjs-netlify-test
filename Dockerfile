FROM docker.ptdev.ir/node:19.8.1-slim

WORKDIR /app
COPY . .

RUN npm config set registry https://npm.ptdev.ir/repository/npm/
RUN npm install
RUN npm run build

RUN chmod +x /app/entry.sh
ENTRYPOINT ["/app/entry.sh"]
