import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Card from "@/components/cards/Card";
import PageTitle from "@/components/ui/PageTitle";
import SubTitle from "@/components/ui/SubTitle";
import Badge from "@/components/ui/Badge";

const freeFeatures = [
  "Subject pages and ordered topics",
  "Core quizzes and flashcards",
  "Revision timetable and schedule tools",
  "Past paper browsing and paper viewer",
  "Onboarding, dashboard, streaks, and XP",
];

const plusFeatures = [
  "AI Coach chat",
  "AI-generated topic notes",
  "AI practice question sets",
  "Deeper personalised AI revision help",
];

export default async function PlansPage() {
  const { userId } = await auth();
  const comparisonRows = [
    { label: "Subjects and ordered units", free: true, plus: true },
    { label: "Core quizzes and flashcards", free: true, plus: true },
    { label: "Revision timetable tools", free: true, plus: true },
    { label: "Past paper browsing", free: true, plus: true },
    { label: "AI Coach chat", free: false, plus: true },
    { label: "AI-generated notes", free: false, plus: true },
    { label: "AI practice question generation", free: false, plus: true },
    { label: "Deeper personalised AI support", free: false, plus: true },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Container className="space-y-10 py-20">
          <div className="space-y-4">
            <Badge>Plans</Badge>
            <PageTitle>Keep the core revision free. Charge for the heavy AI layer.</PageTitle>
            <SubTitle>
              GradeUp Free stays generous so students can actually revise. GradeUp Plus unlocks the expensive AI tools that take more compute and feel premium.
            </SubTitle>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-[32px]">
              <Badge>GradeUp Free</Badge>
              <h2 className="mt-3 text-3xl font-extrabold">£0</h2>
              <p className="mt-3 text-sm text-muted">A strong free plan that still feels useful, not crippled.</p>
              <div className="mt-6 space-y-3">
                {freeFeatures.map((feature) => (
                  <div key={feature} className="rounded-[22px] bg-[var(--background)] p-4 text-sm">
                    {feature}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[32px] border-2 border-[var(--primary)]">
              <Badge>GradeUp Plus</Badge>
              <h2 className="mt-3 text-3xl font-extrabold">Coming soon</h2>
              <p className="mt-3 text-sm text-muted">Planned as the paid layer for students who want the heavier AI tools on top of the free revision core.</p>
              <div className="mt-6 space-y-3">
                {plusFeatures.map((feature) => (
                  <div key={feature} className="rounded-[22px] bg-[var(--background)] p-4 text-sm">
                    {feature}
                  </div>
                ))}
              </div>
              <div className="surface-soft mt-6 rounded-[24px] border border-[var(--border)] p-4 text-sm italic text-muted">
                Price not final yet. The goal is to keep the core revision layer strong and only charge for the expensive AI features.
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={userId ? "/support" : "/sign-in?redirect_url=/support"}
                  className="inline-flex rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Notify me
                </Link>
                <Link href="/mission" className="inline-flex rounded-full bg-[var(--background)] px-5 py-3 text-sm font-semibold">
                  Why Plus exists
                </Link>
              </div>
            </Card>
          </div>

          <Card className="rounded-[32px]">
            <Badge>Compare plans</Badge>
            <div className="mt-4 overflow-hidden rounded-[24px] border border-[var(--border)]">
              <div className="grid grid-cols-[1.3fr_0.6fr_0.6fr] bg-[var(--background-elevated)] px-5 py-4 text-sm font-semibold">
                <div>Feature</div>
                <div className="text-center">Free</div>
                <div className="text-center">Plus</div>
              </div>
              {comparisonRows.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1.3fr_0.6fr_0.6fr] px-5 py-4 text-sm ${index % 2 === 0 ? "bg-[var(--background)]" : "bg-[var(--background-elevated)]/60"}`}
                >
                  <div>{row.label}</div>
                  <div className="text-center font-semibold">{row.free ? "Yes" : "No"}</div>
                  <div className="text-center font-semibold">{row.plus ? "Yes" : "No"}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-wrap gap-4">
            <Link
              href={userId ? "/dashboard" : "/sign-in?redirect_url=/dashboard"}
              className="inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white"
            >
              {userId ? "Back to dashboard" : "Start revising"}
            </Link>
            <Link href="/subjects" className="inline-flex rounded-full bg-[var(--background-elevated)] px-6 py-3 text-sm font-semibold">
              Browse subjects
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
