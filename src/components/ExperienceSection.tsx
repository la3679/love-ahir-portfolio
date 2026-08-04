import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import { homeExperiences, type Experience } from "@/data/portfolio";
import { riseUp, useReveal, useRevealGroup } from "@/lib/motion";
import { useSceneSection } from "./lattice/latticeState";

/** The home preview shows the strongest outcome; /about shows them all. */
const HOME_ACHIEVEMENTS = 1;

/**
 * Home experience preview.
 *
 * Three curated engineering roles (`homeExperienceIds`), read from the same
 * canonical dataset as the /about timeline. All seven roles, with their exact
 * dates, locations, titles, and verified claims, remain on
 * `/about#experience` — nothing here re-dates, re-labels, or explains away
 * the overlapping periods.
 *
 * Direction B's contribution, scoped exactly as approved: ruled rows with a
 * fixed date/location rail so a recruiter can scan chronology down one edge.
 * Everything else — type, colour, spacing, restraint — stays Direction A.
 */
const ExperienceSection = () => {
  const sectionRef = useSceneSection("experience");
  const { t } = useTranslation();
  const reveal = useReveal();
  const revealGroup = useRevealGroup();

  return (
    <section
      ref={sectionRef}
      className="section hairline-t"
      aria-labelledby="home-experience-heading"
    >
      <div className="container">
        <SectionHeading
          eyebrow={t("home.experience.eyebrow")}
          title={t("home.experience.title")}
          description={t("home.experience.description")}
          id="home-experience-heading"
        />

        <motion.ol
          {...revealGroup}
          className="mt-10 grid snap-x snap-mandatory grid-flow-col auto-cols-[min(82vw,22rem)] gap-3 overflow-x-auto overscroll-x-contain pb-4 lg:block lg:overflow-hidden lg:rounded-2xl lg:border lg:border-border lg:bg-card/40 lg:pb-0"
        >
          {homeExperiences.map((role) => (
            <RoleRow key={role.id} role={role} />
          ))}
        </motion.ol>

        <motion.div {...reveal} className="mt-10">
          <Link
            to="/about#experience"
            className="link-underline group inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-foreground"
          >
            {t("home.experience.cta")}
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

const RoleRow = ({ role }: { role: Experience }) => {
  const { t } = useTranslation();

  return (
    <motion.li
      variants={riseUp}
      className="snap-start rounded-xl border border-border bg-card/40 p-4 lg:rounded-none lg:border-x-0 lg:border-t-0 lg:bg-transparent lg:p-6 lg:last:border-b-0"
    >
      <div className="grid gap-5 lg:grid-cols-[10.5rem_minmax(0,1fr)_minmax(13rem,0.72fr)] lg:gap-8">
        {/* Scan rail: period and location always visible, never abbreviated. */}
        <div className="lg:pt-0.5">
          <p className="meta-line">{role.period}</p>
          <p className="mt-1 text-sm text-muted-foreground">{role.location}</p>
          {role.current && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/10 px-2.5 py-0.5 text-xs font-medium text-signal">
              {t("experience.current")}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
            <span className="block">{t(role.roleKey)}</span>
            <span className="mt-1 block text-base font-medium text-muted-foreground">
              {role.company}
            </span>
          </h3>
          <ul className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {role.achievementKeys.slice(0, HOME_ACHIEVEMENTS).map((key) => (
              <li key={key} className="border-l-2 border-signal/60 pl-4">
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 lg:pt-0.5">
          <ul className="flex flex-wrap gap-1.5">
            {role.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-secondary px-2.5 py-1 font-mono text-[11px] leading-4 text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.li>
  );
};

export default ExperienceSection;
