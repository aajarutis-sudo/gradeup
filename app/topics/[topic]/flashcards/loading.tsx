import MainLayout from "@/components/layout/MainLayout";
import Skeleton from "@/components/ui/Skeleton";

export default function TopicFlashcardsLoading() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-80" />
      </div>
    </MainLayout>
  );
}
