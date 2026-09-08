interface HeroBackgroundProps {
  /** Vertical focal point for radial gradients (percentage). */
  focalY?: number;
  /**
   * Bottom fade — light/surface hand off to the next section.
   * Use "none" when a solid border separates sections (e.g. before the footer).
   */
  fadeTarget?: "light" | "surface" | "none";
}

export function HeroBackground({
  focalY = 38,
  fadeTarget = "light",
}: HeroBackgroundProps = {}) {
  const focal = `50% ${focalY}%`;

  const bottomFadeByTarget: Record<Exclude<HeroBackgroundProps["fadeTarget"], "none" | undefined>, string> = {
    light:
      "linear-gradient(to bottom, transparent 0%, rgba(247, 248, 250, 0.55) 45%, rgba(255, 255, 255, 0.92) 82%, #ffffff 100%)",
    surface:
      "linear-gradient(to bottom, transparent 0%, rgba(247, 248, 250, 0.55) 45%, rgba(247, 248, 250, 0.95) 82%, #f7f8fa 100%)",
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base — white center fading into surface */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 50% 42% at ${focal}, #ffffff 0%, #f7f8fa 48%, transparent 72%)`,
        }}
      />

      {/* Teal ring — softer at the outer edge */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 88% 78% at ${focal}, transparent 0%, transparent 50%, rgba(43, 95, 107, 0.03) 62%, rgba(43, 95, 107, 0.08) 78%, rgba(43, 95, 107, 0.1) 92%, rgba(43, 95, 107, 0.04) 100%)`,
        }}
      />

      {/* Side blooms — lighter touch */}
      <div
        className="absolute -left-[8%] top-[16%] h-[50%] w-[42%] rounded-[50%] blur-[96px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(43, 95, 107, 0.1) 0%, rgba(43, 95, 107, 0.03) 50%, transparent 78%)",
        }}
      />
      <div
        className="absolute -right-[8%] top-[16%] h-[50%] w-[42%] rounded-[50%] blur-[96px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(43, 95, 107, 0.1) 0%, rgba(43, 95, 107, 0.03) 50%, transparent 78%)",
        }}
      />

      {/* Lower bloom — very soft, kept above the base */}
      <div
        className="absolute -bottom-[6%] left-1/2 h-[38%] w-[80%] -translate-x-1/2 rounded-[50%] blur-[110px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(43, 95, 107, 0.06) 0%, rgba(43, 95, 107, 0.02) 55%, transparent 80%)",
        }}
      />

      {/* Bottom fade — gentle handoff into the next section */}
      {fadeTarget !== "none" ? (
        <div
          className="absolute inset-x-0 bottom-0 h-[45%]"
          style={{ background: bottomFadeByTarget[fadeTarget] }}
        />
      ) : null}
    </div>
  );
}
