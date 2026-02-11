<script>
  import { onMount } from 'svelte';
  
  // Platform data for approval queue section
  const platforms = [
    {
      name: 'X/Twitter',
      handle: '@XTester',
      status: 'New Post',
      content: 'The future of social management isn\'t just automation - it\'s personalization at scale, human oversight, and the power to build genuine connection. Here\'s what I\'m most excited about...',
      avatar: 'X',
      color: '#1d9bf0'
    },
    {
      name: 'LinkedIn',
      handle: '@PersonaMirror',
      status: 'New Post',
      content: 'We\'re excited to announce PersonaMirror Agent. We\'ve spent months perfecting this technology to ensure authentic, high-engagement professional content that sounds like you - not a bot. Create posts without diluting your authority.',
      avatar: 'in',
      color: '#0a66c2'
    },
    {
      name: 'Instagram',
      handle: '@insta_pro',
      status: 'Comment',
      content: 'Behind the scenes of how AI changed my content game. The truth about automation and authenticity...',
      avatar: 'IG',
      color: '#e4405f'
    }
  ];

  // Process steps
  const processSteps = [
    {
      title: 'Style Absorption',
      description: 'Upload past posts to train your unique linguistic fingerprint. We analyze your syntax, word usage, humor, and values.',
      icon: '📝'
    },
    {
      title: 'Content Synthesis',
      description: 'AI merges trending topics & prompts with your persona. Generate posts, comments, and replies that sound exactly like you.',
      icon: '✨'
    },
    {
      title: 'Strategic Queuing',
      description: 'Smart scheduling based on engagement data. Queue drafts, review in your approval hub, and post when the moment is right.',
      icon: '📅'
    }
  ];

  // Trust features
  const trustFeatures = [
    {
      title: 'Bring Your Own Key',
      description: 'Use your own OpenAI, Anthropic, or local LLM API keys. We never store or access your credentials.',
      icon: '🔑'
    },
    {
      title: 'Privacy-First Architecture',
      description: 'Your data stays yours. We use end-to-end encryption and never train models on your content.',
      icon: '🛡️'
    },
    {
      title: 'Zero-Token Pricing',
      description: 'No markup on LLM costs. You pay exactly what the API providers charge - nothing more.',
      icon: '💰'
    },
    {
      title: 'Model Flexibility',
      description: 'Switch between GPT-4, Claude, or local models anytime. No vendor lock-in.',
      icon: '⚙️'
    }
  ];

  let scrollY = 0;
  let visibleSections = new Set();

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
            visibleSections = visibleSections;
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  });
</script>

<svelte:window bind:scrollY />

<main class="landing-page">
  <!-- Navigation -->
  <nav class="navbar">
    <div class="nav-container">
      <div class="logo">
        <span class="logo-icon">👤</span>
        <span class="logo-text">PersonaMirror</span>
      </div>
      <div class="nav-links">
        <a href="#process">Process</a>
        <a href="#queue">Queue</a>
        <a href="#trust">Security</a>
      </div>
      <button class="nav-cta">Login</button>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="hero" class="hero">
    <div class="hero-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <div class="hero-content">
      <div class="badge">🔒 PERSONAL ACCESS</div>
      
      <h1 class="hero-title">
        <span class="gradient-text">AUTONOMOUS</span><br>
        <span class="outline-text">SOCIAL MEDIA</span><br>
        <span class="gradient-text">IN YOUR VOICE</span>
      </h1>
      
      <p class="hero-description">
        Train an AI on your unique linguistic fingerprint. Create, comment, & curate to 
        increase engagement, and manage your approval queue across platforms.
      </p>
      
      <button class="cta-button">
        Get Started For Free
        <span class="arrow">→</span>
      </button>
      
      <p class="hero-subtext">No credit card required</p>
    </div>

    <!-- Abstract visual element -->
    <div class="hero-visual">
      <div class="wave-container">
        <svg viewBox="0 0 400 200" class="wave-svg">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.8" />
              <stop offset="50%" style="stop-color:#764ba2;stop-opacity:0.6" />
              <stop offset="100%" style="stop-color:#f093fb;stop-opacity:0.4" />
            </linearGradient>
          </defs>
          <path class="wave wave-1" d="M0,100 Q100,50 200,100 T400,100" fill="none" stroke="url(#waveGradient)" stroke-width="2"/>
          <path class="wave wave-2" d="M0,120 Q100,70 200,120 T400,120" fill="none" stroke="url(#waveGradient)" stroke-width="2" opacity="0.6"/>
          <path class="wave wave-3" d="M0,140 Q100,90 200,140 T400,140" fill="none" stroke="url(#waveGradient)" stroke-width="2" opacity="0.3"/>
        </svg>
      </div>
    </div>
  </section>

  <!-- Process Section -->
  <section id="process" class="process section" class:visible={visibleSections.has('process')}>
    <div class="container">
      <div class="section-header">
        <span class="section-badge">⚡ THE SYSTEM</span>
        <h2 class="section-title">
          THE MIRRORING<br>
          <span class="gradient-text">PROCESS</span>
        </h2>
        <p class="section-description">
          PersonaMirror doesn't just write - it absorbs your essence. Here's how our 
          advanced neural analysis mirrors you.
        </p>
      </div>

      <div class="process-steps">
        {#each processSteps as step, i}
          <div class="process-card" style="--delay: {i * 0.2}s">
            <div class="step-number">0{i + 1}</div>
            <div class="step-icon">{step.icon}</div>
            <h3 class="step-title">{step.title}</h3>
            <p class="step-description">{step.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Approval Queue Section -->
  <section id="queue" class="queue section" class:visible={visibleSections.has('queue')}>
    <div class="container">
      <div class="section-header">
        <span class="section-badge">🎮 USER CONTROL</span>
        <h2 class="section-title">
          YOUR APPROVAL<br>
          <span class="gradient-text">QUEUE</span>
        </h2>
        <p class="section-description">
          You stay in total control. Review, edit, and approve every generated post.
        </p>
      </div>

      <div class="platform-cards">
        {#each platforms as platform, i}
          <div class="platform-card" style="--delay: {i * 0.15}s; --platform-color: {platform.color}">
            <div class="card-header">
              <div class="platform-info">
                <div class="platform-avatar" style="background: {platform.color}">
                  {platform.avatar}
                </div>
                <div class="platform-details">
                  <h4 class="platform-name">{platform.name}</h4>
                  <span class="platform-handle">{platform.handle}</span>
                </div>
              </div>
              <span class="status-badge">{platform.status}</span>
            </div>
            
            <div class="card-content">
              <p class="post-content">{platform.content}</p>
            </div>
            
            <div class="card-actions">
              <button class="action-btn approve">APPROVE</button>
              <button class="action-btn edit">EDIT</button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Trust Section -->
  <section id="trust" class="trust section" class:visible={visibleSections.has('trust')}>
    <div class="container">
      <div class="section-header">
        <span class="section-badge">🔐 TRUST & SECURITY</span>
        <h2 class="section-title">
          Enterprise-Grade Security<br>
          for <span class="gradient-text">Personal AI</span>
        </h2>
      </div>

      <div class="trust-grid">
        {#each trustFeatures as feature, i}
          <div class="trust-card" style="--delay: {i * 0.1}s">
            <div class="trust-icon">{feature.icon}</div>
            <h3 class="trust-title">{feature.title}</h3>
            <p class="trust-description">{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section id="cta" class="cta section" class:visible={visibleSections.has('cta')}>
    <div class="cta-background">
      <div class="gradient-orb cta-orb"></div>
    </div>
    
    <div class="container">
      <div class="cta-content">
        <h2 class="cta-title">
          SCALE YOUR<br>
          PRESENCE<br>
          <span class="gradient-text">WITHOUT</span><br>
          LOSING YOUR<br>
          SOUL.
        </h2>
        
        <p class="cta-description">
          Join the private beta and start generating voice-consistent content today.
        </p>
        
        <button class="cta-button large">
          Start Mirroring Now
          <span class="arrow">→</span>
        </button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="logo-icon">👤</span>
          <span class="logo-text">PersonaMirror</span>
        </div>
        
        <div class="footer-links">
          <a href="https://twitter.com/personamirror" target="_blank">Twitter</a>
          <a href="https://linkedin.com/company/personamirror" target="_blank">LinkedIn</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 PersonaMirror. All rights reserved.</p>
      </div>
    </div>
  </footer>
</main>

<style>
  /* Global Styles */
  :global(body) {
    margin: 0;
    padding: 0;
    background: #0a0a0f;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow-x: hidden;
  }

  /* Navigation */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 20px 40px;
    background: rgba(10, 10, 15, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 1.2rem;
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .nav-links {
    display: flex;
    gap: 30px;
  }

  .nav-links a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: color 0.3s;
  }

  .nav-links a:hover {
    color: #ffffff;
  }

  .nav-cta {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 10px 24px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .nav-cta:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }

  /* Hero Section */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 120px 40px 80px;
    overflow: hidden;
  }

  .hero-background {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .gradient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.5;
  }

  .orb-1 {
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    top: -200px;
    right: -200px;
  }

  .orb-2 {
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    bottom: -100px;
    left: -100px;
  }

  .orb-3 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    top: 50%;
    left: 30%;
    opacity: 0.3;
  }

  .hero-content {
    text-align: center;
    max-width: 900px;
    z-index: 1;
  }

  .badge {
    display: inline-block;
    padding: 8px 16px;
    background: rgba(102, 126, 234, 0.2);
    border: 1px solid rgba(102, 126, 234, 0.3);
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 30px;
  }

  .hero-title {
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 900;
    line-height: 1;
    margin-bottom: 30px;
    letter-spacing: -2px;
  }

  .gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .outline-text {
    -webkit-text-stroke: 2px rgba(255, 255, 255, 0.3);
    color: transparent;
  }

  .hero-description {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.7);
    max-width: 600px;
    margin: 0 auto 40px;
    line-height: 1.6;
  }

  .cta-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    padding: 18px 40px;
    border-radius: 50px;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
  }

  .cta-button.large {
    padding: 20px 48px;
    font-size: 1.2rem;
  }

  .arrow {
    transition: transform 0.3s;
  }

  .cta-button:hover .arrow {
    transform: translateX(5px);
  }

  .hero-subtext {
    margin-top: 20px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
  }

  .hero-visual {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 300px;
    opacity: 0.6;
    pointer-events: none;
  }

  .wave-container {
    width: 100%;
    height: 100%;
  }

  .wave-svg {
    width: 100%;
    height: 100%;
  }

  .wave {
    animation: wave 8s ease-in-out infinite;
  }

  .wave-2 {
    animation-delay: -2s;
  }

  .wave-3 {
    animation-delay: -4s;
  }

  @keyframes wave {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-50px); }
  }

  /* Section Styles */
  .section {
    padding: 120px 40px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
  }

  .section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 80px;
  }

  .section-badge {
    display: inline-block;
    padding: 6px 14px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 20px;
    color: rgba(255, 255, 255, 0.8);
  }

  .section-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 20px;
  }

  .section-description {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.6);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* Process Section */
  .process-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }

  .process-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 40px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .process-card:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-5px);
    border-color: rgba(102, 126, 234, 0.3);
  }

  .step-number {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 4rem;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.05);
    line-height: 1;
  }

  .step-icon {
    font-size: 3rem;
    margin-bottom: 20px;
  }

  .step-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 15px;
  }

  .step-description {
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
  }

  /* Queue Section */
  .queue {
    background: linear-gradient(180deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%);
  }

  .platform-cards {
    display: flex;
    flex-direction: column;
    gap: 30px;
    max-width: 700px;
    margin: 0 auto;
  }

  .platform-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 24px;
    transition: all 0.3s ease;
    border-left: 3px solid var(--platform-color);
  }

  .platform-card:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(10px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .platform-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .platform-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    color: white;
  }

  .platform-details h4 {
    margin: 0;
    font-size: 1rem;
  }

  .platform-handle {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .status-badge {
    padding: 4px 12px;
    background: rgba(102, 126, 234, 0.2);
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #667eea;
  }

  .post-content {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
    margin-bottom: 20px;
  }

  .card-actions {
    display: flex;
    gap: 12px;
  }

  .action-btn {
    padding: 8px 20px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
  }

  .action-btn.approve {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .action-btn.edit {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.7);
  }

  .action-btn:hover {
    transform: scale(1.05);
  }

  /* Trust Section */
  .trust-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
  }

  .trust-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 30px;
    transition: all 0.3s ease;
  }

  .trust-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.3);
  }

  .trust-icon {
    font-size: 2.5rem;
    margin-bottom: 15px;
  }

  .trust-title {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .trust-description {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.95rem;
    line-height: 1.5;
  }

  /* CTA Section */
  .cta {
    position: relative;
    padding: 150px 40px;
    text-align: center;
    overflow: hidden;
  }

  .cta-background {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .cta-orb {
    width: 800px;
    height: 800px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.2;
  }

  .cta-content {
    position: relative;
    z-index: 1;
  }

  .cta-title {
    font-size: clamp(3rem, 6vw, 5rem);
    font-weight: 900;
    line-height: 1;
    margin-bottom: 30px;
  }

  .cta-description {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 40px;
  }

  /* Footer */
  .footer {
    padding: 60px 40px 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .footer-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 1.2rem;
  }

  .footer-links {
    display: flex;
    gap: 30px;
  }

  .footer-links a {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    transition: color 0.3s;
  }

  .footer-links a:hover {
    color: #ffffff;
  }

  .footer-bottom {
    text-align: center;
    padding-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.9rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .navbar {
      padding: 15px 20px;
    }

    .nav-links {
      display: none;
    }

    .hero {
      padding: 100px 20px 60px;
    }

    .section {
      padding: 80px 20px;
    }

    .process-steps {
      grid-template-columns: 1fr;
    }

    .trust-grid {
      grid-template-columns: 1fr;
    }

    .footer-content {
      flex-direction: column;
      text-align: center;
    }

    .footer-links {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
