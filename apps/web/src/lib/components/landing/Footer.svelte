<script lang="ts">
  import { footerLinks } from '$lib/data/landing';
  import { inview } from '$lib/actions/inview';
  import { fly } from 'svelte/transition';

  let isVisible = false;
</script>

<footer 
  class="bg-slate-950 pt-24 pb-12 border-t border-slate-900"
  use:inview={{ once: true }}
  on:inview={() => isVisible = true}
>
  <div class="max-w-7xl mx-auto px-6">
    <!-- Footer Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 mb-20">
      <!-- Brand Column -->
      <div class="col-span-2 lg:col-span-2 opacity-0" class:animate-fade-up={isVisible} style="animation-fill-mode: forwards;">
        <a href="/" class="inline-flex items-center gap-2 mb-6 group">
          <div class="relative w-8 h-8 flex items-center justify-center">
            <div class="absolute inset-0 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg blur opacity-50 transition-opacity group-hover:opacity-100"></div>
            <div class="relative w-full h-full rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white shadow-inner">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
              </svg>
            </div>
          </div>
          <span class="font-heading font-bold text-xl text-white tracking-tight">Persona<span class="text-violet-400">.ai</span></span>
        </a>
        <p class="text-slate-400 mb-8 max-w-sm leading-relaxed text-sm">
          The autonomous social media engine that scales your personal brand without losing your authenticity. Powered by advanced AI models tailored to your voice.
        </p>
        
        <!-- Social Links -->
        <div class="flex gap-3">
          {#each footerLinks.social as social}
            <a 
              href={social.href} 
              class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-600/10 transition-all duration-300"
              aria-label={social.label}
            >
              {#if social.icon === 'x'}
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              {:else if social.icon === 'linkedin'}
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              {:else}
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              {/if}
            </a>
          {/each}
        </div>
      </div>

      <!-- Links Columns -->
      <div class="opacity-0" class:animate-fade-up={isVisible} style="animation-delay: 0.1s; animation-fill-mode: forwards;">
        <h4 class="font-bold text-white mb-6">Product</h4>
        <ul class="space-y-4">
          {#each footerLinks.product as link}
            <li>
              <a href={link.href} class="text-sm text-slate-400 hover:text-white transition-colors">
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <div class="opacity-0" class:animate-fade-up={isVisible} style="animation-delay: 0.2s; animation-fill-mode: forwards;">
        <h4 class="font-bold text-white mb-6">Company</h4>
        <ul class="space-y-4">
          {#each footerLinks.company as link}
            <li>
              <a href={link.href} class="text-sm text-slate-400 hover:text-white transition-colors">
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
      
      <div class="opacity-0" class:animate-fade-up={isVisible} style="animation-delay: 0.25s; animation-fill-mode: forwards;">
        <h4 class="font-bold text-white mb-6">Resources</h4>
        <ul class="space-y-4">
          <li><button class="text-sm text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-left">Blog</button></li>
          <li><button class="text-sm text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-left">Community</button></li>
          <li><button class="text-sm text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-left">Partners</button></li>
          <li><button class="text-sm text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-left">Help Center</button></li>
        </ul>
      </div>

      <div class="opacity-0" class:animate-fade-up={isVisible} style="animation-delay: 0.3s; animation-fill-mode: forwards;">
        <h4 class="font-bold text-white mb-6">Legal</h4>
        <ul class="space-y-4">
          {#each footerLinks.legal as link}
            <li>
              <a href={link.href} class="text-sm text-slate-400 hover:text-white transition-colors">
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Big Footer Text -->
    <div class="border-t border-slate-900 pt-16 mb-12 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/50 z-10"></div>
      <h2 class="text-[12vw] leading-none font-bold text-center text-slate-900 select-none tracking-tighter">
        Persona<span class="text-slate-800">.ai</span>
      </h2>
    </div>

    <!-- Bottom Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-900">
      <p class="text-slate-500 text-sm">
        © 2026 PersonaMirror Inc. All rights reserved.
      </p>
      
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2 text-sm text-slate-500 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          All systems operational
        </div>
      </div>
    </div>
  </div>
</footer>

<style>
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-up {
    animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
</style>
