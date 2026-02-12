import { Router, Request, Response } from 'express';
import { supabase, logger } from '../index';
import { LLMBridge } from '@personamirror/llm-bridge';
import { z } from 'zod';

const router: Router = Router();

// Validation schema
const generateContentSchema = z.object({
  topic: z.string().min(5).max(500),
  personaId: z.number(),
  platforms: z.array(z.enum(['linkedin', 'twitter', 'instagram'])),
  tone: z.enum(['professional', 'casual', 'technical', 'inspiring']).optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
  includeHashtags: z.boolean().optional(),
  llmConfig: z.object({
    provider: z.enum(['openai', 'anthropic', 'ollama']),
    apiKey: z.string(),
    model: z.string()
  })
});

// POST /api/content/generate - Generate content
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const validation = generateContentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const { topic, personaId, platforms, tone, length, includeHashtags, llmConfig } = validation.data;
    const userId = req.user.id;

    logger.info('Starting content generation', {
      userId,
      topic,
      platforms,
      provider: llmConfig.provider
    });

    // Fetch persona
    const { data: persona, error: personaError } = await supabase
      .from('personas')
      .select('*')
      .eq('id', personaId)
      .eq('user_id', userId)
      .single();

    if (personaError || !persona) {
      return res.status(404).json({ error: 'Persona not found' });
    }

    // Initialize LLM Bridge
    const bridge = new LLMBridge(llmConfig);

    // Generate content for each platform
    const generatedContent = [];
    
    for (const platform of platforms) {
      const result = await bridge.generateContent({
        topic,
        persona,
        platform,
        tone,
        length,
        includeHashtags
      });

      if (result.success && result.data) {
        generatedContent.push({
          platform,
          content: result.data.content,
          usage: result.usage,
          metadata: result.metadata
        });
      }
    }

    // Store in content queue
    const { data: queueItem, error: queueError } = await supabase
      .from('content_queue')
      .insert({
        user_id: userId,
        persona_id: personaId,
        content_type: 'post',
        platforms,
        draft: generatedContent[0]?.content || '',
        status: 'draft'
      })
      .select()
      .single();

    if (queueError) {
      logger.error('Failed to store content in queue', queueError, { userId });
    }

    // Log usage
    for (const content of generatedContent) {
      if (content.usage) {
        await supabase.from('llm_usage').insert({
          user_id: userId,
          provider: llmConfig.provider,
          model: llmConfig.model,
          tokens_input: content.usage.inputTokens,
          tokens_output: content.usage.outputTokens,
          cost_usd: content.usage.cost
        });
      }
    }

    logger.info('Content generation completed', {
      userId,
      platforms: platforms.length,
      queueItemId: queueItem?.id
    });

    res.status(201).json({
      success: true,
      content: generatedContent,
      queueItem,
      totalCost: generatedContent.reduce((sum, c) => sum + (c.usage?.cost || 0), 0)
    });

  } catch (error) {
    logger.error('Unexpected error in content generation', error as Error, {
      userId: req.user.id
    });
    res.status(500).json({
      error: 'Internal server error',
      message: (error as Error).message
    });
  }
});

// POST /api/content/validate - Validate content for platform
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { content, platform } = req.body;
    
    const constraints = {
      linkedin: { maxChars: 3000, maxHashtags: 5 },
      twitter: { maxChars: 280, maxHashtags: 3 },
      instagram: { maxChars: 2200, maxHashtags: 30 }
    };

    const errors = [];
    const platformConstraints = constraints[platform as keyof typeof constraints];

    if (content.length > platformConstraints.maxChars) {
      errors.push(`Content exceeds ${platform} limit of ${platformConstraints.maxChars} characters`);
    }

    const hashtagCount = (content.match(/#/g) || []).length;
    if (hashtagCount > platformConstraints.maxHashtags) {
      errors.push(`Too many hashtags. ${platform} allows max ${platformConstraints.maxHashtags}`);
    }

    res.json({
      valid: errors.length === 0,
      errors,
      platform,
      characterCount: content.length,
      hashtagCount
    });

  } catch (error) {
    res.status(500).json({ error: 'Validation failed' });
  }
});

export { router as contentRouter };
