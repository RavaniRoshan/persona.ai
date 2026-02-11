export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'ollama' | 'local';
  apiKey: string;
  model: string;
  baseUrl?: string;
  maxRetries?: number;
  timeout?: number;
  costTracking?: boolean;
}

export interface LLMUsage {
  tokens: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  requestId: string;
}

export interface LLMMetadata {
  provider: string;
  model: string;
  responseTime: number;
  timestamp: string;
}

export interface LLMResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  usage?: LLMUsage;
  metadata?: LLMMetadata;
}

export interface ExtractionRequest {
  posts: string[];
  minPosts?: number;
  maxPosts?: number;
}

export interface GenerationRequest {
  topic: string;
  persona: any;
  platform: string;
  tone?: string;
  length?: string;
  includeHashtags?: boolean;
}

// Provider-specific configurations
export const PROVIDER_CONFIGS = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4-turbo-preview',
    models: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo'],
    costPer1kTokens: {
      'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
    }
  },
  anthropic: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-opus-20240229',
    models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    costPer1kTokens: {
      'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
      'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
      'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 }
    }
  },
  ollama: {
    name: 'Ollama (Local)',
    baseUrl: 'http://localhost:11434',
    defaultModel: 'llama2',
    models: ['llama2', 'mistral', 'mixtral'],
    costPer1kTokens: {} // Free
  },
  local: {
    name: 'Local API',
    baseUrl: 'http://localhost:8080',
    defaultModel: 'default',
    models: ['default'],
    costPer1kTokens: {}
  }
};

export function calculateCost(provider: string, model: string, inputTokens: number, outputTokens: number): number {
  const config = PROVIDER_CONFIGS[provider as keyof typeof PROVIDER_CONFIGS];
  if (!config) {
    return 0;
  }
  
  const modelPricing = config.costPer1kTokens[model as keyof typeof config.costPer1kTokens];
  if (!modelPricing || typeof modelPricing !== 'object') {
    return 0;
  }
  
  const pricing = modelPricing as { input: number; output: number };
  return ((inputTokens / 1000) * pricing.input) + ((outputTokens / 1000) * pricing.output);
}

export function getDefaultModel(provider: string): string {
  return PROVIDER_CONFIGS[provider as keyof typeof PROVIDER_CONFIGS]?.defaultModel || 'gpt-4-turbo-preview';
}

export function validateProviderConfig(config: LLMConfig): { valid: boolean; error?: string } {
  if (!config.provider || !PROVIDER_CONFIGS[config.provider as keyof typeof PROVIDER_CONFIGS]) {
    return { valid: false, error: `Invalid provider: ${config.provider}` };
  }
  
  if (!config.apiKey && config.provider !== 'ollama' && config.provider !== 'local') {
    return { valid: false, error: 'API key is required for cloud providers' };
  }
  
  if (!config.model) {
    return { valid: false, error: 'Model is required' };
  }
  
  const providerConfig = PROVIDER_CONFIGS[config.provider as keyof typeof PROVIDER_CONFIGS];
  if (providerConfig && !providerConfig.models.includes(config.model) && config.provider !== 'ollama' && config.provider !== 'local') {
    return { valid: false, error: `Invalid model ${config.model} for provider ${config.provider}` };
  }
  
  return { valid: true };
}
