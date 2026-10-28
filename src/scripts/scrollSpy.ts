export function initScrollSpy(): void {
	const topBar = document.querySelector<HTMLElement>('[data-top-bar]');
	const links = [...document.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]')];
	const sections = [...document.querySelectorAll<HTMLElement>('#hero, #overview, #why-join, #event-flow, #partners, #past-editions, #register')];
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	// Keep the existing navigation design; connect its links to the new sections.
	const brandLink = document.querySelector<HTMLAnchorElement>('[data-brand-link]');
	[...links, ...(brandLink ? [brandLink] : [])].forEach(link => {
		const id = link === brandLink ? 'hero' : link.hash.slice(1);
		const target = document.getElementById(id);
		if (!target) return;
		link.addEventListener('click', event => {
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			event.preventDefault();
			history.replaceState(null, '', `#${id}`);
			target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
		});
	});

	function update() {
		let current = sections[0];
		for (const section of sections) {
			if (section.getBoundingClientRect().top <= 200) current = section;
		}
		const id = current?.id === 'hero' ? 'overview' : current?.id;
		links.forEach(link => {
			if (link.id.startsWith('nav-') && link.hash === `#${id}`) {
				link.dataset.active = id === 'why-join' ? 'yellow' : 'blue';
				link.setAttribute('aria-current', 'location');
			} else {
				link.removeAttribute('data-active');
				link.removeAttribute('aria-current');
			}
		});
		if (id === 'why-join' || id === 'partners') topBar?.setAttribute('data-theme', 'dark');
		else topBar?.removeAttribute('data-theme');
	}
	let scheduled = false;
	window.addEventListener('scroll', () => {
		if (scheduled) return;
		scheduled = true;
		requestAnimationFrame(() => { scheduled = false; update(); });
	}, { passive: true });
	window.addEventListener('resize', update);
	update();
}
