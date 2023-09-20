import * as winston from 'winston'

import { Injectable, LoggerService } from '@nestjs/common'

/** Winston logger*/
@Injectable()
export class WinstonLogger implements LoggerService {
  /** The logger instance used by the WinstonLogger class.*/
  private readonly logger: winston.Logger

  /**
   * Creates an instance of WinstonLogger.
   * @param logFileName - The name of the log file (optional, defaults to 'http-request').
   */
  constructor(logInConsole: boolean = true, logInFile: boolean = true, logFileName: string = 'http-request') {
    this.logger = winston.createLogger({
      transports: [
        ...(logInFile
          ? [
              new winston.transports.DailyRotateFile({
                filename: `logs/%DATE%-${logFileName}.log`,
                format: winston.format.combine(
                  winston.format.timestamp(),
                  winston.format.prettyPrint(),
                  winston.format.errors(),
                  winston.format.json(),
                ),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: false,
                maxFiles: '30d',
                handleExceptions: true,
              }),
            ]
          : []),
        ...(logInConsole
          ? [
              new winston.transports.Console({
                format: winston.format.combine(
                  winston.format.cli(),
                  winston.format.splat(),
                  winston.format.timestamp(),
                  winston.format.printf((info) => {
                    return `[Nest] ${info.timestamp} ${info.level}: ${info.message}`
                  }),
                ),
              }),
            ]
          : []),
      ],
    })
  }

  /**
   * Logs a message.
   * @param message - The message to log.
   */
  log(message: string) {
    this.logger.info(message)
  }

  /**
   * Logs an error message.
   * @param message - The error message to log.
   * @param trace - The stack trace of the error.
   */
  error(message: string, trace: string) {
    this.logger.error(message, trace)
  }

  /**
   * Logs a warning message.
   * @param message - The warning message to log.
   */
  warn(message: string) {
    this.logger.warn(message)
  }

  /**
   * Logs a debug message.
   * @param message - The debug message to log.
   */
  debug(message: string) {
    this.logger.debug(message)
  }

  /**
   * Logs a verbose message.
   * @param message - The verbose message to log.
   */
  verbose(message: string) {
    this.logger.verbose(message)
  }
}

/** Class for saving every console response into log file */
@Injectable()
export class ConsoleLogger {
  /**
   * Creates an instance of ConsoleLogger.
   */
  constructor(private readonly logger: WinstonLogger) {}

  /**
   * Saves console log responses into console-logs.log file
   * @param logFunction as string `log` ,`info`, `error`
   */
  private saveConsoleLogToFile(logFunction: string) {
    const originalConsoleLog = console[logFunction]

    console[logFunction] = (...args: any[]) => {
      const log = {
        from: `provider-base-console.${logFunction}`,
        location: this.getStackTrace().split('    ')[2].trim(),
        message: '',
      }

      const stringifyArg = (arg: any) => {
        return typeof arg == 'string' ? arg : JSON.stringify(arg)
      }

      if (typeof args[0] == 'string') {
        const placeholders = args[0].match(/%[a-zA-Z]/g) // Find all placeholders in the log message

        if (placeholders) {
          log.message = args[0]

          placeholders.forEach((placeholder, index) => {
            const value = stringifyArg(args[index + 1])
            log.message = log.message.replace(placeholder, value)
          })
        } else {
          log.message = args.map(stringifyArg).join(' ')
        }
      } else {
        log.message = args.map(stringifyArg).join(' ')
      }

      this.logger.log(`from: ${log.from}, location: ${log.location}, message: ${log.message}`)
      originalConsoleLog.apply(console, args)
    }
  }

  /** Saves console.log into file */
  private logConsoleLog() {
    this.saveConsoleLogToFile('log')
  }

  /** Saves console.info into file  */
  private logConsoleInfo() {
    this.saveConsoleLogToFile('info')
  }

  /** Saves console.error into file  */
  private logConsoleError() {
    this.saveConsoleLogToFile('error')
  }

  /** Saves all console messages into file */
  saveConsoleMessages() {
    this.logConsoleLog()
    this.logConsoleInfo()
    this.logConsoleError()
  }

  /**
   * Retrieves the stack trace of the current execution context.
   * @returns  The stack trace as a string
   */
  private getStackTrace() {
    const obj = {} as Error
    Error.captureStackTrace(obj, this.getStackTrace)
    return obj.stack
  }
}

/** Create an instance of ConsoleLogger */
export const consoleLogger = new ConsoleLogger(new WinstonLogger(true, false, 'console'))
