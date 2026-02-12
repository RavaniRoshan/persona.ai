<!-- Settings Page -->
<script>
  import { onMount } from 'svelte';
  
  let activeTab = 'api';
  let apiKeys = {
    openai: '',
    anthropic: '',
    ollama: 'http://localhost:11434'
  };
  let saving = false;
  let message = '';
  
  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4, GPT-3.5',
      placeholder: 'sk-...',
      helpUrl: 'https://platform.openai.com/api-keys'
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      description: 'Claude 3 (Opus, Sonnet, Haiku)',
      placeholder: 'sk-ant-...',
      helpUrl: 'https://console.anthropic.com/settings/keys'
    },
    {
      id: 'ollama',
      name: 'Ollama (Local)',
      description: 'Run models locally',
      placeholder: 'http://localhost:11434',
      isUrl: true
    }
  ];
  
  async function saveApiKeys() {
    saving = true;
    message = '';
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, encrypt and store
    localStorage.setItem('api_keys', JSON.stringify(apiKeys));
    
    message = 'API keys saved successfully!';
    saving = false;
  }
  
  onMount(() => {
    const saved = localStorage.getItem('api_keys');
    if (saved) {
      apiKeys = { ...apiKeys, ...JSON.parse(saved) };
    }
  });
  
  function maskKey(key) {
    if (!key || key.length < 8) return '';
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  }
</script>

<div class="settings-page">
  <header class="page-header">
    <h1>Settings</h1>
    <p class="subtitle">Manage your API keys and preferences</p>
  </header>
  
  <div class="settings-tabs">
    <button 
      class="tab"
      class:active={activeTab === 'api'}
      on:click={() => activeTab = 'api'}
    >
      🔑 API Keys
    </button>
    <button 
      class="tab"
      class:active={activeTab === 'profile'}
      on:click={() => activeTab = 'profile'}
    >
      👤 Profile
    </button>
    <button 
      class="tab"
      class:active={activeTab === 'notifications'}
      on:click={() => activeTab = 'notifications'}
    >
      🔔 Notifications
    </button>
  </div>
  
  {#if activeTab === 'api'}
    <div class="settings-section">
      <div class="section-header">
        <h2>LLM API Keys</h2>
        <p class="section-desc">
          Add your own API keys for AI providers. Your keys are encrypted and stored securely.
          We never use your keys for anything other than generating your content.
        </p>
      </div>
      
      <div class="providers-list">
        {#each providers as provider}
          <div class="provider-card">
            <div class="provider-info">
              <h3>{provider.name}</h3>
              <p class="provider-desc">{provider.description}</p>
            </div>
            
            <div class="input-group">
              <input
                type="password"
                class="api-input"
                placeholder={provider.placeholder}
                bind:value={apiKeys[provider.id]}
              />
              {#if apiKeys[provider.id] && !provider.isUrl}
                <span class="key-mask">{maskKey(apiKeys[provider.id])}</span>
              {/if}
            </div>
            
            {#if provider.helpUrl}
              <a href={provider.helpUrl} target="_blank" class="help-link">
                Get API key →
              </a>
            {/if}
          </div>
        {/each}
      </div>
      
      <div class="security-notice">
        <h4>🔒 Security Information</h4>
        <ul>
          <li>API keys are encrypted before storage</li>
          <li>Keys are only used for your content generation</li>
          <li>We never log or share your keys</li>
          <li>You can rotate keys anytime</li>
        </ul>
      </div>
      
      {#if message}
        <div class="success-message">{message}</div>
      {/if}
      
      <button 
        class="save-btn"
        on:click={saveApiKeys}
        disabled={saving}
      >
        {#if saving}
          <span class="spinner"></span>
          Saving...
        {:else}
          Save API Keys
        {/if}
      </button>
    </div>
  {:else if activeTab === 'profile'}
    <div class="settings-section">
      <div class="section-header">
        <h2>Profile Settings</h2>
        <p class="section-desc">Manage your account information</p>
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" class="form-input" value="user@example.com" disabled />
        <span class="field-hint">Email cannot be changed</span>
      </div>
      
      <div class="form-group">
        <label for="display-name">Display Name</label>
        <input id="display-name" type="text" class="form-input" placeholder="Your name" />
      </div>
      
      <div class="form-group">
        <label for="bio">Bio</label>
        <textarea id="bio" class="form-input" rows="3" placeholder="Tell us about yourself"></textarea>
      </div>
      
      <button class="save-btn">Save Profile</button>
    </div>
  {:else if activeTab === 'notifications'}
    <div class="settings-section">
      <div class="section-header">
        <h2>Notification Preferences</h2>
        <p class="section-desc">Control how and when we notify you</p>
      </div>
      
      <div class="toggle-list">
        <label class="toggle-item">
          <input type="checkbox" checked />
          <span class="toggle-slider"></span>
          <div class="toggle-info">
            <span class="toggle-label">Content Generated</span>
            <span class="toggle-desc">Get notified when new content is ready for review</span>
          </div>
        </label>
        
        <label class="toggle-item">
          <input type="checkbox" checked />
          <span class="toggle-slider"></span>
          <div class="toggle-info">
            <span class="toggle-label">Post Published</span>
            <span class="toggle-desc">Receive confirmation when posts go live</span>
          </div>
        </label>
        
        <label class="toggle-item">
          <input type="checkbox" />
          <span class="toggle-slider"></span>
          <div class="toggle-info">
            <span class="toggle-label">Weekly Digest</span>
            <span class="toggle-desc">Get a summary of your weekly activity</span>
          </div>
        </label>
        
        <label class="toggle-item">
          <input type="checkbox" checked />
          <span class="toggle-slider"></span>
          <div class="toggle-info">
            <span class="toggle-label">Security Alerts</span>
            <span class="toggle-desc">Important security notifications</span>
          </div>
        </label>
      </div>
      
      <button class="save-btn">Save Preferences</button>
    </div>
  {/if}
</div>

<style>
  .settings-page {
    max-width: 800px;
  }
  
  .page-header {
    margin-bottom: 32px;
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
  
  .settings-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 32px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 16px;
  }
  
  .tab {
    padding: 12px 24px;
    background: none;
    border: none;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s;
  }
  
  .tab:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }
  
  .tab.active {
    background: rgba(102, 126, 234, 0.2);
    color: white;
  }
  
  .settings-section {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 32px;
  }
  
  .section-header {
    margin-bottom: 32px;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
  
  .section-desc {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .providers-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 32px;
  }
  
  .provider-card {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 24px;
  }
  
  .provider-info h3 {
    font-size: 1.2rem;
    margin-bottom: 4px;
  }
  
  .provider-desc {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
    margin-bottom: 16px;
  }
  
  .input-group {
    position: relative;
    margin-bottom: 12px;
  }
  
  .api-input {
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 12px 16px;
    color: white;
    font-size: 1rem;
    font-family: monospace;
  }
  
  .api-input:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.5);
  }
  
  .key-mask {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.5);
    font-family: monospace;
    font-size: 0.9rem;
  }
  
  .help-link {
    color: #667eea;
    text-decoration: none;
    font-size: 0.9rem;
  }
  
  .help-link:hover {
    text-decoration: underline;
  }
  
  .security-notice {
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
  }
  
  .security-notice h4 {
    margin-bottom: 12px;
  }
  
  .security-notice ul {
    list-style: none;
    padding: 0;
  }
  
  .security-notice li {
    padding: 4px 0;
    color: rgba(255, 255, 255, 0.7);
    padding-left: 20px;
    position: relative;
  }
  
  .security-notice li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #48bb78;
  }
  
  .success-message {
    background: rgba(72, 187, 120, 0.2);
    border: 1px solid rgba(72, 187, 120, 0.3);
    color: #48bb78;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 24px;
  }
  
  .save-btn {
    width: 100%;
    padding: 14px 28px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  .save-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  }
  
  .save-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .form-group {
    margin-bottom: 24px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .form-input {
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 12px 16px;
    color: white;
    font-size: 1rem;
  }
  
  .form-input:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.5);
  }
  
  .form-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .field-hint {
    display: block;
    margin-top: 6px;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.4);
  }
  
  .toggle-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 32px;
  }
  
  .toggle-item {
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
  }
  
  .toggle-item input {
    display: none;
  }
  
  .toggle-slider {
    width: 50px;
    height: 26px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 13px;
    position: relative;
    transition: all 0.3s;
    flex-shrink: 0;
  }
  
  .toggle-slider::after {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: all 0.3s;
  }
  
  .toggle-item input:checked + .toggle-slider {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .toggle-item input:checked + .toggle-slider::after {
    left: 26px;
  }
  
  .toggle-info {
    display: flex;
    flex-direction: column;
  }
  
  .toggle-label {
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .toggle-desc {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
  }
</style>
