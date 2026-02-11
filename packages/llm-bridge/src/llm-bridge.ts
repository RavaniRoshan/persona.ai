import { LLMConfig, LLMResponse, validateProviderConfig, getDefaultModel } from './types';
import { BaseProvider, OpenAIProvider, AnthropicProvider, OllamaProvider } from './providers';
import { Logger, defaultLogger } from '@personamirror/shared-utils';

export class LLMBridge {
  private provider: BaseProvider;
  private logger: Logger;

  constructor(config: LLMConfig, logger: Logger = defaultLogger) {
    const validation = validateProviderConfig(config);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    this.logger = logger;

    // Set default model if not provided
    if (!config.model) {
      config.model = getDefaultModel(config.provider);
    }

    // Initialize appropriate provider
    switch (config.provider) {
      case 'openai':
        this.provider = new OpenAIProvider(config, logger);
        break;
      case 'anthropic':
        this.provider = new AnthropicProvider(config, logger);
        break;
      case 'ollama':
      case 'local':
        this.provider = new OllamaProvider(config, logger);
        break;
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }

    this.logger.info('LLM Bridge initialized', {
      provider: config.provider,
      model: config.model
    });
  }

  async extractPersona(posts: string[]): Promise<LLMResponse<any>> {
    this.logger.info('Starting persona extraction', {
      postsCount: posts.length
    });

    try {
      const result = await this.provider.extractPersona(posts);
      
      if (result.success) {
        this.logger.info('Persona extraction completed successfully', {
          confidence: result.data?.extractionConfidence,
          cost: result.usage?.cost
        });
      } else {
        this.logger.error('Persona extraction failed', new Error(result.error || 'Unknown error'));
      }

      return result;
    } catch (error) {
      this.logger.error('Unexpected error during persona extraction', error as Error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async generateContent(request: {
    topic: string;
    persona: any;
    platform: string;
    tone?: string;
    length?: string;
    includeHashtags?: boolean;
  }): Promise<LLMResponse<any>> {
    this.logger.info('Starting content generation', {
      topic: request.topic,
      platform: request.platform
    });

    try {
      const result = await this.provider.generateContent(request);
      
      if (result.success) {
        this.logger.info('Content generation completed successfully', {
          contentLength: result.data?.content?.length,
          cost: result.usage?.cost
        });
      } else {
        this.logger.error('Content generation failed', new Error(result.error || 'Unknown error'));
      }

      return result;
    } catch (error) {
      this.logger.error('Unexpected error during content generation', error as Error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async validateConnection(): Promise<boolean> {
    return this.provider.validateConnection();
  }

  static getAvailableProviders(): Array<{ id: string; name: string; models: string[] }> {
    return [
      {
        id: 'openai',
        name: 'OpenAI',
        models: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo']
      },
      {
        id: 'anthropic',
        name: 'Anthropic',
        models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307']
      },
      {
        id: 'ollama',
        name: 'Ollama (Local)',
        models: ['llama2', 'mistral', 'mixtral']
      }
    ];
  }

  static getProviderModels(provider: string): string[] {
    const providers = LLMBridge.getAvailableProviders();
    return providers.find(p => p.id === provider)?.models || [];
  }
}
