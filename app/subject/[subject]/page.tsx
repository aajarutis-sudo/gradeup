import { redirect } from "next/navigation";

export default async function SubjectAliasPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  redirect(`/subjects/${subject}`);
}
