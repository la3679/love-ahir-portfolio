import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Copy, Check, Github, Linkedin, FileDown, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { profile } from "@/data/portfolio";
import { useReveal } from "@/lib/motion";

/**
 * Contact CTA block, rendered at the bottom of every page. No form —
 * one obvious email action (open mail client or copy the address),
 * plus the profile links and availability note.
 */
const Contact = () => {
  const { t } = useTranslation();
  const reveal = useReveal();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — mailto link still works.
    }
  };

  return (
    // tabIndex={-1} for the same reason as #experience: the nav's #contact
    // anchor should move focus, not just the viewport.
    <section
      id="contact"
      tabIndex={-1}
      className="hairline-t py-14 outline-none md:py-20"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <motion.div
          {...reveal}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card md:p-10"
        >
          <span
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-end lg:gap-14">
            <div>
              <span className="meta-line inline-flex items-center gap-2 uppercase">
                <span className="h-px w-6 bg-signal/60" aria-hidden="true" />
                {t("contact.eyebrow")}
              </span>
              <h2
                id="contact-heading"
                className="mt-4 max-w-2xl font-display text-display-md font-bold text-foreground"
              >
                {t("contact.title")}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {t("contact.description")}
              </p>

              <div className="mt-6 inline-flex max-w-xl items-start gap-2 rounded-lg border border-signal/25 bg-signal/5 px-4 py-3">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-signal"
                  aria-hidden="true"
                />
                <span>
                  <span className="block text-sm font-semibold text-signal">
                    {t("contact.openTo")}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {t("contact.openToText")}
                  </span>
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex min-h-12 min-w-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{profile.email}</span>
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-signal" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  {copied ? t("contact.copied") : t("contact.copyEmail")}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex min-h-11 items-center gap-1.5 rounded-sm hover:text-foreground"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  {t("contact.link.github")}
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex min-h-11 items-center gap-1.5 rounded-sm hover:text-foreground"
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                  {t("contact.link.linkedin")}
                </a>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex min-h-11 items-center gap-1.5 rounded-sm hover:text-foreground"
                >
                  <FileDown className="h-4 w-4" aria-hidden="true" />
                  {t("nav.resume")}
                </a>
                <span className="inline-flex min-h-11 items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-signal" aria-hidden="true" />
                  {profile.location}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
