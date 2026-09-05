import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import MediaFrame from "./MediaFrame";
import ProjectArtifact from "./ProjectArtifact";
import { projects } from "@/data/portfolio";
import { featuredCaseStudies, type CaseStudy } from "@/data/caseStudies";
import { riseUp, useReveal, useRevealGroup } from "@/lib/motion";
import { useSceneSection } from "./lattice/latticeState";

/** Four curated engineering case studies; the Work page retains the full catalog. */
const FeaturedWork = () => {
  const { t } = useTranslation();
  const reveal = useReveal();
  const revealGroup = useRevealGroup();
  const sectionRef = useSceneSection("projects");

  // TradeOps leads with an interactive architecture summary; the other
  // three render as the established ruled editorial entries, numbered from 02
  // so the section still reads as one ordered list of four.
  const [lead, ...rest] = featuredCaseStudies;

  return (
    <section
      ref={sectionRef}
      className="section hairline-t"
      aria-labelledby="home-work-heading"
    >
      <div className="container">
        <SectionHeading
          eyebrow={t("home.work.eyebrow")}
          title={t("home.work.title")}
          description={t("home.work.description")}
          id="home-work-heading"
        />

        {lead && (
          <motion.div {...reveal} className="mt-12">
            <ProjectArtifact />
          </motion.div>
        )}

        <motion.ol
          {...revealGroup}
          className="mt-6 grid snap-x snap-mandatory grid-flow-col auto-cols-[min(82vw,20rem)] gap-4 overflow-x-auto overscroll-x-contain pb-4 lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-3 lg:overflow-visible lg:pb-0"
        >
          {rest.map((study, i) => (
            <WorkEntry key={study.slug} study={study} index={i + 1} />
          ))}
        </motion.ol>

        <motion.div {...reveal} className="mt-12">
          <Link
            to="/work"
            className="link-underline group inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-foreground"
          >
            {t("home.work.viewAll", { count: projects.length })}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const WorkEntry = ({ study, index }: { study: CaseStudy; index: number }) => {
  const { t } = useTranslation();
  const outcome = study.metrics[0];

  return (
    <motion.li
      variants={riseUp}
      data-tilt
      data-tilt-max="7"
      className="card flex h-full snap-start flex-col rounded-xl border border-border bg-card/80 p-5 shadow-card backdrop-blur-sm md:p-6"
    >
      {/* Decorative light only — index.css keeps both layers behind the copy. */}
      <span className="card__shine" aria-hidden="true" />
      <span className="card__glow" aria-hidden="true" />

      {study.media.length > 0 && <MediaFrame media={study.media[0]} className="mb-6" />}

      <span className="meta-line uppercase">
        {String(index + 1).padStart(2, "0")} · {t(`category.${study.category}`)} ·{" "}
        {study.role}
      </span>

      <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-foreground">
        {/* inline-flex + min-h-11: the bare heading link measured 26px tall. */}
        <Link
          to={`/work/${study.slug}`}
          className="inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-accent"
        >
          {study.project}
        </Link>
      </h3>

      {/* Problem — the translated one-line framing of what the project solves. */}
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t(study.summaryKey)}
      </p>

      <p className="mt-4 border-l-2 border-signal/50 pl-3 font-mono text-xs leading-relaxed text-muted-foreground">
        {study.evidence}
      </p>

      <dl className="mt-5 space-y-4 text-sm">
        {outcome && (
          <div>
            <dt className="meta-line uppercase">{t("home.work.outcome")}</dt>
            <dd className="mt-1 leading-relaxed text-foreground/90">
              <span className="font-display font-semibold text-accent">
                {outcome.value}
              </span>{" "}
              {outcome.label}
            </dd>
          </div>
        )}
        <div>
          <dt className="meta-line uppercase">{t("home.work.stack")}</dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {study.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-secondary px-2.5 py-1 font-mono text-[11px] leading-4 text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 pt-6">
        <Link
          to={`/work/${study.slug}`}
          className="link-underline group inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-accent"
        >
          {t("home.work.viewCase")}
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
        {study.links.repo && (
          <a
            href={study.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            {t("home.work.repo")}
            <span className="sr-only"> — {study.project}</span>
          </a>
        )}
      </div>
    </motion.li>
  );
};

export default FeaturedWork;
