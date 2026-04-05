import { redirect } from "next/navigation";
import { getViewer } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import ChatbotClient from "@/components/chat/ChatbotClient";

export default async function ChatPage() {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/sign-in");
  }

  return (
    <MainLayout>
      <ChatbotClient />
    </MainLayout>
  );
}
