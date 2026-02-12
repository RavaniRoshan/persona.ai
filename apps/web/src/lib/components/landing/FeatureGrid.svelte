<script lang="ts">
  import { features } from '$lib/data/landing';
  import { inview } from '$lib/actions/inview';

  let isVisible = false;

  const icons = {
    sparkles: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`,
    zap: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
    calendar: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
    'check-circle': `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  };
</script>

<section 
  id="features" 
  class="py-32 bg-slate-950 relative overflow-hidden"
  use:inview={{ once: true }}
  on:inview={() => isVisible = true}
>
  <!-- Background Elements -->
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
  <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]"></div>
  <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>

  <div class="relative max-w-7xl mx-auto px-6">
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-20 space-y-4">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm shadow-xl mb-4">
        <span class="text-xs font-mono text-violet-400 uppercase tracking-widest">Core Capabilities</span>
      </div>
      
      <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
        Everything you need to<br>
        <span class="text-gradient">scale your voice</span>
      </h2>
      
      <p class="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
        From deep style analysis to intelligent scheduling, PersonaMirror gives you complete control over your digital presence with enterprise-grade tools.
      </p>
    </div>

    <!-- Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
      <!-- Large Feature Card (Style Learning) -->
      <div 
        class="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 transition-all hover:border-slate-600 opacity-0"
        class:animate-fade-up={isVisible}
        style="animation-delay: 0.1s; animation-fill-mode: forwards;"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
        
        <div class="relative z-10 h-full flex flex-col">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          
          <h3 class="text-2xl font-bold text-white mb-3">Intelligent Style Learning</h3>
          <p class="text-slate-400 mb-8 flex-grow leading-relaxed">
            Our advanced AI analyzes your writing patterns, vocabulary choices, and sentence structures to create a digital twin of your voice. The more content you feed it, the more accurate it becomes.
          </p>
          
          <!-- Mock Visualization -->
          <div class="glass-panel rounded-2xl p-5 border border-slate-700/50 bg-slate-950/50">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-slate-400">Voice Match Accuracy</span>
              <span class="text-sm font-bold text-emerald-400">98.5%</span>
            </div>
            
            <div class="h-2 bg-slate-800/50 rounded-full overflow-hidden mb-6">
              <div class="h-full w-[98.5%] bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full relative">
                <div class="absolute inset-0 bg-white/20 animate-shimmer"></div>
              </div>
            </div>
            
            <div class="grid grid-cols-3 gap-3">
              {#each ['Tone', 'Cadence', 'Vocabulary'] as metric}
                <div class="bg-slate-900/50 rounded-xl p-3 text-center border border-slate-800/50">
                  <p class="text-xs text-slate-500 mb-1">{metric}</p>
                  <p class="text-sm font-semibold text-white">Matched</p>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- Regular Feature Cards -->
      {#each features as feature, i}
        <div 
          class="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 transition-all hover:border-slate-600 opacity-0"
          class:animate-fade-up={isVisible}
          style="animation-delay: {(i + 2) * 0.1}s; animation-fill-mode: forwards;"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div class="relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-300 mb-6 group-hover:text-violet-400 group-hover:bg-slate-800/80 group-hover:scale-110 transition-all duration-300 border border-slate-700/50">
              {@html icons[feature.icon]}
            </div>
            
            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-violet-200 transition-colors">{feature.title}</h3>
            <p class="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
          </div>
        </div>
      {/each}

      <!-- Security Card -->
      <div 
        class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 p-8 transition-all hover:border-emerald-500/30 opacity-0"
        class:animate-fade-up={isVisible}
        style="animation-delay: 0.6s; animation-fill-mode: forwards;"
      >
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_40%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div class="relative z-10">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          
          <h3 class="text-xl font-bold text-white mb-2 group-hover:text-emerald-200 transition-colors">Enterprise Security</h3>
          <p class="text-sm text-slate-400 leading-relaxed">SOC 2 Type II certified with end-to-end encryption. Your voice data never leaves our secure enclave.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-up {
    animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
</style>
