import { getViewer } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import PracticeClient from "@/components/practice/PracticeClient";

export default async function PracticePage({ params }: { params: { subject: string } }) {
    const viewer = await getViewer();

    if (!viewer) {
        redirect("/sign-in");
    }

    // Get subject
    const subject = await prisma.subject.findUnique({
        where: { slug: params.subject }
    });

    if (!subject) {
        redirect("/dashboard");
    }

    // Get all questions for this subject
    const questions = await (prisma.question as any).findMany({
        where: { subjectId: subject.id },
        orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }]
    });

    // Get user's previous answers for this subject
    const userAnswers = await (prisma.questionAnswer as any).findMany({
        where: {
            userId: viewer.id,
            question: { subjectId: subject.id }
        }
    });

    const answeredQuestionIds = new Set(userAnswers.map((a: any) => a.questionId));

    return (
        <PracticeClient
            subject={subject}
            questions={questions}
            userAnswerMap={Object.fromEntries(
                userAnswers.map((a: any) => [a.questionId, a])
            )}
        />
    );
}
