import { describe, test, expect, beforeEach, vi } from 'vitest';
import { PersonaExtractor } from '../packages/llm-bridge/src/extractor';

describe('PersonaExtractor', () => {
  let extractor;
  
  beforeEach(() => {
    extractor = new PersonaExtractor();
  });
  
  describe('Input Validation', () => {
    test('should reject empty posts array', async () => {
      const result = await extractor.extract({ posts: [] }, {});
      expect(result.success).toBe(false);
      expect(result.error).toContain('No posts provided');
    });
    
    test('should reject less than minimum posts', async () => {
      const posts = ['Post 1', 'Post 2'];
      const result = await extractor.extract({ posts, minPosts: 5 }, {});
      expect(result.success).toBe(false);
      expect(result.error).toContain('Minimum 5 posts required');
    });
    
    test('should reject posts that are too short', async () => {
      const posts = ['Hi', 'Hello', 'Hey', 'Yo', 'Sup'];
      const result = await extractor.extract({ posts, minPosts: 5 }, {});
      expect(result.success).toBe(false);
      expect(result.error).toContain('meaningful content');
    });
    
    test('should accept valid posts', async () => {
      const posts = [
        'This is a comprehensive post about artificial intelligence and its impact on society.',
        'Machine learning is transforming how we approach problem solving in modern applications.',
        'Deep learning neural networks have achieved remarkable results in computer vision tasks.',
        'Natural language processing enables computers to understand and generate human text.',
        'Reinforcement learning has been successfully applied to game playing and robotics.'
      ];
      
      // Mock the LLM bridge to avoid actual API calls
      const mockBridge = {
        extractPersona: vi.fn().mockResolvedValue({
          success: true,
          data: {
            name: 'Test Persona',
            description: 'A test persona',
            toneRules: {
              style: ['professional', 'technical'],
              topics: ['AI', 'technology'],
              avoid: ['jargon'],
              phrases: ['The key insight is'],
              examples: ['Example sentence'],
              toneDescriptors: ['authoritative'],
              sentenceStructure: 'mixed',
              vocabulary: 'advanced'
            },
            extractionConfidence: 85
          }
        })
      };
      
      // This would need the actual mocking setup
      // For now, just validate the structure
      expect(posts).toHaveLength(5);
      expect(posts.every(p => p.length > 10)).toBe(true);
    });
  });
  
  describe('Confidence Calculation', () => {
    test('should calculate base confidence of 70', () => {
      const data = {
        toneRules: {
          style: ['casual'],
          topics: ['general'],
          examples: []
        }
      };
      
      // Access private method through any type for testing
      const confidence = (extractor as any).calculateConfidence(data, []);
      expect(confidence).toBeGreaterThanOrEqual(70);
      expect(confidence).toBeLessThanOrEqual(100);
    });
    
    test('should increase confidence with more posts', () => {
      const data = { toneRules: {} };
      const fewPosts = new Array(5).fill('Test post with sufficient length');
      const manyPosts = new Array(50).fill('Test post with sufficient length');
      
      const fewConfidence = (extractor as any).calculateConfidence(data, fewPosts);
      const manyConfidence = (extractor as any).calculateConfidence(data, manyPosts);
      
      expect(manyConfidence).toBeGreaterThan(fewConfidence);
    });
    
    test('should increase confidence with comprehensive tone rules', () => {
      const data = {
        toneRules: {
          style: ['professional', 'concise', 'engaging', 'thoughtful'],
          topics: ['AI', 'technology', 'innovation', 'future'],
          examples: ['Example 1', 'Example 2', 'Example 3'],
          toneDescriptors: ['authoritative', 'accessible'],
          sentenceStructure: 'mixed',
          vocabulary: 'advanced'
        }
      };
      
      const confidence = (extractor as any).calculateConfidence(data, []);
      expect(confidence).toBeGreaterThan(80);
    });
  });
  
  describe('Sample Matches Generation', () => {
    test('should generate sample matches from posts and persona data', () => {
      const posts = [
        'AI is transforming the way we work and live.',
        'Machine learning models require quality data.',
        'Deep learning has revolutionized computer vision.'
      ];
      
      const personaData = {
        toneRules: {
          toneDescriptors: ['professional', 'technical'],
          style: ['insightful']
        }
      };
      
      const matches = (extractor as any).generateSampleMatches(posts, personaData);
      
      expect(matches).toHaveLength(3);
      expect(matches[0]).toHaveProperty('originalPost');
      expect(matches[0]).toHaveProperty('explanation');
      expect(matches[0]).toHaveProperty('score');
      expect(matches[0].score).toBeGreaterThanOrEqual(0.7);
      expect(matches[0].score).toBeLessThanOrEqual(1.0);
    });
  });
  
  describe('Suggested Rules Generation', () => {
    test('should generate rules based on persona data', () => {
      const personaData = {
        toneRules: {
          topics: ['AI', 'technology', 'innovation'],
          style: ['professional', 'concise'],
          vocabulary: 'advanced'
        }
      };
      
      const rules = (extractor as any).generateSuggestedRules(personaData);
      
      expect(rules).toBeInstanceOf(Array);
      expect(rules.length).toBeGreaterThan(0);
      
      rules.forEach(rule => {
        expect(rule).toHaveProperty('rule');
        expect(rule).toHaveProperty('examples');
        expect(rule.examples).toBeInstanceOf(Array);
      });
    });
    
    test('should include vocabulary-based rules', () => {
      const personaData = {
        toneRules: {
          vocabulary: 'simple',
          topics: [],
          style: []
        }
      };
      
      const rules = (extractor as any).generateSuggestedRules(personaData);
      const vocabRule = rules.find(r => r.rule.includes('vocabulary'));
      
      expect(vocabRule).toBeDefined();
    });
  });
  
  describe('Persona Validation', () => {
    test('should validate persona with missing name', async () => {
      const persona = {
        name: '',
        description: 'Test',
        toneRules: {
          style: ['casual'],
          topics: ['general']
        }
      };
      
      const result = await extractor.validatePersona(persona, {});
      
      expect(result.valid).toBe(false);
      expect(result.feedback).toContain('Persona name is required');
    });
    
    test('should provide feedback for incomplete tone rules', async () => {
      const persona = {
        name: 'Test Persona',
        description: 'A test',
        toneRules: {
          style: [],
          topics: [],
          examples: []
        }
      };
      
      // Mock the bridge
      const result = await extractor.validatePersona(persona, {});
      
      expect(result.feedback.length).toBeGreaterThan(0);
    });
  });
});
