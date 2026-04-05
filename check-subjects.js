const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSubjects() {
    const subjects = await prisma.subject.findMany({
        where: {
            OR: [
                { slug: { contains: 'art' } },
                { slug: { contains: 'health' } },
                { slug: { contains: 'design' } }
            ]
        }
    });

    console.log('Found subjects:');
    subjects.forEach(s => console.log(`  ${s.name} => ${s.slug}`));

    // Also show all subjects
    const all = await prisma.subject.findMany({
        select: { name: true, slug: true }
    });
    console.log('\nAll subjects:');
    all.forEach(s => console.log(`  ${s.slug}`));

    await prisma.$disconnect();
}

checkSubjects().catch(e => {
    console.error(e);
    process.exit(1);
});
