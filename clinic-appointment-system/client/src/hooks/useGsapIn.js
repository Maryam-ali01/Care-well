import { useEffect } from 'react';
import gsap from 'gsap';

// Subtle entrance for elements marked with data-anim inside the ref'd container.
export default function useGsapIn(ref, ready = true) {
  useEffect(() => {
    if (!ready || !ref.current) {
      return undefined;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.from('[data-anim]', {
        y: 10,
        opacity: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
        clearProps: 'all',
      });
    }, ref);
    return () => ctx.revert();
  }, [ready, ref]);
}
