import { Router, Request, Response } from 'express';
import { redis, supabase, logger } from '../index';

const router: Router = Router();

// Health check endpoint
router.get('/', async (req: Request, res: Response) => {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    version: '1.0.0',
    uptime: process.uptime(),
    checks: {} as Record<string, any>
  };

  try {
    // Check Redis
    const redisStatus = redis.status;
    checks.checks.redis = {
      status: redisStatus === 'ready' ? 'healthy' : 'unhealthy',
      connected: redisStatus === 'ready'
    };
  } catch (error) {
    checks.checks.redis = {
      status: 'unhealthy',
      error: (error as Error).message
    };
  }

  try {
    // Check Supabase
    const { data, error } = await supabase.from('users').select('count');
    checks.checks.database = {
      status: error ? 'unhealthy' : 'healthy',
      connected: !error
    };
  } catch (error) {
    checks.checks.database = {
      status: 'unhealthy',
      error: (error as Error).message
    };
  }

  // Memory usage
  const memUsage = process.memoryUsage();
  checks.checks.memory = {
    status: 'healthy',
    used: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
    total: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB'
  };

  // Determine overall status
  const allHealthy = Object.values(checks.checks).every((check: any) => check.status === 'healthy');
  checks.status = allHealthy ? 'healthy' : 'degraded';

  const statusCode = allHealthy ? 200 : 503;
  res.status(statusCode).json(checks);
});

// Detailed health check (for internal monitoring)
router.get('/detailed', async (req: Request, res: Response) => {
  const detailed = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    checks: {} as Record<string, any>
  };

  // System metrics
  detailed.checks.system = {
    platform: process.platform,
    nodeVersion: process.version,
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    uptime: process.uptime()
  };

  // Service connections
  detailed.checks.services = {
    redis: {
      status: redis.status,
      options: {
        host: redis.options.host,
        port: redis.options.port
      }
    },
    supabase: {
      url: process.env.SUPABASE_URL ? 'configured' : 'missing',
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  };

  res.json(detailed);
});

// Liveness probe (for Kubernetes)
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({ status: 'alive' });
});

// Readiness probe (for Kubernetes)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check critical dependencies
    await redis.ping();
    await supabase.from('users').select('count').limit(1);
    
    res.status(200).json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'not ready' });
  }
});

export { router as healthRouter };
