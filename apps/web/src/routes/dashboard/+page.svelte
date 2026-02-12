<!-- Dashboard Home Page -->
<script>
  import { onMount } from 'svelte';
  import { personaApi, queueApi, ApiError } from '$lib/services/api.js';

  let stats = {
    personas: 0,
    queued: 0,
    posted: 0,
    engagement: '0'
  };

  let recentActivity = [];
  let queuedContent = [];
  let isLoading = true;
  let error = null;

  onMount(async () => {
    await loadDashboardData();
  });

  async function loadDashboardData() {
    isLoading = true;
    error = null;

    try {
      // Load personas count
      const personasResult = await personaApi.list();
      const personas = personasResult.personas || [];
      stats.personas = personas.length;

      // Load queue stats and items
      const [queueStats, queueItems] = await Promise.all([
        queueApi.stats().catch(() => ({ stats: {}, total: 0 })),
        queueApi.list().catch(() => ({ queue: [] }))
      ]);

      // Calculate queue stats
      const queue = queueItems.queue || [];
      const statusCounts = queue.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});

      stats.queued = (statusCounts.draft || 0) + (statusCounts.review || 0) + (statusCounts.approved || 0) + (statusCounts.scheduled || 0);
      stats.posted = statusCounts.posted || 0;

      // Get recent queue items for display
      queuedContent = queue.slice(0, 3).map(item => ({
        id: item.id,
        platform: item.platforms?.[0] || 'LinkedIn',
        content: item.draft || item.content || '',
        status: item.status === 'draft' || item.status === 'review' ? 'pending' : item.status,
        scheduled: item.scheduled_for ? formatDate(item.scheduled_for) : 'Not scheduled'
      }));

      // Build recent activity from queue items
      recentActivity = buildRecentActivity(queue.slice(0, 5), personas.slice(0, 2));

    } catch (err) {
      if (err instanceof ApiError) {
        error = err.message;
      } else {
        error = 'Failed to load dashboard data';
      }
      console.error('Dashboard load error:', err);
    } finally {
      isLoading = false;
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  function buildRecentActivity(queueItems, personas) {
    const activities = [];

    // Add queue-based activities
    queueItems.forEach(item => {
      if (item.status === 'posted') {
        activities.push({
          action: 'Posted to ' + (item.platforms?.[0] || 'LinkedIn'),
          target: (item.draft || item.content || '').substring(0, 40) + '...',
          time: formatDate(item.updated_at || item.created_at),
          type: 'post'
        });
      } else if (item.status === 'approved') {
        activities.push({
          action: 'Approved post',
          target: (item.draft || item.content || '').substring(0, 40) + '...',
          time: formatDate(item.updated_at || item.created_at),
          type: 'approve'
        });
      } else {
        activities.push({
          action: 'Generated content',
          target: (item.draft || item.content || '').substring(0, 40) + '...',
          time: formatDate(item.created_at),
          type: 'generate'
        });
      }
    });

    // Add persona creation activities
    personas.forEach(persona => {
      activities.push({
        action: 'Created persona',
        target: persona.name,
        time: formatDate(persona.created_at),
        type: 'create'
      });
    });

    // Sort by time (most recent first) and take top 5
    return activities.slice(0, 5);
  }
</script>

<div class="dashboard-home">
  <header class="page-header">
    <h1>Dashboard</h1>
    <p class="subtitle">Overview of your PersonaMirror activity</p>
  </header>

  {#if error}
    <div class="error-banner">
      {error}
      <button class="retry-btn" on:click={loadDashboardData}>Retry</button>
    </div>
  {/if}

  {#if isLoading}
    <div class="loading-state">
      <span class="spinner"></span>
      Loading dashboard...
    </div>
  {:else}
  <!-- Stats Grid -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">🎭</div>
      <div class="stat-info">
        <span class="stat-value">{stats.personas}</span>
        <span class="stat-label">Active Personas</span>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon">📝</div>
      <div class="stat-info">
        <span class="stat-value">{stats.queued}</span>
        <span class="stat-label">In Queue</span>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon">📤</div>
      <div class="stat-info">
        <span class="stat-value">{stats.posted}</span>
        <span class="stat-label">Posts Published</span>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon">❤️</div>
      <div class="stat-info">
        <span class="stat-value">{stats.engagement}</span>
        <span class="stat-label">Total Engagement</span>
      </div>
    </div>
  </div>
  
  <div class="dashboard-grid">
    <!-- Queued Content -->
    <div class="content-section">
      <div class="section-header">
        <h2>Upcoming Content</h2>
        <a href="/dashboard/queue" class="view-all">View all →</a>
      </div>
      
      <div class="content-list">
        {#each queuedContent as item}
          <div class="content-card">
            <div class="card-header">
              <span class="platform-badge">{item.platform}</span>
              <span class="status-badge {item.status}">{item.status}</span>
            </div>
            <p class="content-text">{item.content.substring(0, 120)}...</p>
            <div class="card-footer">
              <span class="schedule-time">📅 {item.scheduled}</span>
              <div class="card-actions">
                <button class="icon-btn">✓</button>
                <button class="icon-btn">✏️</button>
                <button class="icon-btn">🗑️</button>
              </div>
            </div>
          </div>
        {/each}
      </div>
      
      <a href="/dashboard/generate" class="generate-btn">
        <span>✨</span>
        Generate New Content
      </a>
    </div>
    
    <!-- Recent Activity -->
    <div class="activity-section">
      <div class="section-header">
        <h2>Recent Activity</h2>
      </div>
      
      <div class="activity-list">
        {#each recentActivity as activity}
          <div class="activity-item">
            <div class="activity-icon {activity.type}">
              {#if activity.type === 'generate'}✨
              {:else if activity.type === 'approve'}✓
              {:else if activity.type === 'post'}📤
              {:else}🎭
              {/if}
            </div>
            <div class="activity-info">
              <p class="activity-action">{activity.action}</p>
              <p class="activity-target">{activity.target}</p>
              <span class="activity-time">{activity.time}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  {/if}
</div>

<style>
  .dashboard-home {
    max-width: 1200px;
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
  }

  .retry-btn {
    padding: 6px 12px;
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .retry-btn:hover {
    background: rgba(239, 68, 68, 0.3);
  }

  .loading-state {
    text-align: center;
    padding: 60px 20px;
    color: rgba(255, 255, 255, 0.6);
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    display: inline-block;
    margin-right: 12px;
    vertical-align: middle;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .stat-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s;
  }
  
  .stat-card:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
  }
  
  .stat-icon {
    font-size: 2rem;
  }
  
  .stat-value {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .stat-label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
  }
  
  .dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 32px;
  }
  
  @media (max-width: 900px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .section-header h2 {
    font-size: 1.3rem;
    font-weight: 600;
  }
  
  .view-all {
    color: #667eea;
    text-decoration: none;
    font-size: 0.9rem;
    transition: opacity 0.2s;
  }
  
  .view-all:hover {
    opacity: 0.8;
  }
  
  .content-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .content-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s;
  }
  
  .content-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.3);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .platform-badge {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  .status-badge {
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .status-badge.pending {
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
  }
  
  .status-badge.approved {
    background: rgba(72, 187, 120, 0.2);
    color: #48bb78;
  }
  
  .content-text {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
    margin-bottom: 16px;
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .schedule-time {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.85rem;
  }
  
  .card-actions {
    display: flex;
    gap: 8px;
  }
  
  .icon-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
  }
  
  .icon-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .generate-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s;
  }
  
  .generate-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  }
  
  .activity-list {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
  }
  
  .activity-item {
    display: flex;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .activity-item:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  
  .activity-icon.generate {
    background: rgba(102, 126, 234, 0.2);
  }
  
  .activity-icon.approve {
    background: rgba(72, 187, 120, 0.2);
  }
  
  .activity-icon.post {
    background: rgba(56, 189, 248, 0.2);
  }
  
  .activity-icon.create {
    background: rgba(167, 139, 250, 0.2);
  }
  
  .activity-action {
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .activity-target {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    margin-bottom: 4px;
  }
  
  .activity-time {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.8rem;
  }
</style>
