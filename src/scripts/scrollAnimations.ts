/** Reveal on entry; keep native scrolling and the page usable without JavaScript. */
export function initScrollAnimations(): void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const running = new Set<Animation>();
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target as HTMLElement;
      const delay = parseFloat(getComputedStyle(element).getPropertyValue('--reveal-delay')) || 0;
      const animation = element.animate([
        { opacity: 0, transform: 'translateY(56px)', clipPath: 'inset(0 0 12% 0)' },
        { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 -12px 0)' },
      ], { duration: 850, delay, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' });
      running.add(animation);
      animation.finished.then(() => running.delete(animation)).catch(() => running.delete(animation));
      revealObserver.unobserve(element);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => revealObserver.observe(element));

  const visible = new Set<HTMLElement>();
  const parallaxObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const element = entry.target as HTMLElement;
      if (entry.isIntersecting) visible.add(element);
      else visible.delete(element);
    });
    schedule();
  });
  let frame = 0;
  function update() {
    frame = 0;
    const height = window.innerHeight;
    const positions = [...visible].map(element => ({ element, center: element.getBoundingClientRect().top + element.offsetHeight / 2 }));
    positions.forEach(({ element, center }) => {
      const progress = Math.max(-1, Math.min(1, (center - height / 2) / height));
      element.style.transform = `translateY(${progress * -32}px)`;
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach(element => parallaxObserver.observe(element));
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);

  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    revealObserver.disconnect();
    parallaxObserver.disconnect();
    running.forEach(animation => animation.cancel());
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    if (frame) cancelAnimationFrame(frame);
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach(element => element.style.removeProperty('transform'));
  });
}
