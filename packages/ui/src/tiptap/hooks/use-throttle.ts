import { useCallback, useRef } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: <ok>
export function useThrottle<T extends (...args: any[]) => void>(
	callback: T,
	delay: number,
): (...args: Parameters<T>) => void {
	const lastRan = useRef(Date.now());
	const timeoutReference = useRef<NodeJS.Timeout | null>(null);

	return useCallback(
		(...args: Parameters<T>) => {
			const handler = () => {
				if (Date.now() - lastRan.current >= delay) {
					callback(...args);
					lastRan.current = Date.now();
				} else {
					if (timeoutReference.current) {
						clearTimeout(timeoutReference.current);
					}
					timeoutReference.current = setTimeout(
						() => {
							callback(...args);
							lastRan.current = Date.now();
						},
						delay - (Date.now() - lastRan.current),
					);
				}
			};

			handler();
		},
		[callback, delay],
	);
}
