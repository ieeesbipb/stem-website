export const earlyBirdDeadline = new Date('2026-11-10T23:59:59+07:00').getTime();
export const regularDeadline = new Date('2026-11-19T23:59:59+07:00').getTime();

export function registrationTimelineState(now: number) {
  const phase = now <= earlyBirdDeadline ? 'early' : now <= regularDeadline ? 'regular' : 'closed';
  const remaining = (phase === 'early' ? earlyBirdDeadline : regularDeadline) - now;
  const hour = 60 * 60 * 1000;
  const duration = remaining < 24 * hour
    ? `${Math.max(1, Math.ceil(remaining / hour))} jam`
    : `${Math.ceil(remaining / (24 * hour))} hari`;
  return {
    phase,
    early: phase === 'early' ? `Tersisa ${duration}` : '',
    regular: phase === 'regular' ? `Tersisa ${duration}` : phase === 'closed' ? 'Pendaftaran ditutup' : '',
  };
}

export function initRegistrationTimeline(): void {
  const timeline = document.querySelector<HTMLElement>('[data-registration-timeline]');
  if (!timeline || timeline.dataset.ready) return;
  timeline.dataset.ready = 'true';
  // Local preview: ?registrationNow=2026-11-11T00:00:00Z
  const simulatedStart = import.meta.env.DEV
    ? Date.parse(new URLSearchParams(window.location.search).get('registrationNow') ?? '')
    : NaN;
  const startedAt = Date.now();
  function update() {
    const now = Date.now();
    const state = registrationTimelineState(Number.isFinite(simulatedStart) ? simulatedStart + now - startedAt : now);
    timeline!.querySelectorAll<HTMLElement>('[data-registration-phase]').forEach(row => {
      row.toggleAttribute('data-active', row.dataset.registrationPhase === state.phase);
    });
    for (const phase of ['early', 'regular'] as const) {
      const text = timeline!.querySelector<HTMLElement>(`[data-phase-remaining="${phase}"]`);
      if (text) text.textContent = state[phase];
    }
  }
  update();
  const interval = window.setInterval(update, 1000);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', () => window.clearInterval(interval));
}
