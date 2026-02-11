<!-- Persona Builder Page -->
<script>
  import { onMount } from 'svelte';
  
  let posts = '';
  let isExtracting = false;
  let extractionResult = null;
  let error = null;
  let activeTab = 'input';
  
  // Mock data for demo
  const mockPersona = {
    name: 'Professional Tech Voice',
    description: 'A thought leader in AI and technology with a focus on practical applications',
    toneRules: {
      style: ['professional', 'insightful', 'concise'],
      topics: ['AI', 'technology', 'innovation', 'future of work'],
      avoid: ['jargon without explanation', 'overly promotional language'],
      phrases: ['The key insight is...', 'What this means for you...'],
      examples: [
        'AI isn\'t replacing humans - it\'s augmenting our capabilities.',
        'The future belongs to those who learn to work alongside intelligent systems.'
      ],
      toneDescriptors: ['authoritative', 'accessible', 'forward-thinking'],
      sentenceStructure: 'mixed',
      vocabulary: 'advanced'
    }
  };
  
  async function extractPersona() {
    if (!posts.trim()) {
      error = 'Please paste at least 5 posts';
      return;
    }
    
    const postList = posts.split('\n\n').filter(p => p.trim().length > 10);
    if (postList.length < 5) {
      error = `Please provide at least 5 meaningful posts (found ${postList.length})`;
      return;
    }
    
    isExtracting = true;
    error = null;
    
    // Simulate API call
    setTimeout(() => {
      extractionResult = {
        persona: mockPersona,
        confidence: 87,
        sampleMatches: [
          {
            originalPost: postList[0]?.substring(0, 150) + '...',
            explanation: 'Demonstrates professional, insightful characteristics',
            score: 0.92
          },
          {
            originalPost: postList[1]?.substring(0, 150) + '...',
            explanation: 'Shows authoritative tone with accessible language',
            score: 0.89
          }
        ],
        suggestedRules: [
          {
            rule: 'Focus on AI, technology, innovation topics',
            examples: ['Create content about AI trends', 'Discuss innovation insights']
          },
          {
            rule: 'Maintain professional and insightful tone',
            examples: ['Write with authoritative voice', 'Keep insights practical']
          }
        ]
      };
      isExtracting = false;
      activeTab = 'result';
    }, 2000);
  }
  
  function savePersona() {
    alert('Persona saved successfully!');
  }
</script>

<div class="persona-builder">
  <header class="page-header">
    <h1>Create Your Persona</h1>
    <p class="subtitle">Train AI on your writing style by pasting your past posts</p>
  </header>
  
  <div class="tabs">
    <button 
      class="tab" 
      class:active={activeTab === 'input'}
      on:click={() => activeTab = 'input'}
    >
      1. Paste Posts
    </button>
    <button 
      class="tab" 
      class:active={activeTab === 'result'}
      disabled={!extractionResult}
      on:click={() => activeTab = 'result'}
    >
      2. Review & Edit
    </button>
  </div>
  
  {#if activeTab === 'input'}
    <div class="input-section">
      <div class="input-header">
        <h3>Paste Your Social Media Posts</h3>
        <p class="hint">Minimum 5 posts recommended for best results. Separate posts with blank lines.</p>
      </div>
      
      <textarea
        class="posts-input"
        bind:value={posts}
        placeholder="Paste your posts here...

Example:

Just shipped a new feature! AI isn't replacing humans - it's augmenting our capabilities. The key is learning to work alongside intelligent systems.

The future of work isn't about AI vs humans. It's about AI + humans. Those who adapt will thrive."
        rows="15"
      ></textarea>
      
      {#if error}
        <div class="error-message">{error}</div>
      {/if}
      
      <div class="input-stats">
        {#if posts}
          <span>{posts.split('\n\n').filter(p => p.trim().length > 10).length} posts detected</span>
        {/if}
      </div>
      
      <button 
        class="extract-btn"
        on:click={extractPersona}
        disabled={isExtracting}
      >
        {#if isExtracting}
          <span class="spinner"></span>
          Analyzing your voice...
        {:else}
          Extract My Persona
        {/if}
      </button>
    </div>
  {:else if activeTab === 'result' && extractionResult}
    <div class="result-section">
      <div class="confidence-badge">
        <span class="confidence-label">Extraction Confidence</span>
        <span class="confidence-score">{extractionResult.confidence}%</span>
      </div>
      
      <div class="persona-form">
        <div class="form-group">
          <label>Persona Name</label>
          <input 
            type="text" 
            bind:value={extractionResult.persona.name}
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label>Description</label>
          <textarea 
            bind:value={extractionResult.persona.description}
            class="form-input"
            rows="2"
          ></textarea>
        </div>
        
        <div class="tone-rules">
          <h4>Tone & Style</h4>
          
          <div class="form-group">
            <label>Style Descriptors</label>
            <div class="tags">
              {#each extractionResult.persona.toneRules.style as style, i}
                <span class="tag">{style}</span>
              {/each}
            </div>
          </div>
          
          <div class="form-group">
            <label>Common Topics</label>
            <div class="tags">
              {#each extractionResult.persona.toneRules.topics as topic}
                <span class="tag topic">{topic}</span>
              {/each}
            </div>
          </div>
          
          <div class="form-group">
            <label>Phrases to Use</label>
            <ul class="phrase-list">
              {#each extractionResult.persona.toneRules.phrases as phrase}
                <li>{phrase}</li>
              {/each}
            </ul>
          </div>
          
          <div class="form-group">
            <label>Example Sentences</label>
            <div class="examples">
              {#each extractionResult.persona.toneRules.examples as example}
                <blockquote>{example}</blockquote>
              {/each}
            </div>
          </div>
        </div>
        
        <div class="suggested-rules">
          <h4>Suggested Rules</h4>
          {#each extractionResult.suggestedRules as rule}
            <div class="rule-card">
              <p class="rule-text">{rule.rule}</p>
              <div class="rule-examples">
                {#each rule.examples as ex}
                  <span class="rule-example">{ex}</span>
                {/each}
              </div>
            </div>
          {/each}
        </div>
        
        <div class="sample-matches">
          <h4>Sample Matches</h4>
          {#each extractionResult.sampleMatches as match}
            <div class="match-card">
              <div class="match-score">{Math.round(match.score * 100)}% match</div>
              <p class="match-post">{match.originalPost}</p>
              <p class="match-explanation">{match.explanation}</p>
            </div>
          {/each}
        </div>
        
        <div class="actions">
          <button class="secondary-btn" on:click={() => activeTab = 'input'}>
            ← Back to Edit
          </button>
          <button class="primary-btn" on:click={savePersona}>
            Save Persona
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .persona-builder {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .page-header {
    margin-bottom: 40px;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .subtitle {
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.1rem;
  }
  
  .tabs {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 16px;
  }
  
  .tab {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    padding: 12px 24px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s;
    border-radius: 8px;
  }
  
  .tab:hover:not(:disabled) {
    color: white;
    background: rgba(255, 255, 255, 0.05);
  }
  
  .tab.active {
    color: white;
    background: rgba(102, 126, 234, 0.2);
  }
  
  .tab:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .input-section {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 32px;
  }
  
  .input-header {
    margin-bottom: 24px;
  }
  
  .input-header h3 {
    font-size: 1.3rem;
    margin-bottom: 8px;
  }
  
  .hint {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
  }
  
  .posts-input {
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
    color: white;
    font-size: 1rem;
    line-height: 1.6;
    resize: vertical;
    min-height: 300px;
    font-family: inherit;
  }
  
  .posts-input:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.5);
  }
  
  .posts-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  .error-message {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    padding: 12px 16px;
    border-radius: 8px;
    margin-top: 16px;
  }
  
  .input-stats {
    margin-top: 16px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
  }
  
  .extract-btn {
    width: 100%;
    margin-top: 24px;
    padding: 16px 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  
  .extract-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  }
  
  .extract-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .result-section {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 32px;
  }
  
  .confidence-badge {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.3);
    padding: 12px 20px;
    border-radius: 50px;
    margin-bottom: 32px;
  }
  
  .confidence-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
  
  .confidence-score {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
  }
  
  .persona-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .form-group label {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .form-input {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 12px 16px;
    color: white;
    font-size: 1rem;
    font-family: inherit;
  }
  
  .form-input:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.5);
  }
  
  .tone-rules, .suggested-rules, .sample-matches {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 24px;
  }
  
  .tone-rules h4, .suggested-rules h4, .sample-matches h4 {
    margin-bottom: 16px;
    font-size: 1.1rem;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .tag {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
    padding: 6px 12px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  .tag.topic {
    background: rgba(118, 75, 162, 0.2);
    color: #9f7aea;
  }
  
  .phrase-list {
    list-style: none;
    padding: 0;
  }
  
  .phrase-list li {
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.8);
  }
  
  .phrase-list li:last-child {
    border-bottom: none;
  }
  
  .examples blockquote {
    background: rgba(255, 255, 255, 0.05);
    border-left: 3px solid #667eea;
    padding: 16px;
    margin: 0 0 12px 0;
    font-style: italic;
    color: rgba(255, 255, 255, 0.8);
    border-radius: 0 8px 8px 0;
  }
  
  .rule-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
  }
  
  .rule-text {
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .rule-examples {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .rule-example {
    background: rgba(102, 126, 234, 0.1);
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .match-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
  }
  
  .match-score {
    display: inline-block;
    background: rgba(72, 187, 120, 0.2);
    color: #48bb78;
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  .match-post {
    color: rgba(255, 255, 255, 0.8);
    font-style: italic;
    margin-bottom: 8px;
    line-height: 1.5;
  }
  
  .match-explanation {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
  }
  
  .actions {
    display: flex;
    gap: 16px;
    margin-top: 32px;
  }
  
  .primary-btn, .secondary-btn {
    flex: 1;
    padding: 14px 28px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .primary-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
  }
  
  .primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  }
  
  .secondary-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
  }
  
  .secondary-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.4);
  }
</style>
