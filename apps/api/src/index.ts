import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import { createClient } from '@supabase/supabase-js';
import { Logger } from '@personamirror/shared-utils';
import { healthRouter } from './routes/health';
import { personaRouter } from './routes/persona';
import { contentRouter } from './routes/content';
import { queueRouter } from './routes/queue';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/error';
import { requestLogger } from './middleware/logging';

const app = express();
const logger = new Logger({ serviceName: 'personamirror-api' });

// Redis client for rate limiting
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => req.ip || 'unknown',
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('user-agent')
    });
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000)
    });
  }
});

app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Too many authentication attempts, please try again later.' }
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check (no auth required)
app.use('/health', healthRouter);

// Public routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'PersonaMirror API',
    version: '1.0.0',
    status: 'running',
    documentation: '/docs'
  });
});

// Protected routes
app.use('/api/personas', authMiddleware, personaRouter);
app.use('/api/content', authMiddleware, contentRouter);
app.use('/api/queue', authMiddleware, queueRouter);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

const PORT = process.env.PORT || 3001;

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await redis.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await redis.quit();
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info(`API server running on port ${PORT}`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    redisConnected: redis.status === 'ready',
    supabaseUrl: process.env.SUPABASE_URL ? 'configured' : 'missing'
  });
});

export { app, redis, supabase, logger };
