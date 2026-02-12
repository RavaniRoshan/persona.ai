<script lang="ts">
  import { testimonials } from '$lib/data/landing';
  import { inview } from '$lib/actions/inview';

  let isVisible = false;

  // Split testimonials into two columns
  const leftColumn = testimonials.filter((_, i) => i % 2 === 0);
  const rightColumn = testimonials.filter((_, i) => i % 2 !== 0);
</script>

<section 
  id="testimonials" 
  class="py-32 bg-slate-950 overflow-hidden relative"
  use:inview={{ once: true }}
  on:inview={() => isVisible = true}
>
  <!-- Background Glow -->
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none"></div>

  <div class="max-w-7xl mx-auto px-6 relative z-10">
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm shadow-xl mb-4">
        <span class="text-xs font-mono text-violet-400 uppercase tracking-widest">Community</span>
      </div>
      
      <h2 class="text-4xl md:text-5xl font-bold text-white">
        Loved by creators<br>
        <span class="text-gradient">worldwide</span>
      </h2>
      
      <p class="text-lg text-slate-400">
        See what our users are saying about their experience with PersonaMirror.
      </p>
    </div>

    <!-- Testimonials Grid with Infinite Scroll -->
    <div class="relative h-[600px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
      <!-- Gradient Masks -->
      <div class="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-slate-950 to-transparent z-10 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none"></div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Left Column - Scroll Up -->
        <div class="space-y-6 animate-scroll-up" style="animation-play-state: {isVisible ? 'running' : 'paused'};">
          {#each [...leftColumn, ...leftColumn, ...leftColumn] as testimonial}
            <div class="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 shadow-sm hover:border-violet-500/30 transition-all hover:bg-slate-900/80 group">
              <!-- Stars -->
              <div class="flex gap-1 mb-6">
                {#each Array(5) as _}
                  <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                {/each}
              </div>
              
              <!-- Quote -->
              <p class="text-slate-300 mb-8 leading-relaxed text-lg italic">"{testimonial.quote}"</p>
              
              <!-- Author -->
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <p class="font-bold text-white group-hover:text-violet-200 transition-colors">{testimonial.author}</p>
                  <p class="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Right Column - Scroll Down -->
        <div class="space-y-6 animate-scroll-down hidden md:block" style="animation-play-state: {isVisible ? 'running' : 'paused'};">
          {#each [...rightColumn, ...rightColumn, ...rightColumn] as testimonial}
            <div class="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 shadow-sm hover:border-violet-500/30 transition-all hover:bg-slate-900/80 group">
              <!-- Stars -->
              <div class="flex gap-1 mb-6">
                {#each Array(5) as _}
                  <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                {/each}
              </div>
              
              <!-- Quote -->
              <p class="text-slate-300 mb-8 leading-relaxed text-lg italic">"{testimonial.quote}"</p>
              
              <!-- Author -->
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <p class="font-bold text-white group-hover:text-violet-200 transition-colors">{testimonial.author}</p>
                  <p class="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  @keyframes scrollUp {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-33.333%);
    }
  }

  @keyframes scrollDown {
    0% {
      transform: translateY(-33.333%);
    }
    100% {
      transform: translateY(0);
    }
  }

  .animate-scroll-up {
    animation: scrollUp 40s linear infinite;
  }

  .animate-scroll-down {
    animation: scrollDown 40s linear infinite;
  }

  .animate-scroll-up:hover,
  .animate-scroll-down:hover {
    animation-play-state: paused !important;
  }
</style>
