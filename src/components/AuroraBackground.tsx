/**
 * Fixed, full-viewport ambient backdrop: drifting aurora blobs over a
 * masked grid. Purely decorative and pointer-events-none.
 */
const AuroraBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-[0.6]" />
      <div className="absolute inset-0 aurora-noise opacity-[0.16]" />

      <div className="absolute -left-24 top-0 h-40 w-[120vw] -rotate-12 bg-gradient-to-r from-aurora-violet/20 via-aurora-cyan/10 to-transparent blur-3xl animate-float-slow" />
      <div className="absolute -right-32 top-1/3 h-44 w-[95vw] rotate-12 bg-gradient-to-r from-transparent via-aurora-magenta/12 to-aurora-cyan/18 blur-3xl animate-float" />
      <div className="absolute bottom-10 left-1/4 h-36 w-[90vw] -rotate-6 bg-gradient-to-r from-aurora-cyan/10 via-aurora-violet/12 to-aurora-magenta/10 blur-3xl animate-float-slow" />

      {/* Subtle vignette to keep text legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/80" />
    </div>
  );
};

export default AuroraBackground;
