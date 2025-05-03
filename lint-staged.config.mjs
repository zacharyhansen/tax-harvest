const config = {
  '**/*.{js,jsx,mjs,cjs,ts,tsx,mts}': [
    'eslint --fix',
    'vitest related --run',
  ],
  '**/*.{md,json,yaml,yml}': 'eslint --fix',
  // '*': 'node --run typos',
}

export default config
