FROM node as builder

WORKDIR /builder
COPY . .
RUN npm i
RUN npm run build

FROM node:slim

WORKDIR /app
COPY . .
RUN npm i --omit=dev
COPY --from=builder /builder/dist .
RUN chown -R 1000:1000 .
RUN chmod +x /entry.sh
ENTRYPOINT ["/entry.sh"]