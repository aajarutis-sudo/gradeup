import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Card from "@/components/cards/Card";
import PageTitle from "@/components/ui/PageTitle";
import SubTitle from "@/components/ui/SubTitle";
import Badge from "@/components/ui/Badge";

const features = [
  {
    title: "Diagnostic quiz",
    description: "Start with a quick baseline so students stop guessing and see where to focus first.",
  },
  {
    title: "Predicted grade engine",
    description: "Turn early quiz performance into a rough GCSE grade picture with clear next steps.",
  },
  {
    title: "Personalised revision plan",
    description: "Build a realistic timetable around weak topics instead of dumping every unit into one list.",
  },
  {
    title: "Flashcards",
    description: "Revise key facts, vocabulary, quotes, and methods in small chunks that feel manageable.",
  },
  {
    title: "Quizzes",
    description: "Practice topic by topic with structured questions, progress tracking, and clearer feedback.",
  },
  {
    title: "Streaks, XP, and levels",
    description: "Keep momentum up with simple progression that makes revision feel steady instead of punishing.",
  },
];

const productValues = [
  "Free users still get strong revision tools from day one.",
  "Plus is reserved for the expensive AI layer: chat, notes, and extra practice.",
  "Built to feel calm, focused, and genuinely useful when exams are close.",
];

const trustSignals = [
  "Board-specific subjects and ordered units instead of one generic course list.",
  "Free tools stay useful on their own, so students can revise before they ever upgrade.",
  "Designed to feel calmer than a giant homework portal when exams are getting close.",
];

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    const viewer = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    redirect(viewer?.onboardedAt ? "/dashboard" : "/onboarding");
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Container className="py-20">
          <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6 animate-fade-up">
              <Badge>Built for exam-board-specific GCSE revision</Badge>
              <PageTitle>Know what to revise next, not just where your notes are</PageTitle>
              <SubTitle>
                GradeUp turns subjects into ordered units, topic notes, quizzes, flashcards, and revision plans that match the board students actually sit. Free stays strong. Plus unlocks the heavier AI layer.
              </SubTitle>
              <div className="flex flex-wrap gap-4">
                <Link href="/sign-in?redirect_url=/onboarding" className="inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white">
                  Start Revising
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {trustSignals.map((signal) => (
                  <div key={signal} className="rounded-3xl bg-[var(--background-elevated)] px-4 py-4 text-sm text-muted">
                    {signal}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 animate-fade-up stagger-2">
              <Card className="rounded-[36px]">
                <div className="grid gap-4 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div key={feature.title} className="rounded-3xl bg-[var(--background)] p-4">
                      <p className="font-semibold">{feature.title}</p>
                      <p className="mt-2 text-sm text-muted">{feature.description}</p>
                    </div>
                  ))}
                </div>
                <div className="surface-soft mt-4 rounded-[30px] border border-[var(--border)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">Why it works</p>
                  <div className="mt-3 space-y-3">
                  {productValues.map((value, index) => (
                    <div key={value} className={`rounded-3xl bg-[var(--background)] p-4 text-sm text-muted animate-fade-up stagger-${(index % 4) + 1}`}>
                      {value}
                    </div>
                  ))}
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </Container>

        <section id="features" className="py-10">
          <Container className="space-y-8">
            <div className="space-y-3">
              <Badge>Core features</Badge>
              <PageTitle className="text-3xl sm:text-4xl">Built for focused GCSE revision</PageTitle>
              <SubTitle>Everything is designed to help students know what to revise, why it matters, and what to do next.</SubTitle>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={feature.title} className={`stagger-${(index % 4) + 1}`}>
                  <p className="text-lg font-bold">{feature.title}</p>
                  <p className="mt-2 text-sm text-muted">{feature.description}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-10">
          <Container className="space-y-8">
            <div className="space-y-3">
              <Badge>Why it feels different</Badge>
              <PageTitle className="text-3xl sm:text-4xl">A calmer way to revise when exams are close</PageTitle>
              <SubTitle>
                GradeUp is built to remove clutter. Students get board-specific subjects, a clear route through each course, and fewer dead ends between notes, quizzes, and papers.
              </SubTitle>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Less scrolling, more revising",
                  body: "Compact unit maps stop subjects turning into huge, messy pages and make it easier to pick a sensible next step.",
                },
                {
                  title: "Board-specific from the start",
                  body: "Students can choose their subject and exam board instead of being pushed into one generic revision path.",
                },
                {
                  title: "Free first, AI second",
                  body: "Core revision tools are already useful. The paid layer is for heavier AI help, not basic access.",
                },
              ].map((item) => (
                <Card key={item.title}>
                  <p className="text-base font-semibold">{item.title}</p>
                  <p className="mt-3 text-sm text-muted">{item.body}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-10">
          <Container>
            <Card className="rounded-[36px]">
              <Badge>Positioning</Badge>
              <PageTitle className="mt-3 text-3xl sm:text-4xl">Start free. Upgrade for the AI layer.</PageTitle>
              <SubTitle className="mt-3">
                The free plan covers the essentials properly: subjects, quizzes, flashcards, revision scheduling, and past papers. GradeUp Plus gives you the compute-heavy tools without forcing every user onto paid access.
              </SubTitle>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/plans" className="inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white">
                  View plans
                </Link>
                <Link href="/subjects" className="inline-flex rounded-full bg-[var(--background)] px-6 py-3 text-sm font-semibold">
                  Explore subjects
                </Link>
              </div>
            </Card>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
