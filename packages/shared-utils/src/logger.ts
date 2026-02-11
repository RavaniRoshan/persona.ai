import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

export interface LoggerConfig {
  level?: string;
  format?: 'json' | 'pretty';
  logDir?: string;
  enableConsole?: boolean;
  enableFile?: boolean;
  serviceName?: string;
}

export class Logger {
  private logger: winston.Logger;
  private requestId: string;

  constructor(config: LoggerConfig = {}) {
    const {
      level = process.env.LOG_LEVEL || 'info',
      format = process.env.LOG_FORMAT as 'json' | 'pretty' || 'json',
      logDir = './logs',
      enableConsole = process.env.NODE_ENV !== 'production',
      enableFile = true,
      serviceName = 'personamirror'
    } = config;

    this.requestId = this.generateRequestId();

    const transports: winston.transport[] = [];

    if (enableConsole) {
      transports.push(
        new winston.transports.Console({
          format: format === 'pretty' 
            ? winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp, ...metadata }) => {
                  return `[${timestamp}] ${level}: ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata) : ''}`;
                })
              )
            : winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
              )
        })
      );
    }

    if (enableFile) {
      transports.push(
        new DailyRotateFile({
          filename: path.join(logDir, 'application-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d'
        })
      );

      transports.push(
        new DailyRotateFile({
          filename: path.join(logDir, 'error-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d'
        })
      );
    }

    this.logger = winston.createLogger({
      level,
      defaultMeta: {
        service: serviceName,
        requestId: this.requestId,
        environment: process.env.NODE_ENV || 'development'
      },
      transports
    });
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  info(message: string, meta?: Record<string, any>): void {
    this.logger.info(message, meta);
  }

  error(message: string, error?: Error, meta?: Record<string, any>): void {
    this.logger.error(message, {
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : undefined,
      ...meta
    });
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.logger.debug(message, meta);
  }

  getRequestId(): string {
    return this.requestId;
  }

  child(metadata: Record<string, any>): Logger {
    const childLogger = new Logger({
      level: this.logger.level,
      format: 'json',
      enableConsole: false,
      enableFile: false
    });
    
    childLogger.logger = this.logger.child(metadata);
    return childLogger;
  }
}

// Create default logger instance
export const defaultLogger = new Logger();

// Export for use in other modules
export { winston };
