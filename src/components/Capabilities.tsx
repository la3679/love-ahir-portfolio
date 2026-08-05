import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Braces,
  CloudCog,
  Database,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import { riseUp, useReveal, useRevealGroup } from "@/lib/motion";
import {
  capabilityGroups,
  getTechnology,
  type CapabilityGroupId,
} from "@/data/technologyCatalog";

/**
 * Technical capabilities (IMPLEMENTATION.md §31.2, slot 7).
 *
 * Six areas, each backed by work that already exists in the verified record.
 * Deliberately absent, per the content rules: skill progress bars, proficiency
 * percentages, star ratings, years-per-technology counts, and any capability
 * without a project or role behind it.
 *
 * Technology names are proper nouns and stay untranslated; the titles and
 * explanations are locale keys and exist in all eight dictionaries.
 */
const CAPABILITY_ICONS = {
  languages: Braces,
  cloud: CloudCog,
  databases: Database,
  ai: Sparkles,
  testing: ShieldCheck,
  practices: Workflow,
} as const satisfies Record<CapabilityGroupId, typeof Braces>;

const Capabilities = () => {
  const { t } = useTranslation();
  const reveal = useReveal();
  const revealGroup = useRevealGroup();

  return (
    <section
      className="section hairline-t"
      aria-labelledby="home-capabilities-heading"
    >
      <div className="container">
        <SectionHeading
          eyebrow={t("capabilities.eyebrow")}
          title={t("capabilities.title")}
          description={t("capabilities.description")}
          id="home-capabilities-heading"
        />

        <motion.ul
          {...revealGroup}
          className="mt-10 grid snap-x snap-mandatory grid-flow-col auto-cols-[min(82vw,20rem)] gap-3 overflow-x-auto overscroll-x-contain pb-4 md:block md:overflow-hidden md:rounded-2xl md:border md:border-border md:bg-card/80 md:pb-0 md:backdrop-blur-sm"
        >
          {capabilityGroups.map(({ id, technologies }) => {
            const Icon = CAPABILITY_ICONS[id];

            return (
              <motion.li
                key={id}
                variants={riseUp}
                data-tilt
                data-tilt-max="5"
                className="skill-card grid snap-start grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-xl border border-border bg-card/80 p-4 backdrop-blur-sm md:grid-cols-[2.5rem_12rem_minmax(0,1fr)] md:items-start md:gap-5 md:rounded-none md:border-x-0 md:border-t-0 md:bg-transparent md:p-5 md:backdrop-blur-none md:last:border-b-0 lg:grid-cols-[2.5rem_12rem_minmax(0,1fr)_minmax(15rem,0.8fr)]"
              >
                <span className="skill-card__icon grid h-10 w-10 place-items-center rounded-full border border-signal/25 bg-signal/5">
                  <Icon className="h-4 w-4 text-signal" aria-hidden="true" />
                </span>
                <h3 className="font-display text-base font-semibold leading-snug text-foreground md:pt-2">
                  {t(`capabilities.${id}.title`)}
                </h3>
                <p className="col-span-2 text-sm leading-relaxed text-muted-foreground md:col-span-1 md:pt-2">
                  {t(`capabilities.${id}.body`)}
                </p>
                <ul className="col-span-2 flex flex-wrap gap-1.5 md:col-start-2 md:col-end-4 lg:col-start-4 lg:col-end-5 lg:pt-1.5">
                  {technologies.map((technologyId) => {
                    const technology = getTechnology(technologyId);

                    return (
                      <li
                        key={technologyId}
                        className="technology-chip inline-flex min-h-8 items-center gap-2 rounded-full border border-border bg-secondary px-2.5 py-1 font-mono text-xs leading-4 text-muted-foreground"
                      >
                        {technology.icon ? (
                          <span
                            className={`technology-logo-tile ${
                              technology.wide ? "w-9" : "w-6"
                            }`}
                            aria-hidden="true"
                          >
                            <img
                              src={technology.icon}
                              alt=""
                              width={technology.wide ? 30 : 18}
                              height={18}
                              loading="lazy"
                              decoding="async"
                            />
                          </span>
                        ) : null}
                        <span>{technology.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </motion.li>
            );
          })}
        </motion.ul>

        <motion.p {...reveal} className="mt-10 max-w-2xl text-sm text-muted-foreground">
          {t("capabilities.footnote")}
        </motion.p>
      </div>
    </section>
  );
};

export default Capabilities;
