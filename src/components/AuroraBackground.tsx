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

      <div className="absolute -top-32 -left-24 h-[34rem] w-[34rem] rounded-full bg-aurora-violet/20 blur-[120px] animate-float-slow" />
      <div className="absolute top-1/3 -right-24 h-[30rem] w-[30rem] rounded-full bg-aurora-cyan/20 blur-[120px] animate-float" />
      <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-aurora-magenta/15 blur-[120px] animate-float-slow" />

      {/* Subtle vignette to keep text legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/80" />
    </div>
  );
};

export default AuroraBackground;
