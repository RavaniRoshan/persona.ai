<!-- Dashboard Layout -->
<script>
  import { onMount } from 'svelte';
  
  let user = null;
  let loading = true;
  
  onMount(async () => {
    // Check auth
    loading = false;
  });
</script>

<div class="dashboard">
  <aside class="sidebar">
    <div class="sidebar-header">
      <span class="logo">👤 PersonaMirror</span>
    </div>
    
    <nav class="sidebar-nav">
      <a href="/dashboard" class="nav-item active">
        <span class="icon">📊</span>
        Dashboard
      </a>
      <a href="/dashboard/personas" class="nav-item">
        <span class="icon">🎭</span>
        Personas
      </a>
      <a href="/dashboard/queue" class="nav-item">
        <span class="icon">📝</span>
        Content Queue
      </a>
      <a href="/dashboard/generate" class="nav-item">
        <span class="icon">✨</span>
        Generate
      </a>
      <a href="/dashboard/settings" class="nav-item">
        <span class="icon">⚙️</span>
        Settings
      </a>
    </nav>
  </aside>
  
  <main class="main-content">
    <slot />
  </main>
</div>

<style>
  .dashboard {
    display: flex;
    min-height: 100vh;
    background: #0a0a0f;
  }
  
  .sidebar {
    width: 260px;
    background: rgba(255, 255, 255, 0.02);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    padding: 24px;
    position: fixed;
    height: 100vh;
    overflow-y: auto;
  }
  
  .sidebar-header {
    margin-bottom: 40px;
  }
  
  .logo {
    font-size: 1.2rem;
    font-weight: 700;
  }
  
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: all 0.2s;
  }
  
  .nav-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }
  
  .nav-item.active {
    background: rgba(102, 126, 234, 0.2);
    color: white;
  }
  
  .icon {
    font-size: 1.2rem;
  }
  
  .main-content {
    flex: 1;
    margin-left: 260px;
    padding: 40px;
    min-height: 100vh;
  }
</style>
