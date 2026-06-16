import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowUpRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeading from "./SectionHeading";
import { experiences } from "@/data/portfolio";

const Experience = () => {
  const { t } = useTranslation();
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeading
          eyebrow={t("experience.eyebrow")}
          title={t("experience.title")}
          description={t("experience.description")}
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-aurora-violet via-aurora-cyan to-aurora-magenta md:left-1/2" />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.55, delay: i * 0.05 }}
                className="relative pl-12 md:pl-0"
              >
                <span className="absolute left-4 top-6 z-10 grid h-3 w-3 -translate-x-1/2 place-items-center rounded-full bg-aurora-violet ring-4 ring-background md:left-1/2" />

                <div
                  className={`md:w-1/2 ${
                    i % 2 === 0 ? "md:pr-10" : "md:ml-auto md:pl-10"
                  }`}
                >
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-glow group block rounded-2xl glass p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {exp.period}
                        {exp.current && (
                          <span className="rounded-full bg-aurora-emerald/15 px-2 py-0.5 text-[10px] font-medium text-aurora-emerald">
                            {t("experience.current")}
                          </span>
                        )}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-aurora-violet" />
                    </div>

                    <h3 className="mt-3 font-display text-lg font-semibold text-foreground transition-colors group-hover:text-aurora-violet">
                      {exp.role}
                    </h3>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-aurora-cyan">
                      {exp.company}
                      <span className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {exp.location}
                      </span>
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {exp.summary}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {exp.achievements.map((a) => (
                        <li key={a} className="flex gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-aurora-emerald" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-border bg-card/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
