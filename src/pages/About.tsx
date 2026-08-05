import { motion } from "framer-motion";
import { ArrowUpRight, GraduationCap, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";
import profilePhoto from "@/assets/profile-photo.jpg";
import {
  profile,
  education,
  experiences,
  experienceGroups,
  experiencesInGroup,
  skillGroups,
  expertise,
} from "@/data/portfolio";
import { publishedCredentials } from "@/data/credentials";
import CredentialRow from "@/components/CredentialRow";
import { riseUp, useReveal, useRevealGroup } from "@/lib/motion";

/**
 * About page: story, experience timeline, education, expertise, condensed
 * skills, and certifications demoted to a footnote list. Experience leads —
 * a hiring manager reads what was shipped before where it was studied.
 */
const About = () => {
  const { t } = useTranslation();
  const reveal = useReveal();
  const revealGroup = useRevealGroup();

  return (
    <>
      <Seo
        title={t("about.title")}
        description="Love Ahir — software engineer with 4+ years across backend services, full-stack products, cloud delivery, and applied AI at Morgan Stanley and Sage Softtech. M.S. in Computer Software Engineering, RIT."
        path="/about"
      />
      <div className="container pt-32">
        {/* Story */}
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <header className="max-w-3xl">
            <span className="meta-line uppercase">{t("about.eyebrow")}</span>
            <h1 className="mt-4 font-display text-display-md font-bold text-foreground">
              {t("about.title")}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {t("about.description")}
            </p>
            <div className="mt-6 space-y-4 leading-relaxed text-foreground/90">
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
              <p>{t("about.p3")}</p>
            </div>
          </header>

          <motion.div
            {...reveal}
            className="mx-auto w-full max-w-[18rem] lg:mx-0"
          >
            <div className="overflow-hidden rounded-lg border border-border">
              <img
                src={profilePhoto}
                alt={profile.name}
                /* Match the 4/5 CSS box: these attributes reserve space before
                   the stylesheet applies, and the previous 3/4 pair reserved
                   the wrong shape. */
                width={800}
                height={1000}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <p className="meta-line mt-3 uppercase">
              <MapPin className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
              {profile.location}
            </p>
          </motion.div>
        </div>

        {/* Experience timeline — leads the page, ahead of education.
            tabIndex={-1} makes it a programmatic focus target so the
            "Experience" nav item and a direct /about#experience load both land
            a keyboard/screen-reader user on the section, not on <body>.
            No scroll-mt: `scroll-padding-top: 6rem` on <html> already clears
            the 64px fixed header, and scroll-margin ADDS to it — the two
            together parked the heading 192px down the viewport. */}
        <section
          id="experience"
          tabIndex={-1}
          className="mt-20 outline-none"
          aria-labelledby="experience-heading"
        >
          <h2 id="experience-heading" className="meta-line uppercase">
            {t("experience.eyebrow")}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t("experience.description")}
          </p>
          {experienceGroups.map((group) => {
            const roles = experiencesInGroup(experiences, group);
            if (roles.length === 0) return null;
            return (
              <div key={group} className="mt-10">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {t(`experience.group.${group}`)}
                </h3>
                <motion.ol
                  {...revealGroup}
                  className="mt-4"
                >
                  {roles.map((exp) => (
                    <motion.li key={exp.id} variants={riseUp} className="hairline-t py-8">
                      <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
                        <div>
                          <p className="meta-line">{exp.period}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{exp.location}</p>
                          {exp.current && (
                            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/10 px-2.5 py-0.5 text-xs font-medium text-signal">
                              {t("experience.current")}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-display text-xl font-semibold text-foreground">
                            {t(exp.roleKey)}
                          </h4>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {exp.company}
                            {exp.focusKey && (
                              <>
                                {" · "}
                                <span className="text-accent">{t(exp.focusKey)}</span>
                              </>
                            )}
                          </p>
                          <p className="mt-3 leading-relaxed text-foreground/90">
                            {t(exp.summaryKey)}
                          </p>
                          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                            {exp.achievementKeys.map((key) => (
                              <li key={key} className="flex gap-2">
                                <span
                                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal"
                                  aria-hidden="true"
                                />
                                {t(key)}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {exp.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-sm border border-border bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </motion.ol>
              </div>
            );
          })}
        </section>

        {/* Education */}
        <section className="mt-20" aria-labelledby="education-heading">
          <h2 id="education-heading" className="meta-line uppercase">
            {t("about.education")}
          </h2>
          <motion.div
            {...revealGroup}
            className="mt-4 grid gap-4 md:grid-cols-2"
          >
            {education.map((edu) => (
              <motion.article
                key={edu.institution}
                variants={riseUp}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {edu.degree}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{edu.institution}</p>
                  </div>
                  <GraduationCap className="h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
                </div>
                <p className="meta-line mt-3">
                  {edu.period} · {t("about.gpa")} {edu.gpa}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {edu.highlight}
                </p>
                <a
                  href={edu.documentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline mt-3 inline-flex items-center gap-1 rounded-sm py-1 text-sm text-accent"
                >
                  {t("work.external")}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* Expertise */}
        <section className="mt-20" aria-labelledby="expertise-heading">
          <h2 id="expertise-heading" className="meta-line uppercase">
            {t("expertise.eyebrow")}
          </h2>
          <motion.div
            {...revealGroup}
            className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {expertise.map((item) => (
              <motion.div
                key={item.title}
                variants={riseUp}
                className="rounded-lg border border-border bg-card p-5"
              >
                <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Skills, condensed */}
        <section className="mt-20" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="meta-line uppercase">
            {t("skills.eyebrow")}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("skills.description")}</p>
          <motion.div
            {...revealGroup}
            className="mt-6 space-y-5"
          >
            {skillGroups.map((group) => (
              <motion.div key={group.title} variants={riseUp} className="grid gap-2 md:grid-cols-[14rem_1fr]">
                <h3 className="text-sm font-medium text-foreground">{group.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-sm border border-border bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Credentials and continued learning — the complete published set.
            tabIndex={-1} makes #credentials a real focus target, so the
            homepage preview's deep link lands a keyboard or screen-reader
            user on the section rather than on <body>. */}
        <section
          id="credentials"
          tabIndex={-1}
          className="mb-8 mt-20 outline-none"
          aria-labelledby="credentials-heading"
        >
          <h2 id="credentials-heading" className="meta-line uppercase">
            {t("credentials.eyebrow")}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t("credentials.aboutDescription")}
          </p>
          <ul className="mt-6 max-w-3xl">
            {publishedCredentials.map((credential) => (
              <CredentialRow key={credential.id} credential={credential} />
            ))}
          </ul>
        </section>
      </div>
    </>
  );
};

export default About;
