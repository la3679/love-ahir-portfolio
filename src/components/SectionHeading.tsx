import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

/**
 * Shared section header: a small monospaced eyebrow, a gradient title,
 * and an optional supporting line. Animates in on scroll.
 */
const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) => {
  const isCenter = align === "center";

  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full border border-aurora-cyan/20 bg-aurora-cyan/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.22em] text-aurora-cyan ${
          isCenter ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-6 bg-aurora-cyan/60" />
        {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl font-bold leading-tight text-gradient md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </motion.header>
  );
};

export default SectionHeading;
