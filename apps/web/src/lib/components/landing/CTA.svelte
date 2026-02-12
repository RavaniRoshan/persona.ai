<script lang="ts">
  import { inview } from '$lib/actions/inview';
  let isVisible = false;
</script>

<section 
  class="py-32 bg-slate-950 relative overflow-hidden"
  use:inview={{ once: true }}
  on:inview={() => isVisible = true}
>
  <!-- Background Elements -->
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>

  <div class="relative max-w-4xl mx-auto px-6 text-center z-10">
    <div class="opacity-0 space-y-8" class:animate-fade-up={isVisible} style="animation-fill-mode: forwards;">
      
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm shadow-xl">
        <span class="text-xs font-mono text-violet-400 uppercase tracking-widest">Get Started</span>
      </div>

      <h2 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
        Ready to scale<br>
        <span class="text-gradient">your digital twin?</span>
      </h2>
      
      <p class="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Join 500+ creators who are already using PersonaMirror to grow their presence authentically. Start your free trial today.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-5 justify-center pt-8">
        <a 
          href="/signup" 
          class="group relative bg-white text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-violet-500/20 hover:-translate-y-1 overflow-hidden"
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            Start Free Trial
            <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-violet-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </a>
        
        <button class="px-8 py-4 rounded-xl font-bold text-lg text-white border border-slate-800 hover:border-slate-600 hover:bg-slate-900/50 transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
          Schedule a Demo
        </button>
      </div>
      
      <div class="pt-8 flex items-center justify-center gap-8 text-sm text-slate-500">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          14-day free trial
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          No credit card required
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
