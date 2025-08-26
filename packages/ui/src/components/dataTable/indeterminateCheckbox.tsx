import type { HTMLProps } from 'react';
import { useEffect, useRef } from 'react';

export function IndeterminateCheckbox({
	className = '',
	indeterminate,
	...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
	// biome-ignore lint/style/noNonNullAssertion: <ok>
	const ref = useRef<HTMLInputElement>(null!);

	useEffect(() => {
		if (typeof indeterminate === 'boolean') {
			ref.current.indeterminate = !rest.checked && indeterminate;
		}
	}, [indeterminate, rest.checked]);

	return (
		<input
			type="checkbox"
			ref={ref}
			className={`${className} cursor-pointer`}
			{...rest}
		/>
	);
}
