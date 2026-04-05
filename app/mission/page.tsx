import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Card from "@/components/cards/Card";
import PageTitle from "@/components/ui/PageTitle";
import SubTitle from "@/components/ui/SubTitle";
import Badge from "@/components/ui/Badge";

const values = [
  {
    title: "Accessibility",
    meaning: "Every student deserves equal access to revision tools.",
  },
  {
    title: "Community",
    meaning: "Students, teachers, and volunteers build GradeUp together.",
  },
  {
    title: "Transparency",
    meaning: "Open data, open resources, open development.",
  },
  {
    title: "Equity",
    meaning: "No paywalls, no ads, no exploitation.",
  },
  {
    title: "Empowerment",
    meaning: "Tools that help students learn confidently and independently.",
  },
];

export default function MissionPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Container className="space-y-10 py-16">
          <section className="space-y-5 animate-fade-up">
            <Badge>Mission</Badge>
            <PageTitle>Free GCSE revision for every student</PageTitle>
            <SubTitle>
              GradeUp is a student-first, community-powered learning platform dedicated to making high-quality GCSE revision free,
              accessible, and equitable for every learner. We exist to remove financial barriers, empower students with open educational
              resources, and build a supportive learning community where knowledge is shared, not sold.
            </SubTitle>
            <p className="max-w-4xl text-base leading-8 text-muted">
              Our mission is simple: help every student reach their full potential, regardless of background, income, or circumstance.
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="rounded-[34px]">
              <Badge>Brand Purpose</Badge>
              <PageTitle className="mt-3 text-3xl">Democratise GCSE revision</PageTitle>
              <SubTitle className="mt-3">
                We want GradeUp to provide free, high-quality, community-driven learning tools for all students.
              </SubTitle>
            </Card>

            <Card className="rounded-[34px]">
              <Badge>Brand Voice</Badge>
              <div className="mt-4 space-y-3 text-sm text-muted">
                <p>Warm, supportive, student-friendly.</p>
                <p>Clear, simple, jargon-free.</p>
                <p>Encouraging, never overwhelming.</p>
                <p>Transparent, honest, and community-driven.</p>
              </div>
            </Card>
          </section>

          <section className="space-y-4">
            <Badge>Brand Values</Badge>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {values.map((value, index) => (
                <Card key={value.title} className={`rounded-[30px] animate-fade-up stagger-${(index % 4) + 1}`}>
                  <p className="text-lg font-bold">{value.title}</p>
                  <p className="mt-2 text-sm text-muted">{value.meaning}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-[34px]">
              <Badge>Visual Identity</Badge>
              <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
                <p>Primary: deep blue for trust and education.</p>
                <p>Secondary: bright green for growth and progress.</p>
                <p>Accent: soft yellow for optimism and accessibility.</p>
                <p>Minimal, calm, student-friendly layouts with high contrast and accessible reading options.</p>
              </div>
            </Card>

            <Card className="rounded-[34px]">
              <Badge>Positioning</Badge>
              <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
                <p>Education for everyone.</p>
                <p>No paywalls. No ads. Just learning.</p>
                <p>Built by students, for students.</p>
                <p>Supported by the community.</p>
              </div>
            </Card>
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
