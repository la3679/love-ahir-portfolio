import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useReveal } from "@/lib/motion";

/** Two-sentence about teaser on the home page, linking to /about. */
const AboutTeaser = () => {
  const { t } = useTranslation();
  const reveal = useReveal();
  return (
    <section className="section">
      <div className="container">
        <motion.div
          {...reveal}
          className="max-w-3xl"
        >
          <span className="meta-line uppercase">{t("about.eyebrow")}</span>
          <h2 className="mt-4 font-display text-display-md font-bold text-foreground">
            {t("about.title")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            {t("about.description")}
          </p>
          <Link
            to="/about"
            className="link-underline group mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-foreground"
          >
            {t("home.about.cta")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutTeaser;
