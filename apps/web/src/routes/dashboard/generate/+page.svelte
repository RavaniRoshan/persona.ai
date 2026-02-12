<!-- Content Generation Page -->
<script>
  import { onMount } from 'svelte';
  import { personaApi, contentApi, userApi, ApiError } from '$lib/services/api.js';
  import { goto } from '$app/navigation';
  
  let selectedPersona = '';
  let topic = '';
  let platforms = [];
  let tone = 'professional';
  let length = 'medium';
  let isGenerating = false;
  let generatedContent = null;
  let personas = [];
  let isLoadingPersonas = true;
  let error = null;
  let llmConfig = null;
  
  const platformOptions = [
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'twitter', name: 'X/Twitter', icon: '🐦' },
    { id: 'instagram', name: 'Instagram', icon: '📸' }
  ];
  
  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'technical', label: 'Technical' },
    { value: 'inspiring', label: 'Inspiring' }
  ];
  
  const lengthOptions = [
    { value: 'short', label: 'Short (1-2 sentences)' },
    { value: 'medium', label: 'Medium (1 paragraph)' },
    { value: 'long', label: 'Long (Multiple paragraphs)' }
  ];
  
  onMount(async () => {
    try {
      // Load personas from API
      const result = await personaApi.list();
      personas = result.personas || [];
      
      // Load user's LLM configuration
      const settings = await userApi.getSettings();
      if (settings?.defaultLlmProvider) {
        llmConfig = {
          provider: settings.defaultLlmProvider,
          apiKey: settings.apiKeys?.[settings.defaultLlmProvider] || '',
          model: settings.defaultModel || 'gpt-4'
        };
      }
    } catch (err) {
      error = 'Failed to load personas. Please try again.';
      console.error('Error loading data:', err);
    } finally {
      isLoadingPersonas = false;
    }
  });
  
  async function generateContent() {
    if (!selectedPersona || !topic || platforms.length === 0) {
      error = 'Please fill in all required fields';
      return;
    }
    
    if (!llmConfig?.apiKey) {
      error = 'Please configure your LLM API key in Settings first';
      return;
    }
    
    isGenerating = true;
    error = null;
    
    try {
      const result = await contentApi.generate({
        topic,
        personaId: parseInt(selectedPersona),
        platforms,
        tone,
        length,
        llmConfig
      });
      
      if (result.success) {
        generatedContent = {
          variants: result.content.map(item => ({
            platform: item.platform,
            content: item.content,
            queueItemId: result.queueItem?.id
          })),
          confidence: 85,
          estimatedEngagement: 'High',
          totalCost: result.totalCost
        };
      } else {
        error = result.message || 'Generation failed';
      }
    } catch (err) {
      if (err instanceof ApiError) {
        error = err.message;
      } else {
        error = 'Failed to generate content. Please try again.';
      }
      console.error('Generation error:', err);
    } finally {
      isGenerating = false;
    }
  }
  
  async function addToQueue() {
    if (!generatedContent?.variants?.[0]?.queueItemId) return;
    
    try {
      // Content is already added to queue during generation, just redirect
      goto('/dashboard/queue');
    } catch (err) {
      error = 'Failed to add to queue';
    }
  }
  
  function discardContent() {
    generatedContent = null;
    error = null;
  }
  
  function togglePlatform(platformId) {
    if (platforms.includes(platformId)) {
      platforms = platforms.filter(p => p !== platformId);
    } else {
      platforms = [...platforms, platformId];
    }
  }
</script>

<div class="generate-page">
  <header class="page-header">
    <h1>Generate Content</h1>
    <p class="subtitle">Create content that matches your unique voice</p>
  </header>
  
  {#if !generatedContent}
    {#if error}
    <div class="error-banner">
      <strong>Error:</strong> {error}
      {#if error.includes('API key')}
        <a href="/dashboard/settings" class="error-link">Go to Settings →</a>
      {/if}
    </div>
  {/if}

  <div class="generate-form">
      <div class="form-section">
        <label class="section-label">Select Persona</label>
        {#if isLoadingPersonas}
          <div class="loading-state">Loading personas...</div>
        {:else if personas.length === 0}
          <div class="empty-state">
            <p>No personas found. Create one first!</p>
            <a href="/dashboard/personas" class="create-link">Create Persona →</a>
          </div>
        {:else}
          <div class="persona-grid">
            {#each personas as persona}
              <button
                class="persona-card"
                class:selected={selectedPersona === persona.id.toString()}
                on:click={() => selectedPersona = persona.id.toString()}
              >
                <span class="persona-icon">🎭</span>
                <span class="persona-name">{persona.name}</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>
      
      <div class="form-section">
        <label class="section-label">Topic or Prompt</label>
        <textarea
          class="topic-input"
          bind:value={topic}
          placeholder="What should the content be about? e.g., 'Share insights on AI in healthcare' or 'Discuss remote work trends'"
          rows="3"
        ></textarea>
      </div>
      
      <div class="form-section">
        <label class="section-label">Platforms</label>
        <div class="platform-grid">
          {#each platformOptions as platform}
            <button
              class="platform-card"
              class:selected={platforms.includes(platform.id)}
              on:click={() => togglePlatform(platform.id)}
            >
              <span class="platform-icon">{platform.icon}</span>
              <span class="platform-name">{platform.name}</span>
            </button>
          {/each}
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-section half">
          <label class="section-label">Tone</label>
          <select class="form-select" bind:value={tone}>
            {#each toneOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
        
        <div class="form-section half">
          <label class="section-label">Length</label>
          <select class="form-select" bind:value={length}>
            {#each lengthOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
      </div>
      
      <button 
        class="generate-btn"
        on:click={generateContent}
        disabled={isGenerating || !selectedPersona || !topic || platforms.length === 0}
      >
        {#if isGenerating}
          <span class="spinner"></span>
          Crafting your content...
        {:else}
          <span>✨</span>
          Generate Content
        {/if}
      </button>
    </div>
  {:else}
    <div class="results-section">
      <div class="results-header">
        <div class="confidence-badge">
          <span>Confidence: {generatedContent.confidence}%</span>
        </div>
        <div class="engagement-badge">
          <span>Estimated Engagement: {generatedContent.estimatedEngagement}</span>
        </div>
      </div>
      
      <div class="content-variants">
        {#each generatedContent.variants as variant}
          <div class="variant-card">
            <div class="variant-header">
              <span class="platform-tag">
                {platformOptions.find(p => p.id === variant.platform)?.icon}
                {platformOptions.find(p => p.id === variant.platform)?.name}
              </span>
            </div>
            <div class="variant-content">
              <p>{variant.content}</p>
            </div>
            <div class="variant-actions">
              <button class="icon-btn" title="Copy">📋</button>
              <button class="icon-btn" title="Edit">✏️</button>
              <button class="icon-btn" title="Regenerate">🔄</button>
            </div>
          </div>
        {/each}
      </div>
      
      <div class="results-actions">
        <button class="secondary-btn" on:click={discardContent}>
          Discard & Start Over
        </button>
        <button class="primary-btn" on:click={addToQueue}>
          Add to Queue
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .generate-page {
    max-width: 800px;
  }
  
  .page-header {
    margin-bottom: 40px;
  }
  
  .page-header h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .subtitle {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .generate-form {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  
  .form-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .form-section.half {
    flex: 1;
  }
  
  .form-row {
    display: flex;
    gap: 20px;
  }
  
  .section-label {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .persona-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .persona-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.03);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;
    color: white;
  }
  
  .persona-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.3);
  }
  
  .persona-card.selected {
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
  }
  
  .persona-icon {
    font-size: 2rem;
  }
  
  .persona-name {
    font-weight: 500;
    font-size: 0.95rem;
  }
  
  .topic-input {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px;
    color: white;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
  }
  
  .topic-input:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.5);
  }
  
  .platform-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }
  
  .platform-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;
    color: white;
  }
  
  .platform-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.3);
  }
  
  .platform-card.selected {
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
  }
  
  .platform-icon {
    font-size: 1.5rem;
  }
  
  .platform-name {
    font-weight: 500;
    font-size: 0.9rem;
  }
  
  .form-select {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 12px 16px;
    color: white;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .form-select:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.5);
  }
  
  .generate-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 18px 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 16px;
  }
  
  .generate-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  }
  
  .generate-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-banner {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .error-link {
    color: #ef4444;
    text-decoration: underline;
    font-weight: 600;
  }

  .loading-state {
    padding: 20px;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
  }

  .empty-state {
    padding: 24px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    text-align: center;
  }

  .empty-state p {
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 16px;
  }

  .create-link {
    display: inline-block;
    padding: 10px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
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
  
  .results-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .results-header {
    display: flex;
    gap: 16px;
  }
  
  .confidence-badge,
  .engagement-badge {
    padding: 8px 16px;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .confidence-badge {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
  }
  
  .engagement-badge {
    background: rgba(72, 187, 120, 0.2);
    color: #48bb78;
  }
  
  .content-variants {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .variant-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 24px;
  }
  
  .variant-header {
    margin-bottom: 16px;
  }
  
  .platform-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
    padding: 6px 12px;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .variant-content {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
  }
  
  .variant-content p {
    margin: 0;
    line-height: 1.6;
    white-space: pre-line;
  }
  
  .variant-actions {
    display: flex;
    gap: 8px;
  }
  
  .icon-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
  }
  
  .icon-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .results-actions {
    display: flex;
    gap: 16px;
    margin-top: 24px;
  }
  
  .primary-btn,
  .secondary-btn {
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
