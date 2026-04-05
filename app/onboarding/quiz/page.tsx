import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import { getDiagnosticQuestions } from "@/lib/onboarding";
import MainLayout from "@/components/layout/MainLayout";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import DiagnosticQuizClient from "@/components/onboarding/DiagnosticQuizClient";

export default async function OnboardingQuizPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/sign-in");
  }

  const { subject: subjectSlug } = await searchParams;
  if (!subjectSlug) {
    redirect("/onboarding/subjects");
  }

  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
  });

  if (!subject) {
    notFound();
  }

  // Get all user's selected subjects to show progress
  const userSubjects = await prisma.userSubject.findMany({
    where: { userId: viewer.id },
    include: { subject: true },
    orderBy: { subject: { title: "asc" } },
  });

  const totalSubjects = userSubjects.length;
  const currentIndex = userSubjects.findIndex((us) => us.subject.slug === subjectSlug);
  const quizNumber = currentIndex + 1;

  // Get user's exam board selection for this subject
  const userSubject = userSubjects.find((us) => us.subject.slug === subjectSlug);
  const examBoardSlug = userSubject?.examBoardSlug || undefined;
  const questions = await getDiagnosticQuestions(subjectSlug, 3, examBoardSlug);

  // Get next subject slug if exists
  const nextSubject = userSubjects[currentIndex + 1];
  const nextSubjectSlug = nextSubject?.subject.slug;

  return (
    <MainLayout>
      <OnboardingShell currentStep={2}>
        <DiagnosticQuizClient
          subjectSlug={subject.slug}
          subjectName={subject.name ?? subject.title}
          quizNumber={quizNumber}
          totalSubjects={totalSubjects}
          nextSubjectSlug={nextSubjectSlug}
          questions={questions.map((question) => ({
            id: question.id,
            prompt: question.prompt,
            marks: question.marks,
            difficulty: question.difficulty,
            examBoard: question.examBoard,
            year: question.year,
            sampleAnswer: question.correctAnswer,
          }))}
        />
      </OnboardingShell>
    </MainLayout>
  );
}
