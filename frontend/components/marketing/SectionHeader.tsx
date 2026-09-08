interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`${isCenter ? "mx-auto max-w-3xl text-center" : "max-w-2xl"} ${className}`}
    >
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink-primary md:text-3xl lg:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-ink-secondary md:text-base">
        {description}
      </p>
    </div>
  );
}
