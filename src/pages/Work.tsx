import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import SectionHeading from "@/components/SectionHeading";
import { caseStudies } from "@/data/caseStudies";
import { projects } from "@/data/portfolio";
import { riseUp, useRevealGroup } from "@/lib/motion";

/**
 * Numbered index of everything: the six case studies first (internal
 * links), then the remaining projects as compact archive rows that link
 * to their repositories. Curation over filtering.
 */
const Work = () => {
  const { t } = useTranslation();
  const revealGroup = useRevealGroup();
  const caseSlugs = new Set(caseStudies.map((c) => c.slug));
  const archive = projects.filter((p) => !p.slug || !caseSlugs.has(p.slug));

  return (
    <>
      <Seo
        title={t("work.title")}
        description="Sixteen projects across product, research, and data — six written up as full case studies with context, decisions, and outcomes."
        path="/work"
      />
      <div className="container pt-32">
        <header className="max-w-3xl">
          <span className="meta-line uppercase">{t("work.eyebrow")}</span>
          <h1 className="mt-4 font-display text-display-lg font-bold text-foreground">
            {t("work.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t("work.description")}
          </p>
        </header>

        <section className="mt-16" aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="meta-line uppercase">
            {t("work.featuredHeading")}
          </h2>
          <motion.ol
            {...revealGroup}
            className="mt-4"
          >
            {caseStudies.map((cs, i) => (
              <motion.li key={cs.slug} variants={riseUp} className="hairline-t">
                <Link
                  to={`/work/${cs.slug}`}
                  className="group grid gap-2 py-6 transition-colors hover:bg-secondary/40 md:grid-cols-[3rem_1fr_auto] md:items-baseline md:gap-6 md:px-4"
                >
                  <span className="meta-line">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="font-display text-xl font-semibold text-foreground transition-colors group-hover:text-accent md:text-2xl">
                      {cs.project}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {t(cs.summaryKey)}
                    </span>
                    <span className="meta-line mt-2 block">{cs.evidence}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                    {t("work.caseStudy")}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </motion.ol>
        </section>

        <section className="mb-8 mt-16" aria-labelledby="archive-heading">
          <h2 id="archive-heading" className="meta-line uppercase">
            {t("work.archiveHeading")}
          </h2>
          <motion.ol
            {...revealGroup}
            className="mt-4"
            start={caseStudies.length + 1}
          >
            {archive.map((p, i) => (
              <motion.li key={p.title} variants={riseUp} className="hairline-t">
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-1 py-5 transition-colors hover:bg-secondary/40 md:grid-cols-[3rem_1fr_auto_auto] md:items-baseline md:gap-6 md:px-4"
                >
                  <span className="meta-line">
                    {String(caseStudies.length + i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="font-medium text-foreground transition-colors group-hover:text-accent">
                      {p.title}
                    </span>
                    {p.outcome && (
                      <span className="meta-line mt-1 block md:mt-0.5">{p.outcome}</span>
                    )}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t(`category.${p.category}`)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors group-hover:text-accent">
                    {t("work.external")}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </a>
              </motion.li>
            ))}
          </motion.ol>
        </section>
      </div>
    </>
  );
};

export default Work;
