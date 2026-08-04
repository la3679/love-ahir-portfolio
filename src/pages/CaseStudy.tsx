import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useParams } from "react-router-dom";
import Seo from "@/components/Seo";
import MediaFrame from "@/components/MediaFrame";
import {
  getCaseStudy,
  adjacentCaseStudies,
  type CaseStudy as CaseStudyModel,
} from "@/data/caseStudies";
import { useReveal } from "@/lib/motion";

/**
 * Case-study template. Long-form body copy is English-only by design and
 * marked with lang="en"; chrome (labels, summary) follows the UI locale.
 */
const CaseStudy = () => {
  const { slug = "" } = useParams();
  const cs = getCaseStudy(slug);
  if (!cs) return <Navigate to="/404" replace />;
  return <CaseStudyBody cs={cs} />;
};

const CaseStudyBody = ({ cs }: { cs: CaseStudyModel }) => {
  const { t, i18n } = useTranslation();
  const reveal = useReveal();
  const { prev, next } = adjacentCaseStudies(cs.slug);
  const bodyLang = i18n.resolvedLanguage?.startsWith("en") ? undefined : "en";

  const sections: { labelKey: string; body: string[] }[] = [
    { labelKey: "case.context", body: cs.context },
    { labelKey: "case.problem", body: cs.problem },
    { labelKey: "case.approach", body: cs.approach },
    { labelKey: "case.shipped", body: cs.shipped },
    { labelKey: "case.retro", body: cs.retro },
  ];

  return (
    <>
      <Seo
        title={cs.project}
        description={cs.title}
        path={`/work/${cs.slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: cs.project,
          headline: cs.title,
          author: { "@type": "Person", name: "Love Jayesh Ahir" },
          url: `https://loveahir.com/work/${cs.slug}`,
        }}
      />
      <article className="container pt-32">
        <Link
          to="/work"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          {t("case.backToIndex")}
        </Link>

        <header className="mt-8 max-w-3xl">
          <span className="meta-line uppercase">
            {t("case.eyebrow")} · {t(`category.${cs.category}`)}
          </span>
          <h1 className="mt-4 font-display text-display-md font-bold text-foreground" lang={bodyLang}>
            {cs.title}
          </h1>
          <p className="meta-line mt-4">{cs.evidence}</p>
        </header>

        <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-4 text-sm md:grid-cols-4">
          <div>
            <dt className="text-muted-foreground">{t("case.role")}</dt>
            <dd className="mt-1 font-medium text-foreground" lang={bodyLang}>{cs.role}</dd>
          </div>
          {cs.timeframe && (
            <div>
              <dt className="text-muted-foreground">{t("case.timeframe")}</dt>
              <dd className="mt-1 font-medium text-foreground">{cs.timeframe}</dd>
            </div>
          )}
          <div className="col-span-2">
            <dt className="text-muted-foreground">{t("case.stack")}</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {cs.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-sm border border-border bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          {cs.links.repo && (
            <ExternalCta href={cs.links.repo} label={t("case.viewRepo")} />
          )}
          {cs.links.paper && (
            <ExternalCta href={cs.links.paper} label={t("case.viewPaper")} />
          )}
          {cs.links.live && (
            <ExternalCta href={cs.links.live} label={t("case.viewLive")} />
          )}
        </div>

        {cs.media.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {cs.media.map((m, i) => (
              <MediaFrame key={m.src} media={m} eager={i === 0} />
            ))}
          </div>
        )}

        <section className="mt-12 max-w-3xl" aria-label={t("case.metrics")}>
          <h2 className="meta-line uppercase">{t("case.metrics")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {cs.metrics.map((m) => (
              <div key={m.label} className="rounded-lg border border-border bg-card p-5">
                <div className="font-display text-2xl font-bold text-signal">
                  {m.direction === "down" ? "↓ " : m.direction === "up" ? "↑ " : ""}
                  {m.value}
                </div>
                <div className="mt-1.5 text-sm leading-snug text-muted-foreground" lang={bodyLang}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="container-prose mx-0 max-w-2xl px-0" lang={bodyLang}>
          {sections.map((section) => (
            <motion.section
              key={section.labelKey}
              {...reveal}
              className="mt-12"
            >
              <h2 className="meta-line uppercase">{t(section.labelKey)}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-4 leading-relaxed text-foreground/90">
                  {paragraph}
                </p>
              ))}
            </motion.section>
          ))}
        </div>

        <nav className="hairline-t mb-8 mt-16 grid gap-4 py-8 sm:grid-cols-2" aria-label={t("case.next")}>
          <Link
            to={`/work/${prev.slug}`}
            className="group rounded-lg border border-border p-5 transition-colors hover:border-accent/50"
          >
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {t("case.prev")}
            </span>
            <span className="mt-2 block font-display font-semibold text-foreground transition-colors group-hover:text-accent">
              {prev.project}
            </span>
          </Link>
          <Link
            to={`/work/${next.slug}`}
            className="group rounded-lg border border-border p-5 text-right transition-colors hover:border-accent/50"
          >
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              {t("case.next")}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="mt-2 block font-display font-semibold text-foreground transition-colors group-hover:text-accent">
              {next.project}
            </span>
          </Link>
        </nav>
      </article>
    </>
  );
};

const ExternalCta = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/50"
  >
    {label}
    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
  </a>
);

export default CaseStudy;
