export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {description ? (
        <p className="max-w-2xl text-base text-muted">{description}</p>
      ) : null}
    </div>
  );
}
