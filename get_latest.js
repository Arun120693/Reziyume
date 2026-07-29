const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const resume = await prisma.resume.findFirst({
    orderBy: { updatedAt: 'desc' }
  });
  console.log("Raw Resume Data:");
  console.dir(resume, { depth: null });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
