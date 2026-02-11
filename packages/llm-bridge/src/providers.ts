import { LLMConfig, LLMResponse, LLMUsage, LLMMetadata, calculateCost } from './types';
import { Logger } from '@personamirror/shared-utils';
import OpenAI from 'openai';
import axios from 'axios';

export abstract class BaseProvider {
  protected config: LLMConfig;
  protected logger: Logger;
  protected maxRetries: number;
  protected timeout: number;

  constructor(config: LLMConfig, logger: Logger) {
    this.config = {
      maxRetries: 3,
      timeout: 30000,
      costTracking: true,
      ...config
    };
    this.logger = logger;
    this.maxRetries = this.config.maxRetries!;
    this.timeout = this.config.timeout!;
  }

  protected async withRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === this.maxRetries) {
          this.logger.error(`${operationName} failed after ${this.maxRetries} attempts`, lastError, {
            provider: this.config.provider,
            model: this.config.model,
            attempt
          });
          throw lastError;
        }
        
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        this.logger.warn(`${operationName} attempt ${attempt} failed, retrying in ${delay}ms`, {
          error: lastError.message,
          provider: this.config.provider
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  protected createResponse<T>(
    success: boolean,
    data?: T,
    error?: string,
    usage?: { inputTokens: number; outputTokens: number },
    responseTime: number = 0
  ): LLMResponse<T> {
    const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    
    return {
      success,
      data,
      error,
      usage: usage && this.config.costTracking ? {
        tokens: usage.inputTokens + usage.outputTokens,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        cost: calculateCost(this.config.provider, this.config.model, usage.inputTokens, usage.outputTokens),
        requestId
      } : undefined,
      metadata: {
        provider: this.config.provider,
        model: this.config.model,
        responseTime,
        timestamp: new Date().toISOString()
      }
    };
  }

  abstract extractPersona(posts: string[]): Promise<LLMResponse<any>>;
  abstract generateContent(request: any): Promise<LLMResponse<any>>;
  abstract validateConnection(): Promise<boolean>;
}

// OpenAI Provider Implementation
export class OpenAIProvider extends BaseProvider {
  private client: OpenAI;

  constructor(config: LLMConfig, logger: Logger) {
    super(config, logger);
    this.client = new OpenAI({
      apiKey: config.apiKey,
      timeout: this.timeout
    });
  }

  async extractPersona(posts: string[]): Promise<LLMResponse<any>> {
    const startTime = Date.now();
    
    return this.withRetry(async () => {
      const prompt = this.buildPersonaExtractionPrompt(posts);
      
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing writing style and extracting persona characteristics.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const responseTime = Date.now() - startTime;
      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      const persona = JSON.parse(content);
      
      this.logger.info('Persona extracted successfully', {
        provider: this.config.provider,
        model: this.config.model,
        postsAnalyzed: posts.length,
        responseTime
      });

      return this.createResponse(
        true,
        persona,
        undefined,
        {
          inputTokens: response.usage?.prompt_tokens || 0,
          outputTokens: response.usage?.completion_tokens || 0
        },
        responseTime
      );
    }, 'OpenAI Persona Extraction');
  }

  async generateContent(request: any): Promise<LLMResponse<any>> {
    const startTime = Date.now();
    
    return this.withRetry(async () => {
      const prompt = this.buildContentGenerationPrompt(request);
      
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert content creator who maintains consistent persona and voice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      });

      const responseTime = Date.now() - startTime;
      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      this.logger.info('Content generated successfully', {
        provider: this.config.provider,
        model: this.config.model,
        responseTime
      });

      return this.createResponse(
        true,
        { content },
        undefined,
        {
          inputTokens: response.usage?.prompt_tokens || 0,
          outputTokens: response.usage?.completion_tokens || 0
        },
        responseTime
      );
    }, 'OpenAI Content Generation');
  }

  async validateConnection(): Promise<boolean> {
    try {
      await this.client.models.list();
      return true;
    } catch {
      return false;
    }
  }

  private buildPersonaExtractionPrompt(posts: string[]): string {
    return `Analyze the following social media posts and extract a detailed persona profile.

Posts:
${posts.map((post, i) => `${i + 1}. ${post}`).join('\n\n')}

Extract and return a JSON object with this structure:
{
  "name": "string - suggest a persona name",
  "description": "string - brief description of the persona",
  "toneRules": {
    "style": ["array of style descriptors"],
    "topics": ["array of common topics"],
    "avoid": ["array of things to avoid"],
    "phrases": ["array of common phrases"],
    "examples": ["array of representative sentences"],
    "toneDescriptors": ["array of tone adjectives"],
    "sentenceStructure": "short/medium/long/mixed",
    "vocabulary": "simple/moderate/advanced"
  },
  "extractionConfidence": "number 0-100"
}

Be thorough in your analysis. Identify patterns in vocabulary, sentence structure, tone, and content themes.`;
  }

  private buildContentGenerationPrompt(request: any): string {
    return `Generate social media content matching this persona:

Topic: ${request.topic}
Platform: ${request.platform}
${request.tone ? `Tone: ${request.tone}` : ''}
${request.length ? `Length: ${request.length}` : ''}
${request.includeHashtags ? 'Include relevant hashtags' : ''}

Persona Rules:
${JSON.stringify(request.persona?.toneRules, null, 2)}

Generate content that matches this persona's voice, style, and typical topics. Return only the content text.`;
  }
}

// Anthropic Provider Implementation
export class AnthropicProvider extends BaseProvider {
  private baseUrl: string = 'https://api.anthropic.com/v1';

  async extractPersona(posts: string[]): Promise<LLMResponse<any>> {
    const startTime = Date.now();
    
    return this.withRetry(async () => {
      const prompt = this.buildPersonaExtractionPrompt(posts);
      
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          model: this.config.model,
          max_tokens: 4096,
          temperature: 0.3,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'x-api-key': this.config.apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          timeout: this.timeout
        }
      );

      const responseTime = Date.now() - startTime;
      const content = response.data.content?.[0]?.text;
      
      if (!content) {
        throw new Error('Empty response from Anthropic');
      }

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const persona = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);

      this.logger.info('Persona extracted successfully', {
        provider: this.config.provider,
        model: this.config.model,
        postsAnalyzed: posts.length,
        responseTime
      });

      return this.createResponse(
        true,
        persona,
        undefined,
        {
          inputTokens: response.data.usage?.input_tokens || 0,
          outputTokens: response.data.usage?.output_tokens || 0
        },
        responseTime
      );
    }, 'Anthropic Persona Extraction');
  }

  async generateContent(request: any): Promise<LLMResponse<any>> {
    const startTime = Date.now();
    
    return this.withRetry(async () => {
      const prompt = this.buildContentGenerationPrompt(request);
      
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          model: this.config.model,
          max_tokens: 4096,
          temperature: 0.7,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'x-api-key': this.config.apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          timeout: this.timeout
        }
      );

      const responseTime = Date.now() - startTime;
      const content = response.data.content?.[0]?.text;
      
      if (!content) {
        throw new Error('Empty response from Anthropic');
      }

      this.logger.info('Content generated successfully', {
        provider: this.config.provider,
        model: this.config.model,
        responseTime
      });

      return this.createResponse(
        true,
        { content },
        undefined,
        {
          inputTokens: response.data.usage?.input_tokens || 0,
          outputTokens: response.data.usage?.output_tokens || 0
        },
        responseTime
      );
    }, 'Anthropic Content Generation');
  }

  async validateConnection(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/models`, {
        headers: { 'x-api-key': this.config.apiKey }
      });
      return true;
    } catch {
      return false;
    }
  }

  private buildPersonaExtractionPrompt(posts: string[]): string {
    return `You are an expert at analyzing writing style. Analyze these posts and extract a detailed persona profile.

Posts to analyze:
${posts.map((post, i) => `${i + 1}. ${post}`).join('\n\n')}

Return ONLY a JSON object with this exact structure:
{
  "name": "suggested persona name",
  "description": "brief description",
  "toneRules": {
    "style": ["style descriptors"],
    "topics": ["common topics"],
    "avoid": ["things to avoid"],
    "phrases": ["common phrases"],
    "examples": ["representative sentences"],
    "toneDescriptors": ["tone adjectives"],
    "sentenceStructure": "short/medium/long/mixed",
    "vocabulary": "simple/moderate/advanced"
  },
  "extractionConfidence": 85
}`;
  }

  private buildContentGenerationPrompt(request: any): string {
    return `Generate social media content matching this exact persona voice:

Topic: ${request.topic}
Platform: ${request.platform}
${request.tone ? `Tone: ${request.tone}` : ''}
${request.length ? `Length: ${request.length}` : ''}

Persona Rules (MUST follow):
${JSON.stringify(request.persona?.toneRules, null, 2)}

Create content that sounds EXACTLY like this persona. Return only the content text, no explanations.`;
  }
}

// Ollama/Local Provider Implementation
export class OllamaProvider extends BaseProvider {
  private baseUrl: string;

  constructor(config: LLMConfig, logger: Logger) {
    super(config, logger);
    this.baseUrl = config.baseUrl || 'http://localhost:11434';
  }

  async extractPersona(posts: string[]): Promise<LLMResponse<any>> {
    const startTime = Date.now();
    
    return this.withRetry(async () => {
      const prompt = this.buildPersonaExtractionPrompt(posts);
      
      const response = await axios.post(
        `${this.baseUrl}/api/generate`,
        {
          model: this.config.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.3
          }
        },
        {
          timeout: this.timeout * 2 // Local models can be slower
        }
      );

      const responseTime = Date.now() - startTime;
      const content = response.data.response;
      
      if (!content) {
        throw new Error('Empty response from Ollama');
      }

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const persona = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);

      this.logger.info('Persona extracted using local model', {
        provider: this.config.provider,
        model: this.config.model,
        postsAnalyzed: posts.length,
        responseTime
      });

      return this.createResponse(
        true,
        persona,
        undefined,
        { inputTokens: 0, outputTokens: 0 }, // Local models don't report tokens
        responseTime
      );
    }, 'Ollama Persona Extraction');
  }

  async generateContent(request: any): Promise<LLMResponse<any>> {
    const startTime = Date.now();
    
    return this.withRetry(async () => {
      const prompt = this.buildContentGenerationPrompt(request);
      
      const response = await axios.post(
        `${this.baseUrl}/api/generate`,
        {
          model: this.config.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7
          }
        },
        {
          timeout: this.timeout * 2
        }
      );

      const responseTime = Date.now() - startTime;
      const content = response.data.response;
      
      if (!content) {
        throw new Error('Empty response from Ollama');
      }

      this.logger.info('Content generated using local model', {
        provider: this.config.provider,
        model: this.config.model,
        responseTime
      });

      return this.createResponse(
        true,
        { content },
        undefined,
        { inputTokens: 0, outputTokens: 0 },
        responseTime
      );
    }, 'Ollama Content Generation');
  }

  async validateConnection(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/api/tags`);
      return true;
    } catch {
      return false;
    }
  }

  private buildPersonaExtractionPrompt(posts: string[]): string {
    return `Analyze these posts and create a persona profile:

${posts.join('\n\n')}

Return JSON:
{
  "name": "persona name",
  "description": "description",
  "toneRules": {
    "style": [],
    "topics": [],
    "avoid": [],
    "phrases": [],
    "examples": [],
    "toneDescriptors": [],
    "sentenceStructure": "mixed",
    "vocabulary": "moderate"
  },
  "extractionConfidence": 80
}`;
  }

  private buildContentGenerationPrompt(request: any): string {
    return `Create content:
Topic: ${request.topic}
Platform: ${request.platform}

Follow persona:
${JSON.stringify(request.persona?.toneRules)}

Return only the content.`;
  }
}
