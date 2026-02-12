<script lang="ts">
  import { onMount } from 'svelte';
  import { navLinks } from '$lib/data/landing';
  import { fade, fly } from 'svelte/transition';

  let isScrolled = false;
  let mobileMenuOpen = false;

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 20;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<nav
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {isScrolled ? 'py-4' : 'py-6'}"
>
  <div class="max-w-7xl mx-auto px-6">
    <div 
      class="rounded-2xl transition-all duration-300 px-6 h-16 flex items-center justify-between {isScrolled ? 'glass-panel shadow-lg' : 'bg-transparent'}"
    >
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 group">
        <div class="relative w-8 h-8 flex items-center justify-center">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg blur opacity-50 transition-opacity group-hover:opacity-100"></div>
          <div class="relative w-full h-full rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white shadow-inner">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
            </svg>
          </div>
        </div>
        <span class="font-heading font-bold text-xl tracking-tight text-white group-hover:text-violet-200 transition-colors">
          Persona<span class="text-violet-400">.ai</span>
        </span>
      </a>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-8">
        {#each navLinks as link}
          <a 
            href={link.href} 
            class="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group"
          >
            {link.label}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-400/50 blur-[1px] transition-all group-hover:w-full"></span>
          </a>
        {/each}
      </div>
      
      <!-- CTA Buttons -->
      <div class="hidden md:flex items-center gap-4">
        <a 
          href="/login" 
          class="text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Sign in
        </a>
        <a 
          href="/signup" 
          class="btn-primary px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all transform hover:-translate-y-0.5"
        >
          <span class="relative z-10">Get Started</span>
          <div class="btn-primary-glow"></div>
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
        on:click={() => mobileMenuOpen = !mobileMenuOpen}
        aria-label="Toggle menu"
      >
        {#if mobileMenuOpen}
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        {:else}
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile Menu Overlay -->
  {#if mobileMenuOpen}
    <div 
      class="fixed inset-0 top-[5.5rem] p-4 z-40 md:hidden"
      transition:fade={{ duration: 200 }}
    >
      <div 
        class="glass-panel rounded-2xl p-6 flex flex-col gap-6"
        in:fly={{ y: -20, duration: 300 }}
      >
        <div class="flex flex-col gap-2">
          {#each navLinks as link}
            <a 
              href={link.href}
              class="text-lg font-medium text-slate-200 hover:text-white hover:bg-white/5 py-3 px-4 rounded-xl transition-colors"
              on:click={() => mobileMenuOpen = false}
            >
              {link.label}
            </a>
          {/each}
        </div>
        
        <div class="h-px bg-slate-700/50"></div>
        
        <div class="flex flex-col gap-3">
          <a 
            href="/login" 
            class="text-center text-slate-300 font-medium py-3 hover:text-white transition-colors"
            on:click={() => mobileMenuOpen = false}
          >
            Sign in
          </a>
          <a 
            href="/signup" 
            class="btn-primary py-3 rounded-xl font-semibold text-center"
            on:click={() => mobileMenuOpen = false}
          >
            <span class="relative z-10">Get Started Free</span>
            <div class="btn-primary-glow"></div>
          </a>
        </div>
      </div>
    </div>
  {/if}
</nav>
