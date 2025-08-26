import '../src/tailwind.css';
import '../src/tiptap/styles/index.css';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		options: {
			storySort: {
				order: ['Atoms', 'Molecules', 'TipTap', 'Typography', 'Colors'], // Define your order here
			},
		},
	},
};

export default preview;
