<!-- Content Queue Management Page -->
<script>
  import { onMount } from 'svelte';
  
  let activeTab = 'pending';
  let selectedItems = [];
  
  const queueItems = {
    pending: [
      {
        id: 1,
        platform: 'LinkedIn',
        content: 'AI isn\'t replacing humans - it\'s augmenting our capabilities. The key is learning to work alongside intelligent systems. Here are 3 ways to start...',
        status: 'pending',
        persona: 'Tech Thought Leader',
        created: '2 hours ago',
        scheduled: 'Today, 3:00 PM'
      },
      {
        id: 2,
        platform: 'Twitter',
        content: '5 lessons I learned building in public:\n\n1. Consistency beats perfection\n2. Community > Code\n3. Ship fast, iterate faster\n4. Share the journey\n5. Stay authentic',
        status: 'pending',
        persona: 'Casual Creator',
        created: '5 hours ago',
        scheduled: 'Tomorrow, 9:00 AM'
      },
      {
        id: 3,
        platform: 'Instagram',
        content: 'Behind the scenes of how AI changed my content game. The truth about automation and authenticity...',
        status: 'pending',
        persona: 'Professional Consultant',
        created: '1 day ago',
        scheduled: 'Not scheduled'
      }
    ],
    approved: [
      {
        id: 4,
        platform: 'LinkedIn',
        content: 'The future of work is hybrid. Not just remote vs office, but human vs AI collaboration. Smart leaders are preparing now...',
        status: 'approved',
        persona: 'Tech Thought Leader',
        created: '2 days ago',
        scheduled: 'Today, 6:00 PM'
      }
    ],
    posted: [
      {
        id: 5,
        platform: 'Twitter',
        content: 'Just shipped a new feature! 🚀',
        status: 'posted',
        persona: 'Casual Creator',
        created: '3 days ago',
        posted: '3 days ago',
        engagement: { likes: 45, replies: 12, shares: 8 }
      }
    ]
  };
  
  function toggleSelection(id) {
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter(i => i !== id);
    } else {
      selectedItems = [...selectedItems, id];
    }
  }
  
  function selectAll() {
    const currentItems = queueItems[activeTab];
    if (selectedItems.length === currentItems.length) {
      selectedItems = [];
    } else {
      selectedItems = currentItems.map(item => item.id);
    }
  }
  
  function approveSelected() {
    alert(`Approved ${selectedItems.length} items`);
    selectedItems = [];
  }
  
  function deleteSelected() {
    if (confirm(`Delete ${selectedItems.length} items?`)) {
      selectedItems = [];
    }
  }
  
  function getPlatformColor(platform) {
    const colors = {
      'LinkedIn': '#0a66c2',
      'Twitter': '#1d9bf0',
      'Instagram': '#e4405f'
    };
    return colors[platform] || '#667eea';
  }
  
  function getPlatformIcon(platform) {
    const icons = {
      'LinkedIn': '💼',
      'Twitter': '🐦',
      'Instagram': '📸'
    };
    return icons[platform] || '📝';
  }
</script>

<div class="queue-page">
  <header class="page-header">
    <h1>Content Queue</h1>
    <p class="subtitle">Review, edit, and manage your scheduled content</p>
  </header>
  
  <div class="queue-tabs">
    <button 
      class="tab"
      class:active={activeTab === 'pending'}
      on:click={() => { activeTab = 'pending'; selectedItems = []; }}
    >
      <span class="tab-label">Pending Review</span>
      <span class="tab-count">{queueItems.pending.length}</span>
    </button>
    <button 
      class="tab"
      class:active={activeTab === 'approved'}
      on:click={() => { activeTab = 'approved'; selectedItems = []; }}
    >
      <span class="tab-label">Approved</span>
      <span class="tab-count">{queueItems.approved.length}</span>
    </button>
    <button 
      class="tab"
      class:active={activeTab === 'posted'}
      on:click={() => { activeTab = 'posted'; selectedItems = []; }}
    >
      <span class="tab-label">Posted</span>
      <span class="tab-count">{queueItems.posted.length}</span>
    </button>
  </div>
  
  {#if selectedItems.length > 0}
    <div class="bulk-actions">
      <span class="selection-info">{selectedItems.length} selected</span>
      {#if activeTab === 'pending'}
        <button class="bulk-btn approve" on:click={approveSelected}>
          ✓ Approve Selected
        </button>
      {/if}
      <button class="bulk-btn delete" on:click={deleteSelected}>
        🗑️ Delete Selected
      </button>
    </div>
  {/if}
  
  <div class="queue-list">
    {#each queueItems[activeTab] as item}
      <div class="queue-card" class:selected={selectedItems.includes(item.id)}>
        <div class="card-select">
          <input 
            type="checkbox" 
            checked={selectedItems.includes(item.id)}
            on:change={() => toggleSelection(item.id)}
          />
        </div>
        
        <div class="card-content">
          <div class="card-header">
            <div class="platform-badge" style="background: {getPlatformColor(item.platform)}20; color: {getPlatformColor(item.platform)}">
              <span>{getPlatformIcon(item.platform)}</span>
              {item.platform}
            </div>
            <span class="persona-tag">{item.persona}</span>
          </div>
          
          <p class="content-text">{item.content}</p>
          
          <div class="card-meta">
            <span class="meta-item">📅 Created: {item.created}</span>
            {#if item.scheduled}
              <span class="meta-item">⏰ Scheduled: {item.scheduled}</span>
            {/if}
            {#if item.posted}
              <span class="meta-item">📤 Posted: {item.posted}</span>
            {/if}
          </div>
          
          {#if item.engagement}
            <div class="engagement-stats">
              <span class="stat">❤️ {item.engagement.likes}</span>
              <span class="stat">💬 {item.engagement.replies}</span>
              <span class="stat">🔄 {item.engagement.shares}</span>
            </div>
          {/if}
        </div>
        
        <div class="card-actions">
          {#if activeTab === 'pending'}
            <button class="action-btn approve" title="Approve">✓</button>
          {/if}
          <button class="action-btn edit" title="Edit">✏️</button>
          <button class="action-btn delete" title="Delete">🗑️</button>
        </div>
      </div>
    {/each}
  </div>
  
  {#if queueItems[activeTab].length === 0}
    <div class="empty-state">
      <span class="empty-icon">📭</span>
      <h3>No {activeTab} content</h3>
      <p>Generate new content to see it here</p>
      <a href="/dashboard/generate" class="generate-link">Generate Content →</a>
    </div>
  {/if}
</div>

<style>
  .queue-page {
    max-width: 1000px;
  }
  
  .page-header {
    margin-bottom: 32px;
  }
  
  .page-header h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  .subtitle {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .queue-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 16px;
  }
  
  .tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: none;
    border: none;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.95rem;
  }
  
  .tab:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }
  
  .tab.active {
    background: rgba(102, 126, 234, 0.2);
    color: white;
  }
  
  .tab-count {
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 8px;
    border-radius: 50px;
    font-size: 0.8rem;
  }
  
  .bulk-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.3);
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .selection-info {
    font-weight: 600;
    margin-right: auto;
  }
  
  .bulk-btn {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .bulk-btn.approve {
    background: rgba(72, 187, 120, 0.2);
    color: #48bb78;
  }
  
  .bulk-btn.delete {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }
  
  .bulk-btn:hover {
    opacity: 0.8;
  }
  
  .queue-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .queue-card {
    display: flex;
    gap: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s;
  }
  
  .queue-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.3);
  }
  
  .queue-card.selected {
    background: rgba(102, 126, 234, 0.1);
    border-color: rgba(102, 126, 234, 0.5);
  }
  
  .card-select {
    display: flex;
    align-items: center;
  }
  
  .card-select input {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  
  .card-content {
    flex: 1;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  .platform-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  .persona-tag {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.85rem;
  }
  
  .content-text {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin-bottom: 16px;
    white-space: pre-line;
  }
  
  .card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 12px;
  }
  
  .meta-item {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.85rem;
  }
  
  .engagement-stats {
    display: flex;
    gap: 16px;
  }
  
  .stat {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
  }
  
  .card-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .action-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .action-btn.approve:hover {
    background: rgba(72, 187, 120, 0.2);
    border-color: rgba(72, 187, 120, 0.5);
  }
  
  .action-btn.delete:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
  }
  
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
  }
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    display: block;
  }
  
  .empty-state h3 {
    margin-bottom: 8px;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .empty-state p {
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 20px;
  }
  
  .generate-link {
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s;
  }
  
  .generate-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  }
</style>
