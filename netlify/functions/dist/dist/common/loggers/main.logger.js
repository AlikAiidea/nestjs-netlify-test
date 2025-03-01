"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainLogger = void 0;
const winston = require("winston");
const env_enum_1 = require("../dto/enums/env.enum");
class MainLogger {
    constructor() {
        this.logger = winston.createLogger({
            format: winston.format.combine(winston.format.json(), winston.format.timestamp(), winston.format.timestamp({ format: new Date().toLocaleString('en-US', { timeZone: 'Asia/Tehran' }) })),
            transports: [
                new winston.transports.Console({
                    level: process.env[env_enum_1.Env.SERVICE_LOG_LEVEL] ?? 'silly',
                }),
                new winston.transports.DailyRotateFile({
                    filename: `logs/%DATE%-error.log`,
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: false,
                    maxFiles: '30d',
                    level: 'error',
                }),
                new winston.transports.DailyRotateFile({
                    filename: `logs/%DATE%-combined.log`,
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: false,
                    maxFiles: '30d',
                    level: 'debug',
                }),
            ],
            handleExceptions: true,
        });
    }
    log(message, context) {
        this.logger.info({ message, context, timestamp: new Date().toISOString() });
    }
    error(message, trace, context) {
        this.logger.error({ message, trace, context, timestamp: new Date().toISOString() });
    }
    warn(message, context) {
        this.logger.warn({ message, context, timestamp: new Date().toISOString() });
    }
    debug(message, context) {
        this.logger.debug({ message, context, timestamp: new Date().toISOString() });
    }
    verbose(message, context) {
        this.logger.verbose({ message, context, timestamp: new Date().toISOString() });
    }
}
exports.MainLogger = MainLogger;
//# sourceMappingURL=main.logger.js.map