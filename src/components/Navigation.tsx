import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, FileDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { profile } from "@/data/portfolio";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import BrandLogo from "./BrandLogo";

export interface NavItem {
  /** i18n key for the visible label. */
  labelKey: string;
  to: string;
  /**
   * True when the target is an in-page anchor rather than a distinct route.
   * Anchor items render as plain links so they never claim `aria-current`
   * from the route they happen to point into.
   */
  anchor?: boolean;
}

/**
 * Primary navigation: the five actions a recruiter needs. Research is not
 * here by design — it is supporting evidence, not a destination that should
 * compete with Work. It stays reachable from the footer, the About
 * narrative, the work index, and its own /research route.
 */
// Order approved at §31.2: About · Experience · Work · Contact — it mirrors the
// homepage's own reading order. Routes are unchanged.
export const navItems: NavItem[] = [
  { labelKey: "nav.about", to: "/about" },
  { labelKey: "nav.experience", to: "/about#experience", anchor: true },
  { labelKey: "nav.work", to: "/work" },
  { labelKey: "nav.contact", to: "#contact", anchor: true },
];

/** Footer navigation keeps Research discoverable. */
export const footerNavItems: NavItem[] = [
  { labelKey: "nav.work", to: "/work" },
  { labelKey: "nav.research", to: "/research" },
  { labelKey: "nav.about", to: "/about" },
  { labelKey: "nav.contact", to: "#contact", anchor: true },
];

const Navigation = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  /**
   * The in-panel language menu is a nested dismissable layer. A ref (not
   * state) because the keydown handler must read the live value without
   * re-subscribing, and because Radix flips it back to false synchronously
   * while the same Escape event is still propagating.
   */
  const languageMenuOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  // Escape to close, and trap Tab inside the open panel.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      // Nested layers dismiss one at a time. Radix's own Escape handler runs
      // on `document`, i.e. after this one only because this listener is
      // registered in the CAPTURE phase — that ordering is what lets the
      // first Escape reach Radix (closing just the language menu and
      // restoring focus to its trigger) while the panel stays open. The
      // second Escape finds the ref false and closes the panel.
      if (languageMenuOpen.current) return;

      if (event.key === "Escape") {
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      // The toggle sits outside the panel, so wrap through it deliberately.
      if (event.shiftKey && (active === first || active === menuButtonRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [menuOpen]);

  // Lock body scroll while the panel is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      // The language menu unmounts with the panel, so Radix never reports the
      // close; clear it here or the next Escape would be swallowed.
      languageMenuOpen.current = false;
    };
  }, [menuOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm transition-colors hover:bg-secondary/70 hover:text-foreground ${
      isActive
        ? "bg-secondary font-medium text-foreground shadow-sm"
        : "text-muted-foreground"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/70 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="container flex h-20 items-center justify-between gap-3">
        <Link
          to="/"
          className="group flex min-h-11 shrink-0 items-center rounded-full border border-transparent bg-background/65 px-3 transition-colors hover:border-border"
          aria-label={`${profile.shortName} — home`}
        >
          {/* whitespace-nowrap on the lockup keeps the wordmark on one line
              at 320px, where it previously wrapped under the mark. */}
          <BrandLogo size="sm" variant="lockup" className="whitespace-nowrap" />
        </Link>

        {/* Switches at lg (1024), not md (768). Measured at exactly 768px the
            desktop cluster needed 845px and ran 77px past the viewport, with
            the theme toggle entirely offscreen — visible only because
            `body { overflow-x: hidden }` was clipping it. 768 now gets the
            mobile panel, which already has the focus trap and scroll lock. */}
        <div className="hidden items-center gap-1 rounded-full border border-border bg-background/80 p-1.5 shadow-card backdrop-blur-lg lg:flex">
          {navItems.map((item) =>
            item.anchor ? (
              <NavAnchor
                key={item.to}
                to={item.to}
                className={linkClass({ isActive: false })}
              >
                {t(item.labelKey)}
              </NavAnchor>
            ) : (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {t(item.labelKey)}
              </NavLink>
            ),
          )}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform hover:translate-y-[-1px]"
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
            {t("nav.resume")}
          </a>
          <LanguageSelector />
          <ThemeToggle />
        </div>

        {/* The language selector moves into the panel on mobile: at 320px the
            three controls together measured 227px and pushed the header past
            the viewport. */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            className="grid h-11 w-11 place-items-center rounded-md border border-border bg-card"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="border-t border-border bg-background lg:hidden"
        >
          <div className="container flex flex-col gap-1 py-3">
            {navItems.map((item) =>
              item.anchor ? (
                <NavAnchor
                  key={item.to}
                  to={item.to}
                  className="flex min-h-11 items-center rounded-md px-3 text-muted-foreground transition-colors hover:bg-secondary"
                  onNavigate={closeMenu}
                >
                  {t(item.labelKey)}
                </NavAnchor>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center rounded-md px-3 transition-colors hover:bg-secondary ${
                      isActive ? "font-medium text-foreground" : "text-muted-foreground"
                    }`
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              ),
            )}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/50 px-4 text-sm font-medium"
            >
              <FileDown className="h-4 w-4" aria-hidden="true" />
              {t("nav.downloadResume")}
            </a>
            {/* Start-aligned here: the trigger sits at the left content
                gutter, so end-alignment pushed the 208px panel past the left
                edge and collision detection flushed it to x=0. */}
            <div className="mt-2 border-t border-hairline pt-3">
              <LanguageSelector
                align="start"
                onOpenChange={(open) => {
                  languageMenuOpen.current = open;
                }}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

/**
 * Renders an in-page anchor target. A bare hash stays a native anchor so the
 * browser handles the scroll on every route; a route-plus-hash goes through
 * the router, and `Layout` scrolls to the hash after navigation.
 */
export const NavAnchor = ({
  to,
  className,
  onNavigate,
  children,
}: {
  to: string;
  className?: string;
  onNavigate?: () => void;
  children: React.ReactNode;
}) =>
  to.startsWith("#") ? (
    <a href={to} className={className} onClick={onNavigate}>
      {children}
    </a>
  ) : (
    <Link to={to} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );

export default Navigation;
