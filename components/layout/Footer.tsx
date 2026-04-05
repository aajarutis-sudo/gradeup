import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "@/components/brand/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Logo showWordmark />
          <p className="text-sm text-muted">Core revision stays simple. Plus unlocks the heavy AI tools.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <Link href="/">Home</Link>
          <Link href="/plans">Plans</Link>
          <Link href="/subjects">Subjects</Link>
          <Link href="/chat">AI Coach</Link>
        </div>
      </Container>
    </footer>
  );
}
