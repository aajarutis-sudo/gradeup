import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/cards/Card";
import CompactUnitGrid from "@/components/subjects/CompactUnitGrid";

export default async function SubjectPage({
    params,
}: {
    params: Promise<{ subject: string }>;
}) {
    const viewer = await getViewer();
    if (!viewer) {
        redirect("/sign-in");
    }

    const { subject: slug } = await params;
    const subjectDb = await prisma.subject.findUnique({
        where: { slug },
        include: {
            topics: {
                include: {
                    lessons: true,
                    subtopics: {
                        orderBy: { orderIndex: "asc" },
                    },
                },
                orderBy: { orderIndex: "asc" },
            },
        },
    });

    if (!subjectDb) {
        notFound();
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <SectionHeading
                    eyebrow={subjectDb.examBoard ?? "GCSE"}
                    title={subjectDb.name ?? subjectDb.title}
                    description={subjectDb.description ?? "A focused GCSE revision track."}
                />
                <Card
                    title="Course units"
                    subtitle={`Board-specific units for ${subjectDb.examBoard ?? "GCSE"} ${subjectDb.name ?? subjectDb.title}. Open any unit to read lesson notes, revise subtopics, and move into quizzes or flashcards.`}
                >
                    {subjectDb.topics.length ? (
                        <CompactUnitGrid
                            examBoard={subjectDb.examBoard}
                            units={subjectDb.topics.map((topic) => ({
                                id: topic.id,
                                slug: topic.slug,
                                title: topic.title,
                                summary: topic.summary,
                                lessonTitle: topic.lessons[0]?.title,
                                subtopics: topic.subtopics.map((subtopic) => ({
                                    id: subtopic.id,
                                    title: subtopic.title,
                                })),
                            }))}
                        />
                    ) : (
                        <div className="rounded-[24px] bg-[var(--background)] p-5 text-sm text-muted">
                            No units are loaded for this subject yet. Run the updated seed so the full exam-board curriculum appears here.
                        </div>
                    )}
                </Card>
            </div>
        </MainLayout>
    );
}
