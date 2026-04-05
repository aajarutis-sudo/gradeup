import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Card from "@/components/cards/Card";
import PageTitle from "@/components/ui/PageTitle";
import SubTitle from "@/components/ui/SubTitle";
import Badge from "@/components/ui/Badge";

const funding = [
  "Donations from supporters",
  "Education grants and non-profit support",
  "Partnerships aligned to the mission",
];

const spending = [
  "Hosting and infrastructure",
  "AI study tools and moderation costs",
  "Content creation and review",
  "Accessibility improvements",
  "Community and student support programs",
];

const openSourceItems = [
  "Notes",
  "Flashcards",
  "Question banks",
  "Roadmap",
];

const governance = [
  "Volunteer teachers",
  "Student contributors",
  "Advisory support as the project grows",
];

export default function TransparencyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Container className="space-y-10 py-16">
          <section className="space-y-5 animate-fade-up">
            <Badge>Transparency</Badge>
            <PageTitle>Transparency you can trust</PageTitle>
            <SubTitle>
              GradeUp is being built as a mission-first learning platform. This page makes the funding model, governance, and safety approach visible from day one.
            </SubTitle>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-[34px]">
              <Badge>How We’re Funded</Badge>
              <div className="mt-4 space-y-3">
                {funding.map((item) => (
                  <div key={item} className="rounded-[22px] bg-[var(--background)] p-4 text-sm text-muted">
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[34px]">
              <Badge>How We Spend Money</Badge>
              <div className="mt-4 space-y-3">
                {spending.map((item) => (
                  <div key={item} className="rounded-[22px] bg-[var(--background)] p-4 text-sm text-muted">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-[34px]">
              <Badge>Open Source</Badge>
              <div className="mt-4 space-y-3">
                {openSourceItems.map((item) => (
                  <div key={item} className="rounded-[22px] bg-[var(--background)] p-4 text-sm text-muted">
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[34px]">
              <Badge>Governance</Badge>
              <div className="mt-4 space-y-3">
                {governance.map((item) => (
                  <div key={item} className="rounded-[22px] bg-[var(--background)] p-4 text-sm text-muted">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <Card className="rounded-[36px]">
            <Badge>Privacy & Safety</Badge>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
              <p>No ads.</p>
              <p>No data selling.</p>
              <p>Student-safe AI design and supportive revision experiences.</p>
              <p>Clear accountability as GradeUp grows.</p>
            </div>
          </Card>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
