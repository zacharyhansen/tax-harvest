import { useEffect, useState } from 'react';

interface UseScrollPositionOptions {
	threshold?: number;
	targetRef?: React.RefObject<HTMLElement | null>;
}

export function useScrollPosition({
	threshold = 100,
	targetRef,
}: UseScrollPositionOptions = {}) {
	const [isScrolledPast, setIsScrolledPast] = useState(false);
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			setScrollY(currentScrollY);

			if (targetRef?.current) {
				// If we have a target ref, check if we've scrolled past it
				const rect = targetRef.current.getBoundingClientRect();
				const elementBottom = rect.bottom + currentScrollY - rect.height;
				setIsScrolledPast(currentScrollY > elementBottom);
			} else {
				// Otherwise use the threshold
				setIsScrolledPast(currentScrollY > threshold);
			}
		};

		// Set initial state
		handleScroll();

		// Add scroll listener
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [threshold, targetRef]);

	return {
		isScrolledPast,
		scrollY,
	};
}
