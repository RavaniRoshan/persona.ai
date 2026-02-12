<script lang="ts">
  import { faqs } from '$lib/data/landing';
  import { slide } from 'svelte/transition';
  import { inview } from '$lib/actions/inview';

  let openIndex: number | null = 0;
  let isVisible = false;

  function toggleFAQ(index: number) {
    openIndex = openIndex === index ? null : index;
  }
</script>

<section 
  id="faq" 
  class="py-24 bg-white"
  use:inview={{ once: true }}
  on:inview={() => isVisible = true}
>
  <div class="max-w-3xl mx-auto px-6">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <span class="inline-block px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold mb-4">
        FAQ
      </span>
      <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
        Frequently asked<br>questions
      </h2>
      <p class="text-lg text-slate-600">
        Everything you need to know about PersonaMirror.
      </p>
    </div>

    <!-- FAQ Accordion -->
    <div class="space-y-4">
      {#each faqs as faq, i}
        <div 
          class="border border-slate-200 rounded-xl overflow-hidden opacity-0"
          class:animate-fade-up={isVisible}
          style="animation-delay: {i * 0.1}s; animation-fill-mode: forwards;"
        >
          <button
            class="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
            on:click={() => toggleFAQ(i)}
          >
            <span class="font-semibold text-slate-900 pr-8">{faq.question}</span>
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-all {openIndex === i ? 'bg-violet-100 rotate-180' : ''}">
              <svg class="w-5 h-5 text-slate-500 {openIndex === i ? 'text-violet-600' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </button>
          
          {#if openIndex === i}
            <div transition:slide={{ duration: 300 }}>
              <div class="px-6 pb-6 text-slate-600 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- CTA -->
    <div class="mt-12 text-center opacity-0" class:animate-fade-up={isVisible} style="animation-delay: 0.6s; animation-fill-mode: forwards;">
      <p class="text-slate-600 mb-4">Still have questions?</p>
      <button class="inline-flex items-center gap-2 text-violet-600 font-semibold hover:text-violet-700 transition-colors bg-transparent border-none cursor-pointer">
        Contact our support team
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </button>
    </div>
  </div>
</section>

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
    animation: fadeUp 0.5s ease-out;
  }
</style>
