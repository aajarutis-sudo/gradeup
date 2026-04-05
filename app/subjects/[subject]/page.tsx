import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import SubjectCard from "@/components/subjects/SubjectCard";

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
            topics: true,
        },
    });

    if (!subjectDb) {
        notFound();
    }

    const averageCompletion = 0; // TODO: Calculate based on viewer progress

    return (
        <MainLayout>
            <div className="space-y-6">
                <SectionHeading
                    eyebrow={subjectDb.examBoard ?? "GCSE"}
                    title={subjectDb.name ?? subjectDb.title}
                    description={subjectDb.description ?? "A focused GCSE revision track."}
                />
                <div className="grid-auto">
                    {subjectDb.topics.map((topic) => (
                        <SubjectCard
                            key={topic.id}
                            slug={topic.slug}
                            name={topic.title}
                            description="Focus area within this subject."
                            color={subjectDb.color}
                            examBoard={subjectDb.examBoard}
                            topicCount={1}
                            completion={averageCompletion}
                        />
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
