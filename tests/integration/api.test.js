const { personaApi, contentApi, queueApi, userApi, ApiError } = require('../../apps/web/src/lib/services/api.js');

// Mock localStorage for authentication
const mockLocalStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  }
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// Mock fetch
global.fetch = jest.fn();

describe('API Integration Tests', () => {
  beforeAll(() => {
    // Set up test token
    mockLocalStorage.setItem('auth_token', 'test-token');
  });

  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Persona API', () => {
    test('should extract persona successfully', async () => {
      const mockResponse = {
        success: true,
        persona: {
          id: 1,
          name: 'Test Persona',
          description: 'A test persona',
          tone_rules: {
            style: ['professional'],
            topics: ['AI']
          },
          extraction_confidence: 85
        },
        metadata: {
          sampleMatches: [],
          suggestedRules: []
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const posts = ['Post 1', 'Post 2', 'Post 3', 'Post 4', 'Post 5'];
      const llmConfig = {
        provider: 'openai',
        apiKey: 'test-key',
        model: 'gpt-4'
      };

      const result = await personaApi.extract(posts, llmConfig);

      expect(result.success).toBe(true);
      expect(result.persona).toBeDefined();
      expect(result.persona.name).toBe('Test Persona');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/personas/extract'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          }),
          body: expect.any(String)
        })
      );
    });

    test('should handle extraction validation errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'At least 5 posts required' })
      });

      const posts = ['Post 1'];
      const llmConfig = { provider: 'openai', apiKey: 'test', model: 'gpt-4' };

      await expect(personaApi.extract(posts, llmConfig)).rejects.toThrow(ApiError);
    });

    test('should list personas successfully', async () => {
      const mockResponse = {
        personas: [
          { id: 1, name: 'Persona 1' },
          { id: 2, name: 'Persona 2' }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await personaApi.list();

      expect(result.personas).toHaveLength(2);
      expect(result.personas[0].name).toBe('Persona 1');
    });

    test('should get specific persona', async () => {
      const mockResponse = {
        persona: {
          id: 1,
          name: 'Test Persona',
          description: 'Test description'
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await personaApi.get(1);

      expect(result.persona.id).toBe(1);
      expect(result.persona.name).toBe('Test Persona');
    });

    test('should delete persona', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Persona archived' })
      });

      const result = await personaApi.delete(1);

      expect(result.success).toBe(true);
    });
  });

  describe('Content API', () => {
    test('should generate content successfully', async () => {
      const mockResponse = {
        success: true,
        content: [
          {
            platform: 'linkedin',
            content: 'Generated LinkedIn post about AI',
            usage: { inputTokens: 100, outputTokens: 50, cost: 0.002 }
          }
        ],
        queueItem: {
          id: 1,
          status: 'draft'
        },
        totalCost: 0.002
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await contentApi.generate({
        topic: 'AI trends',
        personaId: 1,
        platforms: ['linkedin'],
        tone: 'professional',
        length: 'medium',
        llmConfig: { provider: 'openai', apiKey: 'test', model: 'gpt-4' }
      });

      expect(result.success).toBe(true);
      expect(result.content).toHaveLength(1);
      expect(result.content[0].platform).toBe('linkedin');
    });

    test('should validate content for platform', async () => {
      const mockResponse = {
        valid: true,
        errors: [],
        platform: 'twitter',
        characterCount: 100,
        hashtagCount: 2
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await contentApi.validate('Test content #AI #tech', 'twitter');

      expect(result.valid).toBe(true);
      expect(result.characterCount).toBe(100);
    });

    test('should detect content validation errors', async () => {
      const mockResponse = {
        valid: false,
        errors: ['Content exceeds twitter limit of 280 characters'],
        platform: 'twitter',
        characterCount: 300,
        hashtagCount: 2
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await contentApi.validate('A'.repeat(300), 'twitter');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Queue API', () => {
    test('should list queue items', async () => {
      const mockResponse = {
        queue: [
          { id: 1, status: 'draft', draft: 'Test content', platforms: ['linkedin'] },
          { id: 2, status: 'approved', draft: 'Another post', platforms: ['twitter'] }
        ],
        count: 2
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await queueApi.list();

      expect(result.queue).toHaveLength(2);
      expect(result.count).toBe(2);
    });

    test('should filter queue by status', async () => {
      const mockResponse = {
        queue: [
          { id: 1, status: 'approved', draft: 'Approved post' }
        ],
        count: 1
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await queueApi.list('approved');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('?status=approved'),
        expect.any(Object)
      );
    });

    test('should get specific queue item', async () => {
      const mockResponse = {
        item: {
          id: 1,
          status: 'draft',
          draft: 'Test content',
          persona: { name: 'Test Persona' }
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await queueApi.get(1);

      expect(result.item.id).toBe(1);
    });

    test('should approve queue item', async () => {
      const mockResponse = {
        success: true,
        message: 'Content approved and queued for posting',
        item: { id: 1, status: 'approved' }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await queueApi.approve(1);

      expect(result.success).toBe(true);
      expect(result.item.status).toBe('approved');
    });

    test('should delete queue item', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Item deleted' })
      });

      const result = await queueApi.delete(1);

      expect(result.success).toBe(true);
    });

    test('should get queue stats', async () => {
      const mockResponse = {
        stats: {
          draft: 5,
          approved: 3,
          posted: 10
        },
        total: 18
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await queueApi.stats();

      expect(result.stats.draft).toBe(5);
      expect(result.stats.posted).toBe(10);
    });
  });

  describe('User API', () => {
    test('should get user profile', async () => {
      const mockResponse = {
        profile: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User'
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await userApi.getProfile();

      expect(result.profile.email).toBe('test@example.com');
    });

    test('should update user settings', async () => {
      const mockResponse = {
        settings: {
          defaultLlmProvider: 'openai',
          defaultModel: 'gpt-4'
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await userApi.updateSettings({
        defaultLlmProvider: 'openai'
      });

      expect(result.settings.defaultLlmProvider).toBe('openai');
    });

    test('should save API key', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const result = await userApi.saveApiKey('openai', 'test-api-key');

      expect(result.success).toBe(true);
    });

    test('should handle authentication errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' })
      });

      await expect(userApi.getProfile()).rejects.toThrow(ApiError);
    });

    test('should handle server errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' })
      });

      await expect(userApi.getProfile()).rejects.toThrow(ApiError);
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(personaApi.list()).rejects.toThrow();
    });

    test('should handle JSON parsing errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => { throw new Error('Invalid JSON'); }
      });

      await expect(personaApi.list()).rejects.toThrow(ApiError);
    });

    test('should include status code in ApiError', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' })
      });

      try {
        await personaApi.get(999);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(404);
        expect(error.message).toBe('Not found');
      }
    });
  });
});
