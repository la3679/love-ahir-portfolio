import { useEffect, useState } from "react";
import { Menu, X, FileDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { profile } from "@/data/portfolio";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import BrandLogo from "./BrandLogo";

export interface NavItem {
  /** i18n key for the visible label. */
  labelKey: string;
  href: string;
}

export const navItems: NavItem[] = [
  { labelKey: "nav.about", href: "#about" },
  { labelKey: "nav.experience", href: "#experience" },
  { labelKey: "nav.work", href: "#projects" },
  { labelKey: "nav.skills", href: "#skills" },
  { labelKey: "nav.expertise", href: "#expertise" },
  { labelKey: "nav.contact", href: "#contact" },
];

export function scrollToHref(href: string) {
  if (href === "#" || href === "#home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(href);
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

const Navigation = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setMenuOpen(false);
    scrollToHref(href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]" : "bg-transparent"
      }`}
    >
      <nav className="container flex h-16 items-center justify-between">
        <button
          onClick={() => go("#")}
          className="group flex items-center gap-2 font-display text-lg font-bold"
          aria-label="Back to top"
        >
          <BrandLogo size="sm" title="Love Ahir" />
          <span className="text-gradient">Love Ahir</span>
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => go(item.href)}
              className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.labelKey)}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-aurora transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-aurora-violet/40 bg-aurora-violet/10 px-4 py-1.5 text-sm font-medium text-foreground transition-all hover:border-aurora-violet hover:shadow-glow"
          >
            <FileDown className="h-4 w-4" />
            {t("nav.resume")}
          </a>
          <LanguageSelector />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector />
          <ThemeToggle />
          <button
            className="grid h-10 w-10 place-items-center rounded-lg glass"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="glass-strong border-t border-border/60 md:hidden">
          <div className="container flex flex-col py-3">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => go(item.href)}
                className="py-2.5 text-left text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(item.labelKey)}
              </button>
            ))}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-aurora-violet/40 bg-aurora-violet/10 px-4 py-2 text-sm font-medium"
            >
              <FileDown className="h-4 w-4" />
              {t("nav.downloadResume")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
