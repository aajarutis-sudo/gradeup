import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Card from "@/components/cards/Card";
import PageTitle from "@/components/ui/PageTitle";
import SubTitle from "@/components/ui/SubTitle";
import Badge from "@/components/ui/Badge";

const spending = [
  "40% — Hosting + AI usage",
  "30% — Content creation + teacher verification",
  "20% — Accessibility improvements",
  "10% — Community programs",
];

const donationOptions = [
  "One-time",
  "Monthly supporter",
  "Sponsor-a-student",
  "Corporate sponsorship",
];

const supporterPerks = [
  "Supporter badge",
  "Early access to new features",
  "Name on the public thank-you wall (optional)",
];

export default function SupportPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Container className="space-y-10 py-16">
          <section className="space-y-5 animate-fade-up">
            <Badge>Support GradeUp</Badge>
            <PageTitle>Support free education for every student</PageTitle>
            <SubTitle>
              Your donation helps keep GradeUp free, accessible, and ad-free for thousands of learners.
            </SubTitle>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="rounded-[34px]">
              <Badge>Why Donate?</Badge>
              <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
                <p>Keep the platform free for all.</p>
                <p>Support server and AI costs.</p>
                <p>Fund new features and accessibility tools.</p>
                <p>Help disadvantaged students access quality revision.</p>
              </div>
            </Card>

            <Card className="rounded-[34px]">
              <Badge>Support Options</Badge>
              <div className="mt-4 grid gap-3">
                {donationOptions.map((option) => (
                  <div key={option} className="rounded-[22px] bg-[var(--background)] p-4 text-sm font-semibold">
                    {option}
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-[34px]">
              <Badge>Where Your Money Goes</Badge>
              <div className="mt-4 space-y-3">
                {spending.map((item) => (
                  <div key={item} className="rounded-[22px] bg-[var(--background)] p-4 text-sm text-muted">
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[34px]">
              <Badge>Supporter Perks</Badge>
              <div className="mt-4 space-y-3">
                {supporterPerks.map((perk) => (
                  <div key={perk} className="rounded-[22px] bg-[var(--background)] p-4 text-sm text-muted">
                    {perk}
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <Card className="rounded-[36px]">
            <Badge>Donation Page Design</Badge>
            <PageTitle className="mt-3 text-3xl">Non-profit, student-first, transparent</PageTitle>
            <SubTitle className="mt-3">
              This page is designed as a mission-led supporter flow. When you plug in a payment provider later, the structure is already here.
            </SubTitle>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="mailto:gradeup@example.org" className="inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white">
                Contact for donations
              </a>
            </div>
          </Card>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
