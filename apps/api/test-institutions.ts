import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check total count
  const count = await prisma.plaidInstitution.count();
  console.log(`Total institutions in database: ${count}`);

  if (count === 0) {
    console.log('\n❌ No institutions found. Run the adminRefreshPlaidInstitutions mutation first.');
    return;
  }

  // Get sample institutions
  const sample = await prisma.plaidInstitution.findMany({
    take: 5,
    select: {
      institutionId: true,
      name: true,
      logo: true,
      primaryColor: true,
      lastSyncedAt: true,
    },
  });

  console.log('\nSample institutions:');
  sample.forEach((inst) => {
    console.log(`\nID: ${inst.institutionId}`);
    console.log(`Name: ${inst.name}`);
    console.log(`Logo: ${inst.logo ? `${inst.logo.substring(0, 50)}... (${inst.logo.length} chars)` : 'NULL'}`);
    console.log(`Primary Color: ${inst.primaryColor || 'NULL'}`);
    console.log(`Last Synced: ${inst.lastSyncedAt}`);
  });

  // Check specific brokers
  const brokers = await prisma.plaidInstitution.findMany({
    where: {
      institutionId: { in: ['ins_3', 'ins_127989', 'ins_14'] },
    },
    select: {
      institutionId: true,
      name: true,
      logo: true,
      primaryColor: true,
    },
  });

  console.log('\n\nBroker institutions (Schwab, Fidelity, Vanguard):');
  brokers.forEach((broker) => {
    console.log(`\n${broker.name} (${broker.institutionId}):`);
    console.log(`  Logo: ${broker.logo ? `${broker.logo.substring(0, 50)}...` : 'NULL'}`);
    console.log(`  Color: ${broker.primaryColor || 'NULL'}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
