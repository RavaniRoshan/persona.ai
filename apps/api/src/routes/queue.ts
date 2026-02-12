import { Router, Request, Response } from 'express';
import { supabase, logger } from '../index';
import { z } from 'zod';

const router: Router = Router();

// GET /api/queue - List content queue
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, limit = '50', offset = '0' } = req.query;
    
    let query = supabase
      .from('content_queue')
      .select(`
        *,
        persona:persona_id (name)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: queue, error } = await query;

    if (error) {
      logger.error('Failed to fetch queue', error, { userId: req.user.id });
      return res.status(500).json({ error: 'Failed to fetch queue' });
    }

    res.json({ queue, count: queue?.length || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/queue/:id - Get specific queue item
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data: item, error } = await supabase
      .from('content_queue')
      .select(`
        *,
        persona:persona_id (*)
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !item) {
      return res.status(404).json({ error: 'Queue item not found' });
    }

    res.json({ item });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/queue/:id - Update queue item
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updateSchema = z.object({
      draft: z.string().optional(),
      status: z.enum(['draft', 'review', 'approved', 'scheduled', 'rejected']).optional(),
      scheduledFor: z.string().datetime().optional()
    });

    const validation = updateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const updates: any = {};
    if (validation.data.draft) updates.draft = validation.data.draft;
    if (validation.data.status) updates.status = validation.data.status;
    if (validation.data.scheduledFor) updates.scheduled_for = validation.data.scheduledFor;

    const { data: item, error } = await supabase
      .from('content_queue')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !item) {
      return res.status(404).json({ error: 'Queue item not found or update failed' });
    }

    logger.info('Queue item updated', {
      userId: req.user.id,
      itemId: item.id,
      status: item.status
    });

    res.json({ item });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/queue/:id - Delete queue item
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('content_queue')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete item' });
    }

    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/queue/:id/approve - Approve content for posting
router.post('/:id/approve', async (req: Request, res: Response) => {
  try {
    const { data: item, error } = await supabase
      .from('content_queue')
      .update({ status: 'approved' })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !item) {
      return res.status(404).json({ error: 'Queue item not found' });
    }

    // TODO: Trigger posting job via BullMQ

    logger.info('Content approved for posting', {
      userId: req.user.id,
      itemId: item.id,
      platforms: item.platforms
    });

    res.json({ 
      success: true, 
      message: 'Content approved and queued for posting',
      item 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/queue/stats - Get queue statistics
router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const { data: stats, error } = await supabase
      .rpc('get_queue_stats', { p_user_id: req.user.id });

    if (error) {
      // Fallback to manual aggregation
      const { data: items, error: itemsError } = await supabase
        .from('content_queue')
        .select('status')
        .eq('user_id', req.user.id);

      if (itemsError) {
        return res.status(500).json({ error: 'Failed to fetch stats' });
      }

      const statusCounts = items?.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return res.json({
        stats: statusCounts,
        total: items?.length || 0
      });
    }

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as queueRouter };
