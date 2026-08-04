import { motion } from "framer-motion";
import { useReveal } from "@/lib/motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  /** Applied to the <h2> so a section can reference it via aria-labelledby. */
  id?: string;
}

/**
 * Shared section header: a small monospaced evidence eyebrow, a display
 * title, and an optional supporting line. Reveals once on scroll.
 */
const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
  id,
}: SectionHeadingProps) => {
  const reveal = useReveal();
  const isCenter = align === "center";

  return (
    <motion.header
      {...reveal}
      className={isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
    >
      <span className={`meta-line inline-flex items-center gap-2 uppercase ${isCenter ? "justify-center" : ""}`}>
        <span className="h-px w-6 bg-signal/60" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2 id={id} className="mt-4 font-display text-display-md font-bold text-foreground">
        {title}
      </h2>
      {description && (
        <p className={`mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg ${isCenter ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </motion.header>
  );
};

export default SectionHeading;
