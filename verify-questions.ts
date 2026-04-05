import prisma from "./lib/prisma";

async function verify() {
    const totalQuestions = await (prisma.question as any).count();
    const questionsBySubject = await (prisma.question as any).groupBy({
        by: ["subjectId"],
        _count: {
            id: true
        }
    });

    console.log(`\n📊 Question Seeding Verification\n`);
    console.log(`✅ Total Questions: ${totalQuestions}`);
    console.log(`✅ Subjects with questions: ${questionsBySubject.length}`);
    console.log(`✅ Average questions per subject: ${(totalQuestions / questionsBySubject.length).toFixed(1)}`);

    // Get subject details
    const subjectDetails = await (prisma.subject as any).findMany({
        include: {
            _count: {
                select: { questions: true }
            }
        },
        orderBy: { name: "asc" }
    });

    console.log(`\n📚 Questions per Subject:`);
    subjectDetails.forEach(s => {
        console.log(`   ${s.name.padEnd(30)} → ${s._count.questions} questions`);
    });

    await prisma.$disconnect();
}

verify();
