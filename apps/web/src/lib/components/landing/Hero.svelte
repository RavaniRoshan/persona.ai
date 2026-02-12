<script lang="ts">
  import { onMount } from 'svelte';
  import DashboardPreview from './DashboardPreview.svelte';
  import { inview } from '$lib/actions/inview';

  let isVisible = false;
</script>

<section 
  id="hero" 
  class="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center justify-center"
  use:inview={{ once: true }}
  on:inview={() => isVisible = true}
>
  <!-- Background Elements -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950"></div>
  <div class="absolute inset-0 lg:bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
  
  <!-- Animated Orbs -->
  <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen"></div>
  <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen" style="animation-delay: 2s;"></div>
  
  <div class="relative max-w-7xl mx-auto px-6 w-full">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <!-- Left Content -->
      <div class="space-y-8 relative z-10">
        <!-- Status Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm shadow-xl animate-fade-in hover:border-violet-500/50 transition-colors cursor-default" style="animation-delay: 0.1s;">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span class="text-xs font-mono text-slate-300 uppercase tracking-wider">AI Model v2.0 Live</span>
        </div>

        <!-- Main Headline -->
        <div class="space-y-6">
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-fade-up" style="animation-delay: 0.2s;">
            Scale Your <br class="hidden lg:block" />
            <span class="relative inline-block">
              <span class="absolute -inset-1 blur-2xl bg-gradient-to-r from-violet-600 to-blue-600 opacity-50"></span>
              <span class="relative text-gradient">Digital Persona</span>
            </span>
          </h1>
          <p class="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed animate-fade-up text-balance" style="animation-delay: 0.3s;">
            Train an AI twin that learns your unique voice and style. Generate authentic content 24/7 without burning out.
            <span class="text-slate-300">Your audience won't know the difference.</span>
          </p>
        </div>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 animate-fade-up pt-2" style="animation-delay: 0.4s;">
          <a 
            href="/signup" 
            class="btn-primary px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
          >
            <span class="relative z-10">Start Training Free</span>
            <svg class="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
            <div class="btn-primary-glow"></div>
          </a>
          
          <button class="px-8 py-4 rounded-xl font-semibold text-lg text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            How it works
          </button>
        </div>

        <!-- Trust Signals -->
        <div class="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 animate-fade-up border-t border-slate-800/50" style="animation-delay: 0.5s;">
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              {#each [1,2,3,4] as i}
                <div class="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-slate-400">
                  U{i}
                </div>
              {/each}
            </div>
            <div class="text-sm">
              <span class="block text-white font-semibold">10k+ Creators</span>
              <span class="text-slate-500">Trust Persona.ai</span>
            </div>
          </div>
          <div class="h-8 w-px bg-slate-800/50 hidden sm:block"></div>
          <div class="flex items-center gap-1.5 text-sm text-slate-400">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            No credit card required
          </div>
        </div>
      </div>

      <!-- Right Content - Dashboard Preview -->
      <div class="relative lg:h-[600px] flex items-center justify-center perspective-1000 animate-fade-in" style="animation-delay: 0.6s;">
        <!-- Glowing background behind preview -->
        <div class="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-blue-500/10 rounded-full blur-3xl transform rotate-12"></div>
        
        <div class="relative w-full transform transition-all duration-700 hover:rotate-y-2 hover:rotate-x-2 preserve-3d">
          <DashboardPreview />
          
          <!-- Floating Elements -->
          <div class="absolute -right-8 top-20 glass-panel p-4 rounded-xl shadow-2xl animate-float" style="animation-delay: 1s;">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-slate-400">Post Generated</p>
                <p class="text-sm font-bold text-white">LinkedIn Thread</p>
              </div>
            </div>
          </div>
          
          <div class="absolute -left-8 bottom-32 glass-panel p-4 rounded-xl shadow-2xl animate-float-slow" style="animation-delay: 2s;">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-slate-400">Voice Match</p>
                <p class="text-sm font-bold text-white">98.5% Accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
