import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";
import { useReveal } from "@/lib/motion";

const PAPER_URL =
  "https://conf.researchr.org/details/ease-2026/ease-2026-research-papers/2/Do-Privacy-Policies-Match-with-the-Logs-An-Empirical-Study-of-Privacy-Disclosure-in-";

/**
 * BibTeX for the paper. TODO(Love): complete the author list and add the
 * DOI/pages once the ACM record is live — only verified fields are included.
 */
const BIBTEX = `@inproceedings{ahir2026privacy,
  title     = {Do Privacy Policies Match with the Logs? An Empirical
               Study of Privacy Disclosure in Android Apps},
  author    = {Ahir, Love Jayesh and others},
  booktitle = {Proceedings of the 30th International Conference on
               Evaluation and Assessment in Software Engineering (EASE)},
  year      = {2026},
  note      = {Research Track}
}`;

interface Finding {
  value: number;
  display: string;
  labelKey: string;
}

const findings: Finding[] = [
  { value: 67.6, display: "67.6%", labelKey: "research.finding1" },
  { value: 0.4, display: "0.4%", labelKey: "research.finding2" },
];

const Research = () => {
  const { t } = useTranslation();
  const reveal = useReveal();
  const [copied, setCopied] = useState(false);
  const reducedMotion = useReducedMotion();

  const copyBibtex = async () => {
    try {
      await navigator.clipboard.writeText(BIBTEX);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the BibTeX is selectable text below.
    }
  };

  return (
    <>
      <Seo
        title={t("research.title")}
        description="EASE 2026 empirical study of 1,000 Android apps and 86M+ log entries: 67.6% of apps logged sensitive data their privacy policies never disclosed."
        path="/research"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ScholarlyArticle",
          headline:
            "Do Privacy Policies Match with the Logs? An Empirical Study of Privacy Disclosure in Android Apps",
          author: [{ "@type": "Person", name: "Love Jayesh Ahir" }],
          publication: "EASE 2026 Research Track",
          url: PAPER_URL,
        }}
      />
      <div className="container pt-32">
        <header className="max-w-3xl">
          <span className="meta-line uppercase">{t("research.venue")}</span>
          <h1 className="mt-4 font-display text-display-md font-bold text-foreground">
            {t("research.title")}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{t("research.subtitle")}</p>
          <a
            href={PAPER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-md border border-signal/40 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-signal hover:bg-signal/10"
          >
            {t("research.viewOnConf")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </header>

        <motion.section
          {...reveal}
          className="mt-14 max-w-2xl"
        >
          <h2 className="meta-line uppercase">{t("research.abstractHeading")}</h2>
          <p className="mt-4 leading-relaxed text-foreground/90">{t("research.abstract")}</p>
        </motion.section>

        <motion.section
          {...reveal}
          className="mt-14 max-w-3xl"
        >
          <h2 className="meta-line uppercase">{t("research.findingsHeading")}</h2>

          {/* Findings chart: horizontal bars, animated once; a data table
              mirror keeps the numbers available to screen readers. */}
          <div aria-hidden="true" className="mt-6 space-y-6">
            {findings.map((f) => (
              <div key={f.labelKey}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-2xl font-bold text-signal">{f.display}</span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full bg-signal"
                    initial={reducedMotion ? { width: `${f.value}%` } : { width: 0 }}
                    whileInView={{ width: `${Math.max(f.value, 0.8)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: reducedMotion ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t(f.labelKey)}</p>
              </div>
            ))}
            <p className="meta-line">{t("research.vizCaption")}</p>
          </div>

          {/*
            The sr-only wrapper is a <div>, not the <table> itself: a table
            treats sr-only's 1px width as a minimum and auto-expands to fit
            its content, which pushed the page past 320px even though nothing
            was visible. Clipping happens on the block parent instead.
          */}
          <div className="sr-only">
            <table>
              <caption>{t("research.vizTableCaption")}</caption>
              <thead>
                <tr>
                  <th scope="col">Finding</th>
                  <th scope="col">Share of 1,000 apps</th>
                </tr>
              </thead>
              <tbody>
                {findings.map((f) => (
                  <tr key={f.labelKey}>
                    <td>{t(f.labelKey)}</td>
                    <td>{f.display}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 leading-relaxed text-foreground/90">{t("research.finding3")}</p>
        </motion.section>

        <motion.section
          {...reveal}
          className="mt-14 max-w-2xl"
        >
          <h2 className="meta-line uppercase">{t("research.methodHeading")}</h2>
          <p className="mt-4 leading-relaxed text-foreground/90">{t("research.method")}</p>
        </motion.section>

        <motion.section
          {...reveal}
          className="mb-8 mt-14 max-w-3xl"
        >
          <h2 className="meta-line uppercase">{t("research.citationHeading")}</h2>
          <div className="relative mt-4 rounded-lg border border-border bg-card">
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-muted-foreground">
              {BIBTEX}
            </pre>
            <button
              type="button"
              onClick={copyBibtex}
              className="absolute right-3 top-3 inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-signal" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t("research.copied") : t("research.copyBibtex")}
            </button>
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default Research;
