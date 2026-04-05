import { auth } from "@clerk/nextjs/server";
import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/onboarding");
  }

  return (
    <SignUp
      path="/sign-up"
      routing="path"
      signInUrl="/sign-in"
      forceRedirectUrl="/onboarding"
      appearance={{
        variables: {
          colorPrimary: "#4F46E5",
          colorText: "#111827",
          colorBackground: "#FFFFFF",
          colorInputBackground: "#F9FAFB",
          colorInputText: "#111827",
          borderRadius: "1rem",
        },
      }}
    />
  );
}
