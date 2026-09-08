export function CtaBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 42% at 50% 50%, #ffffff 0%, #f7f8fa 48%, transparent 72%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 88% 78% at 50% 50%, transparent 0%, transparent 46%, rgba(43, 95, 107, 0.04) 58%, rgba(43, 95, 107, 0.12) 74%, rgba(43, 95, 107, 0.16) 88%, rgba(43, 95, 107, 0.08) 100%)",
        }}
      />
    </div>
  );
}
