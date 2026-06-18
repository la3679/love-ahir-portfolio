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
  const [activeHref, setActiveHref] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = ["#home", ...navItems.map((item) => item.href)]
      .map((href) => document.querySelector(href))
      .filter((el): el is Element => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveHref(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const go = (href: string) => {
    setMenuOpen(false);
    setActiveHref(href === "#" ? "#home" : href);
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
              aria-current={activeHref === item.href ? "true" : undefined}
              className={`group relative rounded-full px-1.5 py-1 text-sm transition-colors hover:text-foreground ${
                activeHref === item.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {t(item.labelKey)}
              <span
                className={`absolute -bottom-1.5 left-1/2 h-px -translate-x-1/2 bg-gradient-aurora transition-all duration-300 ${
                  activeHref === item.href ? "w-4/5" : "w-0 group-hover:w-4/5"
                }`}
              />
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
                aria-current={activeHref === item.href ? "true" : undefined}
                className={`rounded-xl px-3 py-3 text-left transition-colors hover:bg-card/60 hover:text-foreground ${
                  activeHref === item.href
                    ? "bg-aurora-violet/10 text-foreground"
                    : "text-muted-foreground"
                }`}
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
