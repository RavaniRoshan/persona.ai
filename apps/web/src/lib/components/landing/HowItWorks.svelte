<script lang="ts">
  import { steps } from '$lib/data/landing';
  import { inview } from '$lib/actions/inview';

  let isVisible = false;
</script>

<section 
  id="how-it-works" 
  class="py-32 bg-slate-950 relative overflow-hidden"
  use:inview={{ once: true }}
  on:inview={() => isVisible = true}
>
  <!-- Background Elements -->
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
  
  <div class="max-w-7xl mx-auto px-6 relative z-10">
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-20 space-y-4">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm shadow-xl mb-4">
        <span class="text-xs font-mono text-violet-400 uppercase tracking-widest">Process</span>
      </div>
      
      <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
        Three steps to your<br>
        <span class="text-gradient">AI twin</span>
      </h2>
      
      <p class="text-lg text-slate-400 max-w-2xl mx-auto">
        Getting started is simple. Our AI learns your style and starts generating authentic content in minutes.
      </p>
    </div>

    <!-- Steps Grid -->
    <div class="grid md:grid-cols-3 gap-8 relative">
      <!-- Connecting Line (Desktop) -->
      <div class="hidden md:block absolute top-[2.25rem] left-1/4 right-1/4 h-px bg-gradient-to-r from-violet-600/50 via-blue-600/50 to-violet-600/50 border-t border-dashed border-slate-700/50 z-0"></div>

      {#each steps as step, i}
        <div 
          class="relative opacity-0 z-10"
          class:animate-fade-up={isVisible}
          style="animation-delay: {i * 0.2}s; animation-fill-mode: forwards;"
        >
          <!-- Step Card -->
          <div class="relative h-full bg-slate-900/50 rounded-3xl p-8 border border-slate-800 hover:border-violet-500/30 hover:bg-slate-900/80 transition-all duration-300 group backdrop-blur-sm">
            <!-- Number Circle -->
            <div class="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xl text-white shadow-lg group-hover:scale-110 group-hover:bg-violet-600 group-hover:border-violet-500 transition-all duration-300 mb-8 relative z-20">
              <span class="relative z-10">{step.number}</span>
              <div class="absolute inset-0 bg-violet-600 blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
            </div>

            <!-- Content -->
            <h3 class="text-xl font-bold text-white mb-4 group-hover:text-violet-200 transition-colors">{step.title}</h3>
            <p class="text-slate-400 leading-relaxed">{step.description}</p>
            
            <!-- Icon Decoration -->
            <div class="absolute top-8 right-8 text-slate-800 group-hover:text-violet-500/20 transition-colors duration-300 transform group-hover:rotate-12">
               {#if i === 0}
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              {:else if i === 1}
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              {:else}
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              {/if}
            </div>
          </div>
        </div>
      {/each}
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
