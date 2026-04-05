import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/onboarding");
  }

  return (
    <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
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
