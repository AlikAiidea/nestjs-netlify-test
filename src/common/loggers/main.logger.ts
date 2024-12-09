import * as winston from 'winston'

import { LoggerService as NestLoggerService } from '@nestjs/common'

import { Env } from '../dto/enums/env.enum'

export class MainLogger implements NestLoggerService {
  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.timestamp({ format: new Date().toLocaleString('en-US', { timeZone: 'Asia/Tehran' }) }),
      ),
      transports: [
        new winston.transports.Console({
          level: process.env[Env.SERVICE_LOG_LEVEL] ?? 'silly',
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
    })
  }

  log(message: string, context?: string) {
    this.logger.info({ message, context, timestamp: new Date().toISOString() })
  }
  error(message: string, trace: string, context?: string) {
    this.logger.error({ message, trace, context, timestamp: new Date().toISOString() })
  }
  warn(message: string, context?: string) {
    this.logger.warn({ message, context, timestamp: new Date().toISOString() })
  }
  debug(message: string, context?: string) {
    this.logger.debug({ message, context, timestamp: new Date().toISOString() })
  }
  verbose(message: string, context?: string) {
    this.logger.verbose({ message, context, timestamp: new Date().toISOString() })
  }
}
