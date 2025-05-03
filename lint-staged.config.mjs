const config = {
  '**/*.{ts?(x),mts}': () => 'tsc -p tsconfig.prod.json --noEmit',
  '*.{js,jsx,mjs,cjs,ts,tsx,mts}': [
    'node --run lint:file',
    'vitest related --run',
  ],
  '*.{md,json,yaml,yml}': 'eslint --fix',
  '*': 'node --run typos',
}

export default config
