import { getViewer } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/cards/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Link from "next/link";
import TimedPracticeClient from "@/components/practice/TimedPracticeClient";

export default async function TimedPracticePage({
    params,
}: {
    params: Promise<{ subject: string }>;
}) {
    const viewer = await getViewer();

    if (!viewer) {
        redirect("/sign-in");
    }

    const { subject: subjectSlug } = await params;

    // Get subject
    const subject = await (prisma.subject as any).findUnique({
        where: { slug: subjectSlug },
    });

    if (!subject) {
        redirect("/dashboard");
    }

    // Get user's exam board selection for this subject
    const userSubject = await (prisma.userSubject as any).findUnique({
        where: {
            userId_subjectId: {
                userId: viewer.id,
                subjectId: subject.id,
            },
        },
    });

    if (!userSubject || !userSubject.examBoardSlug) {
        // User hasn't selected exam board for this subject
        return (
            <MainLayout>
                <div className="space-y-6">
                    <SectionHeading eyebrow="Timed Practice" title={subject.name} />

                    <Card className="p-6 text-center">
                        <p className="text-muted mb-4">
                            Please select an exam board for {subject.name} first
                        </p>
                        <Link href="/onboarding/subjects">
                            <Button>Choose Exam Board</Button>
                        </Link>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    // Get past papers for this subject and exam board
    const papers = await (prisma.pastPaper as any).findMany({
        where: {
            subjectId: subject.id,
            examBoard: userSubject.examBoardSlug,
        },
        orderBy: { year: "desc" },
    });

    // Get practice questions for this subject
    const questions = await (prisma.question as any).findMany({
        where: { subjectId: subject.id },
        select: {
            id: true,
            questionText: true,
            marks: true,
            difficulty: true,
            year: true,
            examBoard: true,
        },
        orderBy: [{ year: "desc" }, { difficulty: "asc" }],
        take: 20,
    });

    if (questions.length === 0) {
        return (
            <MainLayout>
                <div className="space-y-6">
                    <SectionHeading eyebrow="Timed Practice" title={subject.name} />

                    <Card className="p-6 text-center">
                        <p className="text-muted">
                            No practice questions available yet for {subject.name}
                        </p>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-8">
                <SectionHeading
                    eyebrow="Timed Practice"
                    title={subject.name}
                    description={`${userSubject.examBoardSlug.toUpperCase()} • ${questions.length} questions • Practice like an exam`}
                />

                {/* Papers Info */}
                {papers.length > 0 && (
                    <Card className="p-6 bg-blue-50">
                        <h3 className="font-semibold text-blue-900 mb-3">
                            📄 Available Past Papers ({papers.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {papers.slice(0, 6).map((paper: any) => (
                                <div
                                    key={paper.id}
                                    className="px-3 py-2 bg-blue-100 text-blue-900 rounded-lg text-sm font-medium"
                                >
                                    {paper.year} Paper {paper.paperNumber}
                                    {paper.tier && <span className="text-xs block">{paper.tier}</span>}
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Timing Guide */}
                <Card className="p-6 bg-yellow-50">
                    <h3 className="font-semibold text-yellow-900 mb-2">⏱️ Timing Rules</h3>
                    <p className="text-sm text-yellow-900">
                        Each question is timed at <strong>1 minute per mark</strong>. For example, a 6-mark
                        question gives you 6 minutes. Your answer will be marked by AI, and you'll receive
                        detailed feedback on how to improve.
                    </p>
                </Card>

                {/* Timed Practice Component */}
                <TimedPracticeClient
                    questions={questions}
                    subject={{ id: subject.id, name: subject.name || subject.title }}
                />
            </div>
        </MainLayout>
    );
}
