import { z } from 'zod';

// Tone and style rules
export const ToneRulesSchema = z.object({
  style: z.array(z.string()).default([]),
  topics: z.array(z.string()).default([]),
  avoid: z.array(z.string()).default([]),
  phrases: z.array(z.string()).default([]),
  examples: z.array(z.string()).default([]),
  toneDescriptors: z.array(z.string()).default([]),
  sentenceStructure: z.enum(['short', 'medium', 'long', 'mixed']).optional(),
  vocabulary: z.enum(['simple', 'moderate', 'advanced']).optional()
});

export type ToneRules = z.infer<typeof ToneRulesSchema>;

// Persona schema
export const PersonaSchema = z.object({
  id: z.number().optional(),
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  toneRules: ToneRulesSchema,
  extractedFromPosts: z.number().default(0),
  extractionConfidence: z.number().min(0).max(100).default(0),
  isActive: z.boolean().default(true),
  isArchived: z.boolean().default(false),
  version: z.number().default(1),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export type Persona = z.infer<typeof PersonaSchema>;

// Persona extraction result
export const PersonaExtractionResultSchema = z.object({
  persona: PersonaSchema,
  confidence: z.number().min(0).max(100),
  sampleMatches: z.array(z.object({
    originalPost: z.string(),
    explanation: z.string(),
    score: z.number().min(0).max(1)
  })),
  suggestedRules: z.array(z.object({
    rule: z.string(),
    examples: z.array(z.string())
  }))
});

export type PersonaExtractionResult = z.infer<typeof PersonaExtractionResultSchema>;

// Content generation options
export const ContentGenerationOptionsSchema = z.object({
  persona: PersonaSchema,
  topic: z.string().min(1),
  platforms: z.array(z.enum(['linkedin', 'twitter', 'instagram'])),
  tone: z.enum(['professional', 'casual', 'technical', 'inspiring']).optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
  includeHashtags: z.boolean().optional(),
  includeMentions: z.boolean().optional(),
  targetAudience: z.string().optional(),
  callToAction: z.string().optional()
});

export type ContentGenerationOptions = z.infer<typeof ContentGenerationOptionsSchema>;

// Generated content
export const GeneratedContentSchema = z.object({
  content: z.string(),
  confidence: z.number().min(0).max(100),
  platformVariants: z.record(z.enum(['linkedin', 'twitter', 'instagram']), z.string()),
  suggestedImages: z.array(z.object({
    url: z.string().optional(),
    caption: z.string(),
    altText: z.string().optional()
  })),
  hashtags: z.array(z.string()),
  mentions: z.array(z.string()),
  engagementPrediction: z.object({
    likes: z.number(),
    comments: z.number(),
    shares: z.number(),
    confidence: z.number().min(0).max(1)
  }).optional(),
  metadata: z.object({
    wordCount: z.number(),
    characterCount: z.number(),
    readingTime: z.number(),
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    keywords: z.array(z.string())
  })
});

export type GeneratedContent = z.infer<typeof GeneratedContentSchema>;

// Content queue item
export const ContentQueueItemSchema = z.object({
  id: z.number().optional(),
  jobId: z.string().uuid().optional(),
  userId: z.string().uuid(),
  personaId: z.number(),
  contentType: z.enum(['post', 'comment', 'reply']),
  platforms: z.array(z.enum(['linkedin', 'twitter', 'instagram'])),
  draft: z.string(),
  draftMetadata: z.object({
    wordCount: z.number(),
    characterCount: z.number(),
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    keywords: z.array(z.string()),
    readabilityScore: z.number().min(0).max(100)
  }).default({
    wordCount: 0,
    characterCount: 0,
    sentiment: 'neutral',
    keywords: [],
    readabilityScore: 0
  }),
  status: z.enum(['draft', 'review', 'approved', 'scheduled', 'posted', 'failed', 'rejected']).default('draft'),
  priority: z.number().min(1).max(10).default(5),
  scheduledFor: z.date().optional(),
  postedAt: z.date().optional(),
  platformPostIds: z.record(z.string()).default({}),
  engagement: z.object({
    likes: z.number(),
    replies: z.number(),
    shares: z.number(),
    impressions: z.number()
  }).default({
    likes: 0,
    replies: 0,
    shares: 0,
    impressions: 0
  }),
  retryCount: z.number().default(0),
  errorMessage: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export type ContentQueueItem = z.infer<typeof ContentQueueItemSchema>;

// Platform-specific constraints
export const PlatformConstraintsSchema = z.object({
  linkedin: z.object({
    maxCharacters: z.number().default(3000),
    maxHashtags: z.number().default(5),
    supportsImages: z.boolean().default(true),
    supportsVideo: z.boolean().default(true),
    supportsMentions: z.boolean().default(true)
  }),
  twitter: z.object({
    maxCharacters: z.number().default(280),
    maxHashtags: z.number().default(3),
    supportsImages: z.boolean().default(true),
    supportsVideo: z.boolean().default(true),
    supportsMentions: z.boolean().default(true),
    supportsThreads: z.boolean().default(true)
  }),
  instagram: z.object({
    maxCharacters: z.number().default(2200),
    maxHashtags: z.number().default(30),
    supportsImages: z.boolean().default(true),
    supportsVideo: z.boolean().default(true),
    supportsMentions: z.boolean().default(true),
    requiresImage: z.boolean().default(true)
  })
});

export type PlatformConstraints = z.infer<typeof PlatformConstraintsSchema>;

// Export constraints
export const platformConstraints: PlatformConstraints = {
  linkedin: {
    maxCharacters: 3000,
    maxHashtags: 5,
    supportsImages: true,
    supportsVideo: true,
    supportsMentions: true
  },
  twitter: {
    maxCharacters: 280,
    maxHashtags: 3,
    supportsImages: true,
    supportsVideo: true,
    supportsMentions: true,
    supportsThreads: true
  },
  instagram: {
    maxCharacters: 2200,
    maxHashtags: 30,
    supportsImages: true,
    supportsVideo: true,
    supportsMentions: true,
    requiresImage: true
  }
};

// Validation functions
export function validatePersona(data: unknown): Persona {
  return PersonaSchema.parse(data);
}

export function validateContentGenerationOptions(data: unknown): ContentGenerationOptions {
  return ContentGenerationOptionsSchema.parse(data);
}

export function validateContentQueueItem(data: unknown): ContentQueueItem {
  return ContentQueueItemSchema.parse(data);
}

// Safe parsers that don't throw
export function safeParsePersona(data: unknown): { success: boolean; data?: Persona; error?: string } {
  const result = PersonaSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.errors.map(e => e.message).join(', ') };
}

export function safeParseContentGenerationOptions(data: unknown): { success: boolean; data?: ContentGenerationOptions; error?: string } {
  const result = ContentGenerationOptionsSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.errors.map(e => e.message).join(', ') };
}

// Content validation helpers
export function validateContentForPlatform(content: string, platform: keyof PlatformConstraints): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const constraints = platformConstraints[platform];
  
  if (content.length > constraints.maxCharacters) {
    errors.push(`Content exceeds ${platform} limit of ${constraints.maxCharacters} characters`);
  }
  
  const hashtagCount = (content.match(/#/g) || []).length;
  if (hashtagCount > constraints.maxHashtags) {
    errors.push(`Too many hashtags. ${platform} allows max ${constraints.maxHashtags}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Re-export zod
export { z };
