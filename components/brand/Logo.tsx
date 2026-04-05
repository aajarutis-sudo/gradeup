import Link from "next/link";

type LogoProps = {
  href?: string;
  className?: string;
  variant?: "light" | "dark" | "auto";
  showWordmark?: boolean;
};

export default function Logo({
  href = "/",
  className = "",
  variant = "auto",
  showWordmark = true,
}: LogoProps) {
  const fill = variant === "light" ? "#E5E7EB" : variant === "dark" ? "#111827" : "currentColor";
  const glow = variant === "light" ? "#A5B4FC" : "#4F46E5";

  return (
    <Link href={href} className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 84 64" aria-hidden="true" className="h-10 w-12">
        <rect x="4" y="26" width="12" height="30" rx="5" fill={fill} opacity="0.75" />
        <rect x="24" y="18" width="12" height="38" rx="5" fill={fill} opacity="0.82" />
        <rect x="44" y="10" width="12" height="46" rx="5" fill={fill} opacity="0.9" />
        <path
          d="M11 19c13.2 0 23.4-6.5 33-13l4.7 6.6c7.5-2.2 16.1-1.8 26.3 2.7l-2 8.4c-8.1-3.2-14.3-3.9-20.6-2.4l3.3 5.2-6.8 4.2L38 15.7C30.2 21.5 21.1 27 11 27V19Z"
          fill={glow}
        />
      </svg>
      {showWordmark ? (
        <span className="text-2xl font-extrabold tracking-tight">GradeUp</span>
      ) : null}
    </Link>
  );
}
