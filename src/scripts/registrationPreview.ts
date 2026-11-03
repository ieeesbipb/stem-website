const examples = [
  { name: 'Abiyyu Dafa', motivation: 'Aku mau belajar teknologi penanganan bencana!' },
  { name: 'Rafid Harsyah', motivation: 'Lagi mau belajar IoT sihh' },
  { name: 'Abang Gilang Hilang', motivation: 'Pengen tau tentang IEEE IPB :D' },
];

export function initRegistrationPreview(): void {
  const panel = document.querySelector<HTMLElement>('[data-registration-preview]');
  const name = panel?.querySelector<HTMLElement>('[data-typing-name]');
  const motivation = panel?.querySelector<HTMLElement>('[data-typing-motivation]');
  if (!panel || !name || !motivation || panel.dataset.typingReady) return;
  panel.dataset.typingReady = 'true';
  const fields = panel.querySelectorAll<HTMLElement>('[data-preview-field]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let index = 0;
  let nameLength = 0;
  let motivationLength = 0;
  let phase: 'name' | 'motivation' | 'hold' | 'erase' = 'name';

  function stop() {
    clearTimeout(timer);
    timer = undefined;
  }
  function render() {
    name!.textContent = examples[index]!.name.slice(0, nameLength);
    motivation!.textContent = examples[index]!.motivation.slice(0, motivationLength);
    fields.forEach(field => field.toggleAttribute('data-typing-active', field.dataset.previewField === (phase === 'name' ? 'name' : 'motivation')));
  }
  function tick() {
    timer = undefined;
    if (!visible || document.hidden || reduced.matches) return;
    const example = examples[index]!;
    let delay = 40;
    if (phase === 'name') {
      nameLength++;
      if (nameLength >= example.name.length) { phase = 'motivation'; delay = 450; }
    } else if (phase === 'motivation') {
      motivationLength++;
      delay = 30;
      if (motivationLength >= example.motivation.length) { phase = 'hold'; delay = 2200; }
    } else if (phase === 'hold') {
      phase = 'erase';
    } else {
      nameLength = Math.max(0, nameLength - 1);
      motivationLength = Math.max(0, motivationLength - 2);
      delay = 20;
      if (!nameLength && !motivationLength) {
        index = (index + 1) % examples.length;
        phase = 'name';
        delay = 350;
      }
    }
    render();
    timer = setTimeout(tick, delay);
  }
  function resume() {
    stop();
    if (reduced.matches) {
      name!.textContent = examples[0]!.name;
      motivation!.textContent = examples[0]!.motivation;
      fields.forEach(field => field.removeAttribute('data-typing-active'));
    } else if (visible && !document.hidden) {
      render();
      timer = setTimeout(tick, 200);
    }
  }
  const observer = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? false;
    resume();
  }, { threshold: 0.15 });
  observer.observe(panel);
  document.addEventListener('visibilitychange', resume);
  reduced.addEventListener('change', resume);
  window.addEventListener('pagehide', () => { stop(); observer.disconnect(); });
}
