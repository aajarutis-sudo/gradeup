import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/cards/Card";

export default async function ContinuePage() {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/sign-in");
  }

  const latest = await prisma.userProgress.findFirst({
    where: { userId: viewer.id },
    include: {
      topic: {
        include: {
          subject: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Resume"
          title="Pick up exactly where you stopped"
          description="Your most recent topic is surfaced here so you can get back into flow quickly."
        />
        <Card title="Last active topic" subtitle="One click back into revision mode.">
          {latest ? (
            <Link href={`/topics/${latest.topic.slug}`} className="block rounded-[24px] bg-[var(--surface-strong)] p-5">
              <p className="text-sm text-muted">{latest.topic.subject.name ?? latest.topic.subject.title}</p>
              <p className="mt-2 text-2xl font-semibold">{latest.topic.title}</p>
              <p className="mt-2 text-sm text-muted">Saved progress: {latest.completed}% complete</p>
            </Link>
          ) : (
            <div className="space-y-4">
              <p className="text-muted">No progress yet. Start with any subject and your latest topic will appear here.</p>
              <Link href="/subjects" className="inline-flex rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">
                Browse subjects
              </Link>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}
