import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "@/components/brand/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Logo showWordmark />
          <p className="text-sm text-muted">No paywalls. No ads. Just learning.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <Link href="/">Home</Link>
          <Link href="/mission">Mission</Link>
          <Link href="/transparency">Transparency</Link>
          <Link href="/support">Donate</Link>
          <Link href="/subjects">Subjects</Link>
          <Link href="/chat">AI Coach</Link>
        </div>
      </Container>
    </footer>
  );
}
