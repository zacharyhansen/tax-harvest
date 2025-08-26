import { execSync } from 'node:child_process';

async function main() {
	console.info('🧩 Seeding...');

	execSync('tsx prisma/seed/seed.default.ts', { stdio: 'inherit' });

	console.info('🚀 Completed!');
}

main().catch((error) => {
	console.error('❌ Seed failed:', error);
	process.exit(1);
});
