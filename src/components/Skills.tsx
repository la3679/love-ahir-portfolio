import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionHeading from "./SectionHeading";
import { skillGroups } from "@/data/portfolio";
import { getAccent } from "@/lib/accents";

const Skills = () => {
  const { t } = useTranslation();
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading
          eyebrow={t("skills.eyebrow")}
          title={t("skills.title")}
          description={t("skills.description")}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => {
            const accent = getAccent(group.accent);
            return (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={`card-glow premium-border rounded-2xl glass p-6 ${accent.glow}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${accent.dot}`} />
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {group.title}
                  </h3>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`rounded-lg border px-2.5 py-1.5 text-sm transition-colors ${accent.border} ${accent.softBg} ${accent.text}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
