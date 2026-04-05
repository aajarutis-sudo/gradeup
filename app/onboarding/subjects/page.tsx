import { redirect } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import Card from "@/components/cards/Card";
import PageTitle from "@/components/ui/PageTitle";
import SubTitle from "@/components/ui/SubTitle";
import Badge from "@/components/ui/Badge";
import OnboardingSubjectSelection from "@/components/onboarding/OnboardingSubjectSelection";

export const metadata: Metadata = {
  title: "Select Subjects | GradeUp",
  description: "Choose your revision subjects and exam boards",
};

export default async function OnboardingSubjectsPage() {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/sign-in");
  }

  const subjects = await prisma.subject.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <MainLayout>
      <OnboardingShell currentStep={1}>
        <div className="space-y-6">
          <div className="space-y-3">
            <Badge>Step 1</Badge>
            <PageTitle className="text-4xl">Choose your revision subjects</PageTitle>
            <SubTitle>Select the subjects you want to revise for and choose your exam board. You can select multiple subjects.</SubTitle>
          </div>

          <OnboardingSubjectSelection subjects={subjects} />

          {subjects.length === 0 && (
            <Card className="text-center py-12">
              <PageTitle>No subjects available</PageTitle>
              <SubTitle className="mt-2">Please contact support to get started.</SubTitle>
            </Card>
          )}
        </div>
      </OnboardingShell>
    </MainLayout>
  );
}
