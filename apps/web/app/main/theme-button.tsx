import { Button } from '@repo/ui/components/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeButton() {
	const { setTheme, theme } = useTheme();

	return (
		<Button
			variant="outline"
			size="icon"
			className="size-8 rounded-full"
			onClick={() => {
				if (theme === 'light') {
					setTheme('dark');
				} else {
					setTheme('light');
				}
			}}
		>
			{theme === 'dark' ? (
				<Moon className="size-3" />
			) : (
				<Sun className="size-3" />
			)}
		</Button>
	);
}
