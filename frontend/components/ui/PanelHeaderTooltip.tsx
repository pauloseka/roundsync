interface PanelHeaderTooltipProps {
  description: string;
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}

export function PanelHeaderTooltip({
  description,
  children,
  className = "",
  align = "left",
}: PanelHeaderTooltipProps) {
  const alignClass =
    align === "right" ? "right-0 text-right" : "left-0";

  return (
    <div className={`group/panel-header relative ${className}`}>
      {children}
      <div
        role="tooltip"
        className={`pointer-events-none absolute top-full z-30 mt-2 w-[min(100%,18rem)] rounded-lg border border-line bg-surface-card px-3 py-2.5 text-sm leading-relaxed text-ink-secondary opacity-0 shadow-lg transition-opacity duration-150 group-hover/panel-header:opacity-100 group-focus-within/panel-header:opacity-100 ${alignClass}`}
      >
        {description}
      </div>
    </div>
  );
}
