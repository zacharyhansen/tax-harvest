import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import 'vitest';

declare global {
	namespace Vi {
		type Assertion<T = unknown> = TestingLibraryMatchers<T, void>;
	}
}
