import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import { parseExamBoard } from "@/lib/curriculum";
import MainLayout from "@/components/layout/MainLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import SubjectCard from "@/components/subjects/SubjectCard";
import ExamBoardFilter from "@/components/ui/ExamBoardFilter";

export default async function SubjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string }>;
}) {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/sign-in");
  }

  const { board } = await searchParams;
  const examBoard = parseExamBoard(board);
  const selectedBoard = board && !examBoard ? "all" : board ?? "all";

  const subjects = await prisma.subject.findMany({
    where: examBoard ? { examBoard } : undefined,
    include: {
      topics: true,
    },
    orderBy: { title: "asc" },
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Subjects"
          title="Choose your revision lane"
          description="Filter by exam board, then open a subject for topics, lessons, quizzes, flashcards, and papers."
        />
        <ExamBoardFilter basePath="/subjects" selected={selectedBoard} />
        <div className="grid-auto">
          {subjects.map((subject) => {
            const averageCompletion = 0; // Simplified for now

            return (
              <SubjectCard
                key={subject.id}
                slug={subject.slug}
                name={subject.name ?? subject.title}
                description={subject.description ?? "A focused GCSE revision track."}
                color={subject.color}
                examBoard={subject.examBoard}
                topicCount={subject.topics.length}
                completion={averageCompletion}
              />
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
