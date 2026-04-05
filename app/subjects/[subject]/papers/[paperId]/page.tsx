import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/cards/Card";
import SectionHeading from "@/components/ui/SectionHeading";

export default async function PastPaperPage({
  params,
}: {
  params: Promise<{ subject: string; paperId: string }>;
}) {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/sign-in");
  }

  const { subject: subjectSlug, paperId } = await params;
  const paper = await prisma.pastPaper.findFirst({
    where: {
      id: paperId,
      subject: {
        slug: subjectSlug,
      },
    },
    include: {
      subject: true,
    },
  });

  if (!paper) {
    notFound();
  }

  const markSchemeChecklist = (paper.markSchemePoints ?? "")
    .split(". ")
    .map((point) => point.trim())
    .filter(Boolean)
    .map((point) => (point.endsWith(".") ? point : `${point}.`));

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionHeading
          eyebrow={`${paper.paperCode ?? paper.paperNumber} • ${paper.season ?? paper.series} ${paper.year}`}
          title={paper.title ?? `${paper.subject.name ?? paper.subject.title} ${paper.paperNumber}`}
          description={`Practice paper for ${paper.subject.name ?? paper.subject.title}. Built for timed revision with clear mark-scheme guidance.`}
        />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card title="Paper overview" subtitle="What this practice set is training you to do.">
            <div className="space-y-4 text-sm text-muted">
              <p>
                <span className="font-semibold text-[var(--foreground)]">Duration:</span> {paper.durationMinutes ?? 60} minutes
              </p>
              <p>
                <span className="font-semibold text-[var(--foreground)]">Focus:</span> {paper.questionFocus ?? "Exam-style practice and self-marking."}
              </p>
              <p>
                <span className="font-semibold text-[var(--foreground)]">Examiner focus:</span> {paper.markSchemeNotes ?? "Use clear methods, evidence, and direct answers to the question."}
              </p>
            </div>
          </Card>

          <Card title="Next step" subtitle="Use this paper like a real exam block.">
            <div className="space-y-3">
              <Link href={`/subjects/${paper.subject.slug}`} className="block rounded-[22px] bg-[var(--background)] px-5 py-4 font-semibold">
                Back to {paper.subject.name ?? paper.subject.title}
              </Link>
              <Link href="/dashboard" className="block rounded-[22px] bg-[var(--primary)] px-5 py-4 font-semibold text-white">
                Return to dashboard
              </Link>
            </div>
          </Card>
        </div>

        <Card title="Practice brief" subtitle="Use this as your student-facing paper instructions.">
          <div className="whitespace-pre-wrap text-sm leading-7 text-muted">{paper.practicePrompt ?? "Open the paper, attempt it in exam conditions, then review the mark scheme and improve your weakest answers."}</div>
        </Card>

        <Card title="Mark-scheme checklist" subtitle="What strong responses usually do to earn marks.">
          <div className="grid gap-3">
            {markSchemeChecklist.map((point, index) => (
              <div key={`${paper.id}-${index}`} className="rounded-[22px] bg-[var(--background)] p-4 text-sm text-muted">
                <span className="font-semibold text-[var(--foreground)]">{index + 1}. </span>
                {point}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
