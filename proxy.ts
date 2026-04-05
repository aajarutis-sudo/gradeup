import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/dashboard(.*)",
  "/chat(.*)",
  "/subjects(.*)",
  "/topics(.*)",
  "/continue(.*)",
  "/schedule(.*)",
  "/streak(.*)",
  "/revision(.*)",
  "/api/progress(.*)",
  "/api/ai(.*)",
  "/api/quiz(.*)",
  "/api/streak(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
