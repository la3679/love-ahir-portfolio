import { motion } from "framer-motion";
import { Award, ArrowUpRight, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeading from "./SectionHeading";
import { certifications } from "@/data/portfolio";

const Certifications = () => {
  const { t } = useTranslation();
  return (
    <section id="certifications" className="section">
      <div className="container">
        <SectionHeading
          eyebrow={t("certifications.eyebrow")}
          title={t("certifications.title")}
          description={t("certifications.description")}
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, i) => (
            <motion.a
              key={cert.title}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="card-glow premium-border group flex min-h-36 items-start gap-4 rounded-2xl glass p-5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-aurora-cyan/10 text-aurora-cyan">
                <Award className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-aurora-cyan">
                  {cert.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{cert.provider}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {cert.date}
                </p>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-aurora-cyan" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
