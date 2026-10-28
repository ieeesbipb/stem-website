interface OdometerDigit {
	track: HTMLElement;
	currentVal: number;
}

export function initCountdown(): void {
	const container = document.querySelector<HTMLElement>('[data-countdown]');
	if (!container) return;

	// Target: 22 November 2026, 09:00:00 WIB (UTC+7)
	const targetTime = new Date('2026-11-22T09:00:00+07:00').getTime();

	// Map digit elements with data-digit
	const digitElements = Array.from(container.querySelectorAll<HTMLElement>('[data-digit]'));
	const digitMap: Record<string, OdometerDigit> = {};

	digitElements.forEach((el) => {
		const key = el.getAttribute('data-digit');
		const track = el.querySelector<HTMLElement>('[data-digit-track]');
		if (key && track) {
			digitMap[key] = { track, currentVal: -1 };
		}
	});

	const updateDigit = (key: string, val: number, smooth = false) => {
		const item = digitMap[key];
		if (!item) return;

		// val is 0..9. When smooth is true (e.g. fractional fast wheel), can be fractional
		if (smooth) {
			item.track.style.transition = 'none';
			item.track.style.transform = `translateY(-${val * 10}%)`;
			item.currentVal = val;
			return;
		}

		if (item.currentVal !== val) {
			item.track.style.transition = 'transform 0.18s cubic-bezier(0.2, 0, 0, 1)';
			item.track.style.transform = `translateY(-${val * 10}%)`;
			item.currentVal = val;
		}
	};

	let animFrameId: number;

	const tick = () => {
		const now = Date.now();
		const diff = Math.max(0, targetTime - now);

		const totalSeconds = Math.floor(diff / 1000);
		const ms = diff % 1000;

		const days = Math.floor(totalSeconds / 86400);
		const hours = Math.floor((totalSeconds % 86400) / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		// Months estimate (average month ~ 30.4375 days) or pure calendar breakdown:
		const months = Math.floor(days / 30);
		const remainingDays = days % 30;

		// Format to string digits
		const mStr = String(months).padStart(2, '0');
		const dStr = String(remainingDays).padStart(2, '0');
		const hStr = String(hours).padStart(2, '0');
		const minStr = String(minutes).padStart(2, '0');
		const sStr = String(seconds).padStart(2, '0');

		// Update digits
		updateDigit('m0', parseInt(mStr[0]!, 10));
		updateDigit('m1', parseInt(mStr[1]!, 10));

		updateDigit('d0', parseInt(dStr[0]!, 10));
		updateDigit('d1', parseInt(dStr[1]!, 10));

		updateDigit('h0', parseInt(hStr[0]!, 10));
		updateDigit('h1', parseInt(hStr[1]!, 10));

		updateDigit('min0', parseInt(minStr[0]!, 10));
		updateDigit('min1', parseInt(minStr[1]!, 10));

		updateDigit('s0', parseInt(sStr[0]!, 10));
		updateDigit('s1', parseInt(sStr[1]!, 10));

		animFrameId = requestAnimationFrame(tick);
	};

	tick();

	window.addEventListener('beforeunload', () => {
		cancelAnimationFrame(animFrameId);
	});
}
