<script>
  import { onMount } from 'svelte';
  
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  });

  const features = [
    {
      title: 'Style Absorption',
      description: 'Upload your past posts and let our AI learn your unique voice, tone, and writing patterns.',
      icon: '📝'
    },
    {
      title: 'Content Generation',
      description: 'Generate platform-specific content that sounds exactly like you, at scale.',
      icon: '✨'
    },
    {
      title: 'Smart Scheduling',
      description: 'Queue your content and let our AI post at optimal times for maximum engagement.',
      icon: '📅'
    },
    {
      title: 'Approval Workflow',
      description: 'Review, edit, and approve every post before it goes live. Full control.',
      icon: '✓'
    }
  ];

  const testimonials = [
    {
      quote: "PersonaMirror has completely transformed how I manage my social presence. It sounds exactly like me.",
      author: "Sarah Chen",
      role: "Tech Founder",
      avatar: "SC"
    },
    {
      quote: "The best AI tool I've used. It actually captured my voice and helps me stay consistent.",
      author: "Marcus Johnson",
      role: "Content Creator",
      avatar: "MJ"
    },
    {
      quote: "Saved me 10+ hours per week while maintaining authentic engagement with my audience.",
      author: "Emily Rodriguez",
      role: "Marketing Director",
      avatar: "ER"
    }
  ];

  const integrations = [
    { name: 'LinkedIn', icon: '💼' },
    { name: 'X/Twitter', icon: '🐦' },
    { name: 'Instagram', icon: '📸' },
    { name: 'Notion', icon: '📝' },
    { name: 'Slack', icon: '💬' },
    { name: 'Zapier', icon: '⚡' }
  ];
</script>

<main class="min-h-screen bg-white text-slate-900">
  
  <!-- Navigation -->
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold">
          P
        </div>
        <span class="font-bold text-lg text-slate-900">PersonaMirror</span>
      </a>
      
      <div class="hidden md:flex items-center gap-8">
        <a href="#features" class="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">Features</a>
        <a href="#how-it-works" class="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">How it works</a>
        <a href="#testimonials" class="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">Testimonials</a>
        <a href="#pricing" class="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">Pricing</a>
      </div>
      
      <div class="flex items-center gap-4">
        <a href="/dashboard" class="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sign in</a>
        <a href="/dashboard" class="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md">
          Get Started
        </a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="hero" class="pt-32 pb-20 px-6 bg-gradient-to-b from-violet-50/50 to-white">
    <div class="max-w-7xl mx-auto">
      <!-- Announcement Badge -->
      <div class="flex justify-center mb-8">
        <a href="#" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium hover:bg-violet-200 transition-colors">
          <span class="flex h-2 w-2 rounded-full bg-violet-600 animate-pulse"></span>
          New: Claude 3.5 Sonnet Support
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      </div>

      <!-- Main Headline -->
      <div class="text-center max-w-4xl mx-auto mb-16">
        <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
          AI-Powered Social Media<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">In Your Voice</span>
        </h1>
        <p class="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Train an AI that learns your unique style. Generate authentic content, manage approval queues, and scale your presence without losing your voice.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/dashboard" class="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-violet-500/25 flex items-center justify-center gap-2">
            Start Creating
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </a>
          <button class="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Watch Demo
          </button>
        </div>
      </div>

      <!-- Hero Image / Dashboard Preview -->
      <div class="relative max-w-5xl mx-auto">
        <div class="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <!-- Window Chrome -->
          <div class="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
            <div class="flex gap-2">
              <div class="w-3 h-3 rounded-full bg-red-400"></div>
              <div class="w-3 h-3 rounded-full bg-amber-400"></div>
              <div class="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div class="flex-1 text-center">
              <span class="text-xs text-slate-400 font-mono">personamirror.ai/dashboard</span>
            </div>
          </div>
          <!-- Dashboard Preview -->
          <div class="p-6 bg-slate-50/50">
            <div class="grid grid-cols-3 gap-4">
              <!-- Sidebar -->
              <div class="col-span-1 bg-white rounded-xl p-4 border border-slate-200">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold">JD</div>
                  <div>
                    <p class="font-semibold text-sm">John Doe</p>
                    <p class="text-xs text-slate-500">Pro Plan</p>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-50 text-violet-700 text-sm font-medium">
                    <span>📊</span> Dashboard
                  </div>
                  <div class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 text-sm">
                    <span>🎭</span> Personas
                  </div>
                  <div class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 text-sm">
                    <span>✨</span> Generate
                  </div>
                  <div class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 text-sm">
                    <span>📋</span> Queue
                  </div>
                </div>
              </div>
              <!-- Main Content -->
              <div class="col-span-2 space-y-4">
                <!-- Stats Row -->
                <div class="grid grid-cols-3 gap-3">
                  <div class="bg-white rounded-xl p-4 border border-slate-200">
                    <p class="text-xs text-slate-500 mb-1">Queued Posts</p>
                    <p class="text-2xl font-bold text-slate-900">12</p>
                  </div>
                  <div class="bg-white rounded-xl p-4 border border-slate-200">
                    <p class="text-xs text-slate-500 mb-1">Published</p>
                    <p class="text-2xl font-bold text-slate-900">48</p>
                  </div>
                  <div class="bg-white rounded-xl p-4 border border-slate-200">
                    <p class="text-xs text-slate-500 mb-1">Engagement</p>
                    <p class="text-2xl font-bold text-green-600">+23%</p>
                  </div>
                </div>
                <!-- Recent Content -->
                <div class="bg-white rounded-xl p-4 border border-slate-200">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold text-slate-900">Pending Approval</h3>
                    <span class="text-xs text-violet-600 font-medium bg-violet-50 px-2 py-1 rounded-full">3 items</span>
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div class="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold">𝕏</div>
                      <div class="flex-1">
                        <p class="text-sm text-slate-700 line-clamp-2">The future of social media isn't automation—it's personalization at scale. Here's how AI is changing the game...</p>
                        <div class="flex gap-2 mt-2">
                          <button class="px-3 py-1 bg-violet-600 text-white text-xs rounded-lg font-medium">Approve</button>
                          <button class="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs rounded-lg">Edit</button>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div class="w-8 h-8 rounded-full bg-[#0a66c2] flex items-center justify-center text-white text-xs font-bold">in</div>
                      <div class="flex-1">
                        <p class="text-sm text-slate-700 line-clamp-2">Excited to share that we've been working on something special. After 6 months of development...</p>
                        <div class="flex gap-2 mt-2">
                          <button class="px-3 py-1 bg-violet-600 text-white text-xs rounded-lg font-medium">Approve</button>
                          <button class="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs rounded-lg">Edit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Badges -->
      <div class="mt-16 text-center">
        <p class="text-sm text-slate-500 mb-6">Trusted by 500+ creators and teams</p>
        <div class="flex flex-wrap justify-center items-center gap-8 opacity-50">
          <div class="flex items-center gap-2 text-slate-400 font-semibold">
            <span class="text-2xl">⚡</span> Stripe
          </div>
          <div class="flex items-center gap-2 text-slate-400 font-semibold">
            <span class="text-2xl">🚀</span> Vercel
          </div>
          <div class="flex items-center gap-2 text-slate-400 font-semibold">
            <span class="text-2xl">💎</span> Notion
          </div>
          <div class="flex items-center gap-2 text-slate-400 font-semibold">
            <span class="text-2xl">🐙</span> GitHub
          </div>
          <div class="flex items-center gap-2 text-slate-400 font-semibold">
            <span class="text-2xl">🎯</span> Linear
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-24 px-6 bg-white">
    <div class="max-w-7xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-violet-600 font-semibold text-sm uppercase tracking-wider">Features</span>
        <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mt-3 mb-4">
          Everything you need to scale your voice
        </h2>
        <p class="text-lg text-slate-600">
          From style absorption to intelligent scheduling, PersonaMirror gives you complete control over your social presence.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {#each features as feature, i}
          <div class="group p-8 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-violet-200 hover:bg-white hover:shadow-xl transition-all duration-300">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
            <p class="text-slate-600 leading-relaxed text-lg">{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- How It Works Section -->
  <section id="how-it-works" class="py-24 px-6 bg-slate-50">
    <div class="max-w-7xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-violet-600 font-semibold text-sm uppercase tracking-wider">How It Works</span>
        <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mt-3 mb-4">
          Three steps to your AI twin
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Step 1 -->
        <div class="relative">
          <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div class="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xl mb-6">1</div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Upload Your Content</h3>
            <p class="text-slate-600">Paste your past posts, articles, or any writing samples. The more you share, the better your AI learns.</p>
          </div>
          <div class="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-300"></div>
        </div>

        <!-- Step 2 -->
        <div class="relative">
          <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div class="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xl mb-6">2</div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">AI Creates Content</h3>
            <p class="text-slate-600">Tell us what you want to post about. Our AI generates content that matches your unique voice and style.</p>
          </div>
          <div class="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-300"></div>
        </div>

        <!-- Step 3 -->
        <div>
          <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div class="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xl mb-6">3</div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Review & Approve</h3>
            <p class="text-slate-600">Check the generated content in your queue, make edits if needed, and approve for posting.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Integrations Section -->
  <section id="integrations" class="py-24 px-6 bg-white">
    <div class="max-w-7xl mx-auto text-center">
      <span class="text-violet-600 font-semibold text-sm uppercase tracking-wider">Integrations</span>
      <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mt-3 mb-4">
        Works with your favorite tools
      </h2>
      <p class="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
        Connect PersonaMirror with the platforms you already use. One-click integrations with popular social media and productivity tools.
      </p>

      <div class="flex flex-wrap justify-center gap-6">
        {#each integrations as integration}
          <div class="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer">
            <span class="text-3xl">{integration.icon}</span>
            <span class="font-semibold text-slate-700">{integration.name}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section id="testimonials" class="py-24 px-6 bg-slate-50">
    <div class="max-w-7xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-violet-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
        <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mt-3 mb-4">
          Loved by creators worldwide
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each testimonials as testimonial}
          <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div class="flex gap-1 mb-4">
              {#each [1,2,3,4,5] as star}
                <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              {/each}
            </div>
            <p class="text-slate-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm">
                {testimonial.avatar}
              </div>
              <div>
                <p class="font-semibold text-slate-900">{testimonial.author}</p>
                <p class="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-24 px-6 bg-slate-900">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
        Ready to scale your voice?
      </h2>
      <p class="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
        Join 500+ creators who are already using PersonaMirror to grow their presence authentically.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/dashboard" class="bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-violet-500/50">
          Get Started Free
        </a>
        <button class="bg-transparent border border-slate-600 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all">
          Schedule a Demo
        </button>
      </div>
      <p class="mt-8 text-sm text-slate-500">
        No credit card required. Free plan available.
      </p>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-white border-t border-slate-200 py-16 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        <div class="col-span-2 lg:col-span-2">
          <a href="/" class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold">P</div>
            <span class="font-bold text-xl text-slate-900">PersonaMirror</span>
          </a>
          <p class="text-slate-500 mb-6 max-w-xs">
            The autonomous social media engine that scales your personal brand without losing your authenticity.
          </p>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-violet-100 hover:text-violet-600 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-violet-100 hover:text-violet-600 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-violet-100 hover:text-violet-600 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.381-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.852-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 mb-4">Product</h4>
          <ul class="space-y-3">
            <li><a href="#features" class="text-slate-600 hover:text-violet-600 transition-colors">Features</a></li>
            <li><a href="#integrations" class="text-slate-600 hover:text-violet-600 transition-colors">Integrations</a></li>
            <li><a href="#pricing" class="text-slate-600 hover:text-violet-600 transition-colors">Pricing</a></li>
            <li><a href="#" class="text-slate-600 hover:text-violet-600 transition-colors">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 mb-4">Company</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-slate-600 hover:text-violet-600 transition-colors">About</a></li>
            <li><a href="#" class="text-slate-600 hover:text-violet-600 transition-colors">Blog</a></li>
            <li><a href="#" class="text-slate-600 hover:text-violet-600 transition-colors">Careers</a></li>
            <li><a href="#" class="text-slate-600 hover:text-violet-600 transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 mb-4">Legal</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-slate-600 hover:text-violet-600 transition-colors">Privacy</a></li>
            <li><a href="#" class="text-slate-600 hover:text-violet-600 transition-colors">Terms</a></li>
            <li><a href="#" class="text-slate-600 hover:text-violet-600 transition-colors">Security</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-slate-500 text-sm">
          © 2026 PersonaMirror. All rights reserved.
        </p>
        <div class="flex items-center gap-2 text-sm text-slate-500">
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
          All systems operational
        </div>
      </div>
    </div>
  </footer>

</main>

<style>
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
