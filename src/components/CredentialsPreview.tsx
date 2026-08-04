import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import CredentialRow from "./CredentialRow";
import { homeCredentials, publishedCredentials } from "@/data/credentials";
import { education } from "@/data/portfolio";
import { useReveal } from "@/lib/motion";

/**
 * Home "Credentials and continued learning" preview.
 *
 * Four curated entries (`homeCredentialIds`); the complete published set
 * lives at `/about#credentials`. The section is titled honestly — none of
 * these is a professional certification, so the word "certifications" never
 * appears, and the AZ-900 entry carries its exam-preparation note here just
 * as it does on /about.
 *
 * The CDAC certificate is withheld from both surfaces until its link and
 * framing are verified (§26.4), so the "all N" count below reflects what is
 * actually published rather than what exists in the dataset.
 */
const CredentialsPreview = () => {
  const { t } = useTranslation();
  const reveal = useReveal();

  return (
    <section className="section hairline-t" aria-labelledby="home-credentials-heading">
      <div className="container">
        <SectionHeading
          eyebrow={t("credentials.eyebrow")}
          title={t("credentials.title")}
          description={t("credentials.description")}
          id="home-credentials-heading"
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:gap-12">
          <motion.div {...reveal} className="min-w-0">
            <h3 className="sr-only">{t("credentials.title")}</h3>
            <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-4 [&>li]:w-[82vw] [&>li]:shrink-0 [&>li]:snap-start [&>li]:rounded-xl [&>li]:border [&>li]:border-border [&>li]:bg-card/40 [&>li]:px-4 md:block md:overflow-hidden md:rounded-2xl md:border md:border-border md:bg-card/40 md:px-6 md:pb-0 md:[&>li]:w-auto md:[&>li]:rounded-none md:[&>li]:border-x-0 md:[&>li]:border-b-0"
            >
              {homeCredentials.map((credential) => (
                <CredentialRow key={credential.id} credential={credential} />
              ))}
            </ul>

            <div className="mt-6">
              <Link
                to="/about#credentials"
                className="link-underline group inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-foreground"
              >
                {/* `total`, not `count`: i18next treats `count` as the plural
                    selector and would demand suffixed keys in all eight locales. */}
                {t("credentials.viewAll", { total: publishedCredentials.length })}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </motion.div>

          {/* Education sits with credentials (§31.2 slot 8). Both entries always
              render — the RIT master's and the LJIET bachelor's — read straight
              from the canonical record, with their real periods, locations and
              GPAs. Nothing is summarised away. */}
          <motion.div
            {...reveal}
            className="self-start rounded-2xl border border-border bg-card/40 p-5 md:p-6"
          >
            <h3 className="meta-line uppercase">{t("about.education")}</h3>
            <ul className="mt-3">
              {education.map((entry) => (
                <li key={entry.institution} className="hairline-t py-5 first:border-t-0">
                  <span className="font-mono text-xs leading-relaxed text-muted-foreground">
                    {entry.period}
                    <span className="block">{entry.location}</span>
                  </span>
                  <span className="mt-3 block font-display text-base font-semibold leading-snug text-foreground">
                    {entry.degree}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {entry.institution} · {t("about.gpa")} {entry.gpa}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CredentialsPreview;
