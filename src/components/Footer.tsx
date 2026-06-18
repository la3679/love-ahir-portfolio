import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { profile } from "@/data/portfolio";
import { scrollToHref } from "./Navigation";
import BrandLogo from "./BrandLogo";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-3 text-center md:text-left">
          <BrandLogo size="sm" title={profile.shortName} />
          <div>
          <div className="font-display text-lg font-bold text-gradient">{t("brand")}</div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("footer.tagline")} · {profile.location}
          </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/40 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/40 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/40 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
          </a>
          <button
            onClick={() => scrollToHref("#")}
            aria-label="Back to top"
            className="grid h-10 w-10 place-items-center rounded-full bg-gradient-aurora text-background"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="container mt-6 text-center text-xs text-muted-foreground/70">
        © {new Date().getFullYear()} Love Jayesh Ahir. {t("footer.builtWith")}
      </p>
    </footer>
  );
};

export default Footer;
