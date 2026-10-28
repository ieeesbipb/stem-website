import Lenis from 'lenis';

export function initScrollSpy(): void {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	let lenis: Lenis | null = reducedMotion.matches ? null : new Lenis({ autoRaf: true });
	const topBar = document.querySelector<HTMLElement>('[data-top-bar]');
	const links = [...document.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]')];
	const sections = [...document.querySelectorAll<HTMLElement>('#hero, #overview, #why-join, #event-flow, #partners, #past-editions, #register')];
	const whyJoinSection = document.getElementById('why-join');
	const columns = [...document.querySelectorAll<HTMLElement>('[data-column-index]')];

	// Route all section links through the same scroll engine, including hero CTAs.
	const brandLink = document.querySelector<HTMLAnchorElement>('[data-brand-link]');
	const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
	[...sectionLinks, ...(brandLink ? [brandLink] : [])].forEach(link => {
		const id = link === brandLink ? 'hero' : link.hash.slice(1);
		const target = document.getElementById(id);
		if (!target) return;
		link.addEventListener('click', event => {
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			event.preventDefault();
			history.replaceState(null, '', `#${id}`);
			if (lenis) lenis.scrollTo(target, { offset: -56 });
			else target.scrollIntoView({ behavior: 'instant' });
		});
	});

	// Preserve origin's staggered Why Join column parallax.
	function updateParallax() {
		if (!whyJoinSection || columns.length < 3) return;
		if (window.innerWidth <= 1024 || reducedMotion.matches) {
			columns.forEach(column => column.style.removeProperty('transform'));
			return;
		}
		const top = whyJoinSection.getBoundingClientRect().top;
		const start = window.innerHeight * 0.6;
		const end = -window.innerHeight * 0.45;
		const progress = Math.min(Math.max((start - top) / (start - end), 0), 1);
		const offsets = [0, 200, 400];
		columns.forEach((column, index) => {
			column.style.transform = `translateY(${(1 - progress) * (offsets[index] ?? 0)}px)`;
		});
	}

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
		updateParallax();
	}
	let scheduled = false;
	function schedule() {
		if (scheduled) return;
		scheduled = true;
		requestAnimationFrame(() => { scheduled = false; update(); });
	}
	lenis?.on('scroll', schedule);
	window.addEventListener('scroll', schedule, { passive: true });
	window.addEventListener('resize', schedule);
	reducedMotion.addEventListener('change', () => {
		lenis?.destroy();
		lenis = reducedMotion.matches ? null : new Lenis({ autoRaf: true });
		lenis?.on('scroll', schedule);
		schedule();
	});
	update();
}
