import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { profile } from "@/data/portfolio";
import { footerNavItems, NavAnchor } from "./Navigation";
import BrandLogo from "./BrandLogo";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="hairline-t py-10">
      <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
        {/* Same BrandLogo source as the header — one geometry, one lockup. */}
        <div className="text-center md:text-left">
          <BrandLogo size="sm" variant="lockup" />
          <p className="mt-2 text-sm text-muted-foreground">
            {t("footer.tagline")} · {profile.location}
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-5" aria-label="Footer">
          {footerNavItems.map((item) => {
            const className =
              "link-underline inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm px-2 text-sm text-muted-foreground transition-colors hover:text-foreground";
            return item.anchor ? (
              <NavAnchor key={item.to} to={item.to} className={className}>
                {t(item.labelKey)}
              </NavAnchor>
            ) : (
              <Link key={item.to} to={item.to} className={className}>
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>

      <p className="container mt-6 text-center text-xs text-muted-foreground/70">
        © {new Date().getFullYear()} Love Jayesh Ahir. {t("footer.builtWith")}{" "}
        <a
          href="https://github.com/la3679/love-ahir-portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          {t("footer.source")}
        </a>
      </p>
    </footer>
  );
};

export default Footer;
