const config = {
  '**/*.{js,jsx,mjs,cjs,ts,tsx,mts}': ['prettier --write', 'eslint --fix', 'vitest related --run'],
  '**/*.{md,json,yaml,yml}': ['prettier --write', 'eslint --fix'],
  '**/*.{css,scss}': ['prettier --write'],
  // '*': 'node --run typos',
}

export default config
