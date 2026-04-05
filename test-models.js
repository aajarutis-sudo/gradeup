const { PrismaClient } = require('@prisma/client');

async function test() {
    const prisma = new PrismaClient();
    try {
        const count = await prisma.question.count();
        console.log('✅ Questions in DB:', count);

        const userSubjectCount = await prisma.userSubject.count();
        console.log('✅ User Subjects in DB:', userSubjectCount);

        const answerCount = await prisma.questionAnswer.count();
        console.log('✅ Question Answers in DB:', answerCount);

        console.log('\n✅ All new Prisma models are accessible!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
