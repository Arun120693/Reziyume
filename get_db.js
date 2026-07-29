const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const resume = await prisma.resume.findFirst({ orderBy: { updatedAt: 'desc' } });
  if (resume) {
    const exp = resume.experience[0];
    console.log("DESCRIPTION HTML:");
    console.log(exp.description);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
