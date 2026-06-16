import { motion } from "framer-motion";
import {
  Code2,
  Sparkles,
  ShieldCheck,
  Database,
  TestTube,
  Layers,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeading from "./SectionHeading";
import { expertise } from "@/data/portfolio";
import { getAccent } from "@/lib/accents";

const icons = [Code2, Sparkles, ShieldCheck, Database, TestTube, Layers];

const Expertise = () => {
  const { t } = useTranslation();
  return (
    <section id="expertise" className="section">
      <div className="container">
        <SectionHeading
          eyebrow={t("expertise.eyebrow")}
          title={t("expertise.title")}
          description={t("expertise.description")}
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {expertise.map((area, i) => {
            const Icon = icons[i % icons.length];
            const accent = getAccent(area.accent);
            return (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={`card-glow group rounded-2xl glass p-7 ${accent.glow}`}
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-xl border ${accent.border} ${accent.softBg} ${accent.text} transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
