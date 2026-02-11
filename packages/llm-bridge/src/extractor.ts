import { LLMBridge } from './llm-bridge';
import type { LLMConfig, LLMResponse } from './types';
import { Logger } from '@personamirror/shared-utils';

export interface PersonaExtractionInput {
  posts: string[];
  minPosts?: number;
  maxPosts?: number;
}

export interface ToneRules {
  style: string[];
  topics: string[];
  avoid: string[];
  phrases: string[];
  examples: string[];
  toneDescriptors: string[];
  sentenceStructure: 'short' | 'medium' | 'long' | 'mixed';
  vocabulary: 'simple' | 'moderate' | 'advanced';
}

export interface PersonaData {
  name: string;
  description: string;
  toneRules: ToneRules;
}

export interface SampleMatch {
  originalPost: string;
  explanation: string;
  score: number;
}

export interface SuggestedRule {
  rule: string;
  examples: string[];
}

export interface PersonaExtractionResult {
  persona: PersonaData;
  confidence: number;
  sampleMatches: SampleMatch[];
  suggestedRules: SuggestedRule[];
  metadata: {
    postsAnalyzed: number;
    averagePostLength: number;
    analysisTime: number;
  };
}

export class PersonaExtractor {
  private logger: Logger;

  constructor(logger: Logger = new Logger({ serviceName: 'persona-extractor' })) {
    this.logger = logger;
  }

  async extract(
    input: PersonaExtractionInput,
    llmConfig: LLMConfig
  ): Promise<LLMResponse<PersonaExtractionResult>> {
    const startTime = Date.now();
    
    try {
      // Validate input
      const validation = this.validateInput(input);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Limit posts to max
      const posts = input.posts.slice(0, input.maxPosts || 50);
      
      this.logger.info('Starting persona extraction', {
        postsCount: posts.length,
        provider: llmConfig.provider,
        model: llmConfig.model
      });

      // Initialize LLM Bridge
      const bridge = new LLMBridge(llmConfig, this.logger);

      // Extract persona using LLM
      const extractionResult = await bridge.extractPersona(posts);

      if (!extractionResult.success || !extractionResult.data) {
        this.logger.error('LLM extraction failed', new Error(extractionResult.error || 'Unknown error'));
        return {
          success: false,
          error: extractionResult.error || 'Failed to extract persona'
        };
      }

      // Calculate confidence score
      const confidence = this.calculateConfidence(extractionResult.data, posts);
      
      // Generate sample matches
      const sampleMatches = this.generateSampleMatches(posts, extractionResult.data);
      
      // Generate suggested rules
      const suggestedRules = this.generateSuggestedRules(extractionResult.data);

      const result: PersonaExtractionResult = {
        persona: {
          name: extractionResult.data.name || 'My Persona',
          description: extractionResult.data.description || '',
          toneRules: {
            style: extractionResult.data.toneRules?.style || [],
            topics: extractionResult.data.toneRules?.topics || [],
            avoid: extractionResult.data.toneRules?.avoid || [],
            phrases: extractionResult.data.toneRules?.phrases || [],
            examples: extractionResult.data.toneRules?.examples || [],
            toneDescriptors: extractionResult.data.toneRules?.toneDescriptors || [],
            sentenceStructure: extractionResult.data.toneRules?.sentenceStructure || 'mixed',
            vocabulary: extractionResult.data.toneRules?.vocabulary || 'moderate'
          }
        },
        confidence,
        sampleMatches,
        suggestedRules,
        metadata: {
          postsAnalyzed: posts.length,
          averagePostLength: Math.round(posts.reduce((sum, p) => sum + p.length, 0) / posts.length),
          analysisTime: Date.now() - startTime
        }
      };

      this.logger.info('Persona extraction completed', {
        confidence,
        postsAnalyzed: posts.length,
        analysisTime: Date.now() - startTime
      });

      return {
        success: true,
        data: result,
        usage: extractionResult.usage,
        metadata: extractionResult.metadata
      };

    } catch (error) {
      this.logger.error('Unexpected error in persona extraction', error as Error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private validateInput(input: PersonaExtractionInput): { valid: boolean; error?: string } {
    if (!input.posts || input.posts.length === 0) {
      return { valid: false, error: 'No posts provided' };
    }

    const minPosts = input.minPosts || 5;
    if (input.posts.length < minPosts) {
      return { valid: false, error: `Minimum ${minPosts} posts required for accurate extraction` };
    }

    // Check for empty or too short posts
    const validPosts = input.posts.filter(post => post && post.trim().length > 10);
    if (validPosts.length < minPosts) {
      return { valid: false, error: `At least ${minPosts} posts with meaningful content required` };
    }

    return { valid: true };
  }

  private calculateConfidence(data: any, posts: string[]): number {
    let score = 70; // Base score

    // More posts = higher confidence
    if (posts.length >= 20) score += 10;
    if (posts.length >= 50) score += 5;

    // Check if tone rules are comprehensive
    const toneRules = data.toneRules || {};
    if (toneRules.style?.length > 3) score += 5;
    if (toneRules.topics?.length > 3) score += 5;
    if (toneRules.examples?.length > 0) score += 5;

    // Check for specific descriptors
    if (toneRules.toneDescriptors?.length > 0) score += 5;

    // Check sentence structure and vocabulary are defined
    if (toneRules.sentenceStructure && toneRules.sentenceStructure !== 'mixed') score += 3;
    if (toneRules.vocabulary && toneRules.vocabulary !== 'moderate') score += 2;

    return Math.min(100, Math.max(0, score));
  }

  private generateSampleMatches(posts: string[], personaData: any): SampleMatch[] {
    const matches: SampleMatch[] = [];
    const examples = personaData.toneRules?.examples || [];
    
    // Match examples to original posts
    for (let i = 0; i < Math.min(3, posts.length, examples.length); i++) {
      const post = posts[i];
      const example = examples[i] || posts[Math.floor(Math.random() * posts.length)];
      
      matches.push({
        originalPost: post.substring(0, 200) + (post.length > 200 ? '...' : ''),
        explanation: this.generateExplanation(post, personaData),
        score: Math.random() * 0.3 + 0.7 // Simulated match score 0.7-1.0
      });
    }

    return matches;
  }

  private generateExplanation(post: string, personaData: any): string {
    const toneDescriptors = personaData.toneRules?.toneDescriptors || [];
    const style = personaData.toneRules?.style || [];
    
    const descriptors = [...toneDescriptors, ...style].slice(0, 3);
    
    if (descriptors.length > 0) {
      return `Demonstrates ${descriptors.join(', ')} characteristics typical of this persona`;
    }
    
    return 'Shows consistent voice patterns with the extracted persona';
  }

  private generateSuggestedRules(personaData: any): SuggestedRule[] {
    const rules: SuggestedRule[] = [];
    const topics = personaData.toneRules?.topics || [];
    const style = personaData.toneRules?.style || [];
    
    // Suggest topic-based rules
    if (topics.length > 0) {
      rules.push({
        rule: `Focus on ${topics.slice(0, 3).join(', ')} topics`,
        examples: [`Create content about ${topics[0]}`, `Discuss ${topics[1] || topics[0]} insights`]
      });
    }

    // Suggest style-based rules
    if (style.length > 0) {
      rules.push({
        rule: `Maintain ${style.slice(0, 2).join(' and ')} tone`,
        examples: [`Write with ${style[0]} voice`, `Keep the ${style[1] || style[0]} style consistent`]
      });
    }

    // Suggest vocabulary rule
    const vocab = personaData.toneRules?.vocabulary;
    if (vocab) {
      rules.push({
        rule: `Use ${vocab} vocabulary level`,
        examples: [
          vocab === 'simple' ? 'Keep language accessible' : 
          vocab === 'advanced' ? 'Use sophisticated terminology' : 
          'Balance technical and simple terms'
        ]
      });
    }

    return rules;
  }

  async validatePersona(
    persona: PersonaData,
    llmConfig: LLMConfig
  ): Promise<{ valid: boolean; feedback?: string[] }> {
    const feedback: string[] = [];
    let valid = true;

    // Check required fields
    if (!persona.name || persona.name.trim().length === 0) {
      feedback.push('Persona name is required');
      valid = false;
    }

    // Check tone rules
    const rules = persona.toneRules;
    if (!rules.style || rules.style.length === 0) {
      feedback.push('Add at least one style descriptor');
    }

    if (!rules.topics || rules.topics.length === 0) {
      feedback.push('Add at least one topic area');
    }

    if (!rules.examples || rules.examples.length === 0) {
      feedback.push('Add example sentences for better content generation');
    }

    // Test content generation with this persona
    try {
      const bridge = new LLMBridge(llmConfig, this.logger);
      const testResult = await bridge.generateContent({
        topic: 'introduction',
        persona,
        platform: 'linkedin',
        tone: 'professional'
      });

      if (!testResult.success) {
        feedback.push('Warning: Test content generation failed with this persona');
      }
    } catch {
      // Non-blocking validation
    }

    return { valid, feedback };
  }
}

export default PersonaExtractor;
