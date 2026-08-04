import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useReveal } from "@/lib/motion";

/**
 * Home research note — replaces ResearchBand.
 *
 * Research is supporting evidence, not the portfolio's identity. It sits
 * after featured work, experience, and credentials, and it is deliberately
 * the quietest section on the page: a narrow column, a body-scale heading
 * rather than a display one, no filled band, no bordered call-to-action
 * button, and no publication metric promoted to a headline figure. The full
 * paper, findings, method, and BibTeX stay on /research, which also keeps its
 * footer link.
 */
const ResearchNote = () => {
  const { t } = useTranslation();
  const reveal = useReveal();

  return (
    <section
      className="hairline-t py-12 md:py-16"
      aria-labelledby="home-research-heading"
    >
      <div className="container">
        <motion.div
          {...reveal}
          className="grid gap-5 md:grid-cols-[10rem_minmax(0,1fr)_auto] md:items-start md:gap-8"
        >
          <span className="meta-line uppercase md:pt-1">
            {t("home.research.venue")}
          </span>
          <div className="max-w-2xl">
            <h2
              id="home-research-heading"
              className="font-display text-xl font-semibold leading-snug text-foreground"
            >
              {t("home.research.title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("home.research.finding")}
            </p>
          </div>
          <Link
            to="/research"
            className="link-underline group inline-flex min-h-11 items-center gap-2 self-start rounded-sm text-sm font-medium text-foreground md:justify-self-end"
          >
            {t("home.research.cta")}
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

export default ResearchNote;
