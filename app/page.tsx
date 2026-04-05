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

const testimonials = [
  { name: "Aisha", quote: "It helped me stop guessing what to revise and just get on with it." },
  { name: "Leo", quote: "The quiz feedback felt clear and calm. Way less overwhelming." },
  { name: "Maya", quote: "The dashboard made it obvious what I should do next." },
];

const features = [
  "Diagnostic quiz",
  "Predicted grade engine",
  "Personalised revision plan",
  "Flashcards",
  "Quizzes",
  "Streaks, XP, and levels",
];

const nonprofitValues = [
  "No paywalls. No ads. Just learning.",
  "Built to support students who need calm, accessible revision.",
  "Growing through community contributions, transparency, and open education.",
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
              <Badge>Education for everyone</Badge>
              <PageTitle>Free GCSE revision, built for students</PageTitle>
              <SubTitle>
                GradeUp is building calm, accessible GCSE revision with no paywalls, no ads, and no pressure. Personalised learning, AI support, and focused practice all in one place.
              </SubTitle>
              <div className="flex flex-wrap gap-4">
                <Link href="/sign-in?redirect_url=/onboarding" className="inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white">
                  Get Started
                </Link>
                <Link href="/#features" className="inline-flex rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-6 py-3 text-sm font-semibold">
                  Explore Features
                </Link>
                <Link href="/support" className="inline-flex rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-6 py-3 text-sm font-semibold">
                  Support GradeUp
                </Link>
              </div>
            </div>
            <div className="grid gap-4 animate-fade-up stagger-2">
              <Card className="rounded-[36px]">
                <div className="grid gap-4 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div key={feature} className="rounded-3xl bg-[var(--background)] p-4">
                      <p className="font-semibold">{feature}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  {nonprofitValues.map((value, index) => (
                    <div key={value} className={`rounded-3xl bg-[var(--background)] p-4 text-sm text-muted animate-fade-up stagger-${(index % 4) + 1}`}>
                      {value}
                    </div>
                  ))}
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
                <Card key={feature} className={`stagger-${(index % 4) + 1}`}>
                  <p className="text-lg font-bold">{feature}</p>
                  <p className="mt-2 text-sm text-muted">Clear guidance, focused practice, and progress that feels motivating.</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-10">
          <Container className="space-y-8">
            <div className="space-y-3">
              <Badge>Student feedback</Badge>
              <PageTitle className="text-3xl sm:text-4xl">A calmer way to revise</PageTitle>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name}>
                  <p className="text-base font-semibold">{testimonial.name}</p>
                  <p className="mt-3 text-sm text-muted">“{testimonial.quote}”</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-10">
          <Container>
            <Card className="rounded-[36px]">
              <Badge>Mission</Badge>
              <PageTitle className="mt-3 text-3xl sm:text-4xl">Built by students, for students</PageTitle>
              <SubTitle className="mt-3">
                GradeUp exists to make high-quality GCSE revision free, supportive, and accessible. We want every learner to have clear next steps, trustworthy tools, and a community that helps them keep going.
              </SubTitle>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/mission" className="inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white">
                  Read our mission
                </Link>
                <Link href="/transparency" className="inline-flex rounded-full bg-[var(--background)] px-6 py-3 text-sm font-semibold">
                  View transparency page
                </Link>
              </div>
            </Card>
          </Container>
        </section>

        <section className="py-10">
          <Container>
            <Card className="rounded-[36px]">
              <Badge>Support</Badge>
              <PageTitle className="mt-3 text-3xl sm:text-4xl">Free to use. Community-supported.</PageTitle>
              <SubTitle className="mt-3">
                GradeUp is staying free while we build. Support helps cover hosting, content review, accessibility work, and AI study tools without putting revision behind a paywall.
              </SubTitle>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/support" className="inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white">
                  Support GradeUp
                </Link>
                <Link href="/sign-in?redirect_url=/onboarding" className="inline-flex rounded-full bg-[var(--background)] px-6 py-3 text-sm font-semibold">
                  Start revising
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
