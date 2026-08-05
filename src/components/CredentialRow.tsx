import { BookOpen, FileCheck, Route, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  formatCredentialDate,
  type Credential,
  type CredentialType,
} from "@/data/credentials";

/**
 * Neutral, type-derived icons. Deliberately generic lucide glyphs — no
 * Microsoft, LinkedIn, Azure, or CDAC logo appears anywhere on the site, and
 * no fake issuer badge is drawn.
 */
const ICONS: Record<CredentialType, typeof BookOpen> = {
  "course-completion": BookOpen,
  "learning-path": Route,
  certificate: FileCheck,
  "professional-certification": FileCheck,
};

/**
 * One credential, rendered as a ruled row.
 *
 * Shows the exact official title, the honest award-type label, the provider
 * and named instructor/authoring organisation, and the issue date at the
 * precision that was actually verified. `noteKey` renders inline where a
 * clarification is required — the AZ-900 entry always states that it is exam
 * preparation and not a Microsoft certification.
 *
 * The whole row is one 44px-minimum link to the issuer-hosted certificate.
 */
const CredentialRow = ({ credential }: { credential: Credential }) => {
  const { t, i18n } = useTranslation();
  const Icon = ICONS[credential.type];
  const language = i18n.resolvedLanguage ?? i18n.language;

  return (
    <li data-tilt data-tilt-max="4" data-tilt-strength="soft" className="hairline-t">
      <a
        href={credential.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex min-h-11 flex-col gap-2 py-4 sm:flex-row sm:items-start sm:gap-4"
      >
        <Icon
          className="mt-0.5 h-4 w-4 shrink-0 text-signal sm:mt-1"
          aria-hidden="true"
        />
        <span className="flex-1">
          <span className="block text-sm font-medium text-foreground transition-colors group-hover:text-accent">
            {credential.title}
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            {t(`credentials.type.${credential.type}`)} · {credential.provider}
            {credential.attribution && ` · ${credential.attribution}`}
          </span>
          {credential.noteKey && (
            <span className="mt-1.5 block text-xs leading-relaxed text-signal">
              {t(credential.noteKey)}
            </span>
          )}
        </span>
        <span className="meta-line inline-flex items-center gap-1 sm:shrink-0 sm:pt-0.5">
          {formatCredentialDate(credential, language)}
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
          {/* The visible label is the title; name the action for screen readers. */}
          <span className="sr-only">
            — {t("credentials.viewCertificate")}: {credential.title}
          </span>
        </span>
      </a>
    </li>
  );
};

export default CredentialRow;
