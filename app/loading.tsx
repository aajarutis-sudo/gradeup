import MainLayout from "@/components/layout/MainLayout";
import Skeleton from "@/components/ui/Skeleton";

export default function GlobalLoading() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-72" />
      </div>
    </MainLayout>
  );
}
