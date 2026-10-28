import Lenis from 'lenis';

export function initScrollSpy(): void {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	let lenis: Lenis | null = reducedMotion.matches ? null : new Lenis({ autoRaf: true });
	const topBar = document.querySelector<HTMLElement>('[data-top-bar]');
	const links = [...document.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]')];
	const sections = [...document.querySelectorAll<HTMLElement>('#hero, #overview, #why-join, #event-flow, #partners, #past-editions, #register')];
	const whyJoinSection = document.getElementById('why-join');
	const columns = [...document.querySelectorAll<HTMLElement>('[data-column-index]')];
	const eventFlowSection = document.getElementById('event-flow');
	const eventFlowCards = [...document.querySelectorAll<HTMLElement>('#event-flow .event-card')];

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

	// Continuous staggered parallax for Why Join and Event Flow (no stop/finish).
	function updateParallax() {
		const isMobileOrReduced = window.innerWidth <= 1024 || reducedMotion.matches;

		if (whyJoinSection && columns.length >= 3) {
			if (isMobileOrReduced) {
				columns.forEach(column => column.style.removeProperty('transform'));
			} else {
				const rect = whyJoinSection.getBoundingClientRect();
				if (rect.bottom >= -300 && rect.top <= window.innerHeight + 300) {
					const delta = rect.top - 80;
					const factors = [0, 0.1, 0.2];
					columns.forEach((column, index) => {
						column.style.transform = `translateY(${delta * (factors[index] ?? 0)}px)`;
					});
				}
			}
		}

		if (eventFlowSection && eventFlowCards.length) {
			if (isMobileOrReduced) {
				eventFlowCards.forEach(card => card.style.removeProperty('transform'));
			} else {
				const rect = eventFlowSection.getBoundingClientRect();
				if (rect.bottom >= -300 && rect.top <= window.innerHeight + 300) {
					const delta = rect.top - 80;
					const rightFactor = 0.18;
					const rightBase = 150;
					const leftParallax: Record<string, { factor: number; baseOffset: number }> = {
						'Workshop 1': { factor: 0.07, baseOffset: 48 },
						'Seminar 3': { factor: 0.12, baseOffset: 96 },
					};
					eventFlowCards.forEach(card => {
						const col = Number(card.dataset.col || 0);
						const title = card.dataset.title || '';
						if (col === 1) {
							// Right column: continuous parallax
							card.style.transform = `translateY(${rightBase + delta * rightFactor}px)`;
						} else if (leftParallax[title]) {
							// Left 2 cards: continuous parallax (no finish/stop), separate speeds
							const { factor, baseOffset } = leftParallax[title];
							card.style.transform = `translateY(${baseOffset + delta * factor}px)`;
						} else {
							card.style.transform = 'translateY(0px)';
						}
					});
				}
			}
		}
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

	// Global scroll-triggered animations (e.g. data-animate="float-up")
	const animElements = [...document.querySelectorAll<HTMLElement>('[data-animate]')];
	if (animElements.length) {
		const animObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						animObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
		);

		animElements.forEach((el) => {
			const rect = el.getBoundingClientRect();
			if (rect.top < window.innerHeight && rect.bottom > 0) {
				el.classList.add('is-visible');
			} else {
				animObserver.observe(el);
			}
		});
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
