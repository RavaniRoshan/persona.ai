import { Request, Response, NextFunction } from 'express';
import { logger } from '../index';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log the error
  logger.error('Unhandled error', err, {
    path: req.path,
    method: req.method,
    userId: req.user?.id,
    requestId: req.requestId
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      ...(isDevelopment && { stack: err.stack })
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  if (err.name === 'RateLimitError') {
    return res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: 'Too many requests, please try again later'
    });
  }

  // Default 500 error
  res.status(500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? err.message : 'An unexpected error occurred',
    requestId: req.requestId,
    ...(isDevelopment && { stack: err.stack })
  });
}
