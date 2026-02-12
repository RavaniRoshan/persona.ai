<script lang="ts">
  import { onMount } from 'svelte';

  let visibleLines = 0;
  const maxLines = 6;

  onMount(() => {
    const interval = setInterval(() => {
      if (visibleLines < maxLines) {
        visibleLines++;
      }
    }, 500);

    return () => clearInterval(interval);
  });

  const codeLines = [
    { text: '> Analyzing writing patterns...', color: 'text-violet-400' },
    { text: '> Detecting tone: Professional + Witty', color: 'text-blue-400' },
    { text: '> Extracting vocabulary signatures...', color: 'text-violet-400' },
    { text: '> Building style model...', color: 'text-blue-400' },
    { text: '> Training complete ✓', color: 'text-green-400' },
    { text: '> Ready to generate content', color: 'text-slate-400' },
  ];
</script>

<div class="relative perspective-1000">
  <!-- Glow Effect -->
  <div class="absolute -inset-4 bg-gradient-to-r from-violet-500/30 to-blue-500/30 rounded-3xl blur-2xl animate-pulse-glow"></div>
  
  <!-- 3D Card -->
  <div class="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden animate-float-slow preserve-3d">
    <!-- Window Header -->
    <div class="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center gap-3">
      <div class="flex gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
        <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
      </div>
      <div class="flex-1 flex justify-center">
        <div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 text-xs text-slate-500 font-mono">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          personamirror.ai/terminal
        </div>
      </div>
      <div class="w-16"></div>
    </div>

    <!-- Terminal Content -->
    <div class="p-6 bg-slate-950 font-mono text-sm min-h-[300px]">
      <!-- Header Info -->
      <div class="mb-4 pb-4 border-b border-slate-800">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <div>
              <p class="text-white font-semibold">AI Training Session</p>
              <p class="text-xs text-slate-500">Session ID: PM-2024-X7K9</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span class="text-xs text-green-500">Active</span>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-6">
        <div class="flex justify-between text-xs text-slate-500 mb-2">
          <span>Training Progress</span>
          <span>{Math.round((visibleLines / maxLines) * 100)}%</span>
        </div>
        <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-violet-600 to-blue-600 rounded-full transition-all duration-500"
            style="width: {(visibleLines / maxLines) * 100}%"
          ></div>
        </div>
      </div>

      <!-- Code Lines -->
      <div class="space-y-2">
        {#each codeLines as line, i}
          {#if i < visibleLines}
            <div 
              class="flex items-center gap-2 {line.color} opacity-0 animate-fade-in"
              style="animation-delay: {i * 0.1}s; animation-fill-mode: forwards;"
            >
              <span class="text-slate-600">{String(i + 1).padStart(2, '0')}</span>
              <span>{line.text}</span>
            </div>
          {/if}
        {/each}
        
        {#if visibleLines >= maxLines}
          <div class="flex items-center gap-2 pt-4 animate-fade-in" style="animation-delay: 0.3s;">
            <span class="text-slate-600">{String(maxLines + 1).padStart(2, '0')}</span>
            <span class="text-violet-400">$</span>
            <span class="text-slate-400">_</span>
            <span class="w-2 h-4 bg-violet-400 animate-pulse"></span>
          </div>
        {/if}
      </div>

      <!-- Metrics Grid -->
      <div class="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800">
        <div class="bg-slate-900 rounded-lg p-3">
          <p class="text-xs text-slate-500 mb-1">Accuracy</p>
          <p class="text-lg font-semibold text-white">94.2%</p>
        </div>
        <div class="bg-slate-900 rounded-lg p-3">
          <p class="text-xs text-slate-500 mb-1">Patterns</p>
          <p class="text-lg font-semibold text-white">2,847</p>
        </div>
        <div class="bg-slate-900 rounded-lg p-3">
          <p class="text-xs text-slate-500 mb-1">Confidence</p>
          <p class="text-lg font-semibold text-green-400">High</p>
        </div>
      </div>
    </div>

    <!-- Bottom Gradient -->
    <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
  </div>

  <!-- Reflection -->
  <div class="absolute -bottom-4 left-4 right-4 h-4 bg-slate-900/20 rounded-full blur-xl"></div>
</div>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
</style>
