import { Router } from 'express';
import { supabase, logger } from '../index';
import { LLMBridge } from '@personamirror/llm-bridge';
import { z } from 'zod';

const router = Router();

// Validation schema
const extractPersonaSchema = z.object({
  posts: z.array(z.string().min(10)).min(5).max(50),
  llmConfig: z.object({
    provider: z.enum(['openai', 'anthropic', 'ollama']),
    apiKey: z.string(),
    model: z.string()
  })
});

// POST /api/personas/extract - Extract persona from posts
router.post('/extract', async (req, res) => {
  try {
    const validation = extractPersonaSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const { posts, llmConfig } = validation.data;
    const userId = req.user.id;

    logger.info('Starting persona extraction', {
      userId,
      postsCount: posts.length,
      provider: llmConfig.provider
    });

    // Initialize LLM Bridge
    const bridge = new LLMBridge(llmConfig);

    // Extract persona
    const result = await bridge.extractPersona(posts);

    if (!result.success) {
      logger.error('Persona extraction failed', new Error(result.error || 'Unknown error'), {
        userId,
        provider: llmConfig.provider
      });
      return res.status(500).json({
        error: 'Extraction failed',
        message: result.error
      });
    }

    // Store persona in database
    const { data: persona, error } = await supabase
      .from('personas')
      .insert({
        user_id: userId,
        name: result.data.name || 'Unnamed Persona',
        description: result.data.description,
        tone_rules: result.data.toneRules,
        extracted_from_posts: posts.length,
        extraction_confidence: result.data.extractionConfidence || 80
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to store persona', error, { userId });
      return res.status(500).json({
        error: 'Failed to store persona',
        message: error.message
      });
    }

    // Log usage
    if (result.usage) {
      await supabase.from('llm_usage').insert({
        user_id: userId,
        provider: llmConfig.provider,
        model: llmConfig.model,
        tokens_input: result.usage.inputTokens,
        tokens_output: result.usage.outputTokens,
        cost_usd: result.usage.cost
      });
    }

    logger.info('Persona extraction completed', {
      userId,
      personaId: persona.id,
      confidence: result.data.extractionConfidence
    });

    res.status(201).json({
      success: true,
      persona,
      usage: result.usage,
      metadata: result.metadata
    });

  } catch (error) {
    logger.error('Unexpected error in persona extraction', error as Error, {
      userId: req.user.id
    });
    res.status(500).json({
      error: 'Internal server error',
      message: (error as Error).message
    });
  }
});

// GET /api/personas - List user's personas
router.get('/', async (req, res) => {
  try {
    const { data: personas, error } = await supabase
      .from('personas')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('is_active', true)
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch personas', error, { userId: req.user.id });
      return res.status(500).json({ error: 'Failed to fetch personas' });
    }

    res.json({ personas });
  } catch (error) {
    logger.error('Error fetching personas', error as Error, { userId: req.user.id });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/personas/:id - Get specific persona
router.get('/:id', async (req, res) => {
  try {
    const { data: persona, error } = await supabase
      .from('personas')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !persona) {
      return res.status(404).json({ error: 'Persona not found' });
    }

    res.json({ persona });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/personas/:id - Archive persona
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .rpc('archive_persona', {
        p_persona_id: parseInt(req.params.id),
        p_user_id: req.user.id
      });

    if (error) {
      logger.error('Failed to archive persona', error, {
        userId: req.user.id,
        personaId: req.params.id
      });
      return res.status(500).json({ error: 'Failed to archive persona' });
    }

    res.json({ success: true, message: 'Persona archived' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as personaRouter };
