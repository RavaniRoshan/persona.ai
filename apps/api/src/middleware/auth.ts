import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { Logger } from '@personamirror/shared-utils';

const logger = new Logger({ serviceName: 'personamirror-auth' });

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      requestId: string;
    }
  }
}

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase configuration', new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required'));
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      logger.warn('Authentication required - no token provided', {
        path: req.path,
        ip: req.ip
      });
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No authorization token provided'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      logger.warn('Authentication required - malformed token', {
        path: req.path,
        ip: req.ip
      });
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Invalid authorization format'
      });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.warn('Authentication failed - invalid token', {
        path: req.path,
        ip: req.ip,
        error: error?.message
      });
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid or expired token'
      });
    }

    // Attach user to request
    req.user = user;
    
    logger.debug('Authentication successful', {
      userId: user.id,
      path: req.path
    });

    next();
  } catch (error) {
    logger.error('Authentication error', error as Error, {
      path: req.path,
      ip: req.ip
    });
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Authentication check failed'
    });
  }
}

export function requireRole(role: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check user role in database
    const { data, error } = await supabase
      .from('user_settings')
      .select('role')
      .eq('user_id', req.user.id)
      .single();

    if (error || !data || data.role !== role) {
      logger.warn('Authorization failed - insufficient permissions', {
        userId: req.user.id,
        requiredRole: role,
        path: req.path
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
}
