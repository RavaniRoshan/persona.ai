import { Request, Response, NextFunction } from 'express';
import { logger } from '../index';
import { v4 as uuidv4 } from 'uuid';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  req.requestId = requestId;

  // Log request start
  logger.info('Request started', {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id
  });

  // Capture response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    const logData = {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id
    };

    if (res.statusCode >= 500) {
      logger.error('Request failed', undefined, logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request warning', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
}
