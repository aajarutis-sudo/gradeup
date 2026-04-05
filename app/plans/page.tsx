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
              <h2 className="mt-3 text-3xl font-extrabold">Your paid layer</h2>
              <p className="mt-3 text-sm text-muted">Use this tier for the features you do not want to hand out widely.</p>
              <div className="mt-6 space-y-3">
                {plusFeatures.map((feature) => (
                  <div key={feature} className="rounded-[22px] bg-[var(--background)] p-4 text-sm">
                    {feature}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[24px] bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] p-4 text-sm text-muted">
                For now, you can manually control Plus access through env allowlists while you decide on Stripe or another payment flow later.
              </div>
            </Card>
          </div>

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
