import type { Action } from 'svelte/action';

interface InViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

interface InViewAttributes {
  'on:inview'?: (event: CustomEvent<IntersectionObserverEntry>) => void;
}

export const inview: Action<HTMLElement, InViewOptions | undefined, InViewAttributes> = (
  node,
  options = {}
) => {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.dispatchEvent(new CustomEvent('inview', { detail: entry }));
          if (once) {
            observer.unobserve(node);
          }
        }
      });
    },
    { threshold, rootMargin }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
};
