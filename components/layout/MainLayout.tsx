import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Container from "@/components/ui/Container";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="page-shell">
      <Container className="space-y-6">
        <Header />
        <div className="flex items-start gap-6">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </Container>
    </div>
  );
}
