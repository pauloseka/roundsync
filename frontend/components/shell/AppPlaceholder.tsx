interface AppPlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function AppPlaceholder({ eyebrow, title, description }: AppPlaceholderProps) {
  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-6 py-12">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-primary">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{description}</p>
      </div>
    </div>
  );
}
