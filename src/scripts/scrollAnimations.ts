/** Scrub existing intro keyframes with scroll position; never play them on a timer. */
export function introProgress(top: number, viewportHeight: number): number {
  const start = viewportHeight - 40;
  const end = viewportHeight * 0.35;
  return Math.max(0, Math.min(1, (start - top) / Math.max(1, start - end)));
}
export function initScrollAnimations(): void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const running = new Set<Animation>();
  const states = new Map<HTMLElement, { animations: Animation[]; duration: number; progress: number; anchor: HTMLElement }>();
  let enabled = true;

  function createAnimations(element: HTMLElement): Animation[] {
    let animations: Animation[];
    if (element.hasAttribute('data-photo-reveal')) {
      animations = [...element.querySelectorAll<HTMLElement>('.edition-photo')].map((photo, index) => photo.animate([
        { opacity: 0, transform: 'scale(0.7) rotate(-3deg)', clipPath: 'inset(8% 8% 8% 8% round 4px)' },
        { opacity: 1, transform: 'scale(1) rotate(0deg)', clipPath: 'inset(0% 0% 0% 0% round 0px)' },
      ], { duration: 650, delay: 80 + index * 90, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both' }));
    } else if (element.hasAttribute('data-reveal')) {
      // A parallax child must be allowed to travel outside its reveal wrapper.
      const clip = !element.hasAttribute('data-reveal-unclipped');
      animations = [element.animate([
        { opacity: 0, transform: 'translateY(56px)', ...(clip ? { clipPath: 'inset(0 0 12% 0)' } : {}) },
        { opacity: 1, transform: 'translateY(0)', ...(clip ? { clipPath: 'inset(0 0 -12px 0)' } : {}) },
      ], { duration: 850, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both' })];
    } else {
      element.classList.add('is-visible');
      // Reuse the current CSS intros, including their separate opacity/blur/slide curves.
      animations = element.getAnimations({ subtree: true }).filter(animation =>
        (animation.effect as KeyframeEffect | null)?.target === element ||
        (element.dataset.animate === 'slide-up' && animation instanceof CSSAnimation && animation.animationName.includes('slideUpWord'))
      );
      animations.forEach(animation => animation.effect?.updateTiming({
        fill: 'both',
        ...(element.dataset.animate === 'slide-up' ? {} : { delay: 0 }),
      }));
    }
    animations.forEach(animation => {
      animation.pause();
      running.add(animation);
    });
    return animations;
  }

  document.querySelectorAll<HTMLElement>('[data-reveal], [data-animate], [data-photo-reveal], .float-up').forEach(element => {
    const animations = createAnimations(element);
    const duration = Math.max(1, ...animations.map(animation => Number(animation.effect?.getComputedTiming().endTime) || 0));
    const anchor = element.dataset.revealAnchor
      ? document.querySelector<HTMLElement>(element.dataset.revealAnchor) ?? element
      : element;
    states.set(element, { animations, duration, progress: -1, anchor });
  });

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
    // Remove the intro's own translation from measurements so scrubbing doesn't
    // shift its trigger point. Parent column parallax remains part of the position.
    const intros = [...states].map(([element, state]) => {
      const transform = getComputedStyle(state.anchor).transform;
      const translateY = transform && transform !== 'none' ? new DOMMatrixReadOnly(transform).m42 : 0;
      return { state, progress: introProgress(state.anchor.getBoundingClientRect().top - translateY, height) };
    });
    const positions = [...visible].map(element => ({ element, center: element.getBoundingClientRect().top + element.offsetHeight / 2 }));
    intros.forEach(({ state, progress }) => {
      if (state.progress === progress) return;
      state.progress = progress;
      state.animations.forEach(animation => { animation.currentTime = state.duration * progress; });
    });
    positions.forEach(({ element, center }) => {
      const progress = Math.max(-1, Math.min(1, (center - height / 2) / height));
      element.style.transform = `translateY(${progress * -32}px)`;
    });
  }
  function schedule() { if (enabled && !frame) frame = requestAnimationFrame(update); }
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach(element => parallaxObserver.observe(element));
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule, { once: true });
  document.fonts?.ready.then(schedule);
  update();

  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    enabled = false;
    parallaxObserver.disconnect();
    running.forEach(animation => animation.cancel());
    window.removeEventListener('scroll', schedule);
    document.querySelectorAll<HTMLElement>('[data-animate]').forEach(element => element.classList.add('is-visible'));
    window.removeEventListener('resize', schedule);
    window.removeEventListener('load', schedule);
    if (frame) cancelAnimationFrame(frame);
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach(element => element.style.removeProperty('transform'));
  });
}
