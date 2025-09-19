import { useCallback, useEffect, useRef, useState } from 'react';

interface UseScrollPositionOptions {
	threshold?: number;
	targetRef?: React.RefObject<HTMLElement | null>;
	throttleMs?: number;
}

/**
 * Hook to track scroll position with performance optimizations
 * @param threshold - Scroll threshold in pixels (default: 100)
 * @param targetRef - Optional ref to track if scrolled past element
 * @param throttleMs - Throttle delay in milliseconds (default: 50)
 * @returns Object containing isScrolledPast boolean and current scrollY position
 */
export function useScrollPosition({
	threshold = 100,
	targetRef,
	throttleMs = 50,
}: UseScrollPositionOptions = {}) {
	const [isScrolledPast, setIsScrolledPast] = useState(false);
	const [scrollY, setScrollY] = useState(0);
	const lastScrollTime = useRef<number>(0);
	const animationFrameId = useRef<number | null>(null);
	const isScheduled = useRef(false);

	const updateScrollState = useCallback(() => {
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

		isScheduled.current = false;
	}, [threshold, targetRef]);

	const handleScroll = useCallback(() => {
		const now = Date.now();

		// Cancel any pending animation frame
		if (animationFrameId.current !== null) {
			cancelAnimationFrame(animationFrameId.current);
		}

		// Throttle the scroll updates
		if (now - lastScrollTime.current >= throttleMs) {
			lastScrollTime.current = now;

			// Use requestAnimationFrame for smooth updates
			if (!isScheduled.current) {
				isScheduled.current = true;
				animationFrameId.current = requestAnimationFrame(updateScrollState);
			}
		}
	}, [throttleMs, updateScrollState]);

	useEffect(() => {
		// Set initial state
		updateScrollState();

		// Add scroll listener
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
			// Clean up any pending animation frame
			if (animationFrameId.current !== null) {
				cancelAnimationFrame(animationFrameId.current);
			}
		};
	}, [handleScroll, updateScrollState]);

	return {
		isScrolledPast,
		scrollY,
	};
}
