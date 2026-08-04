import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navigation from "./Navigation";
import Contact from "./Contact";
import Footer from "./Footer";
import FxLayer from "./FxLayer";
import { injectJsonLd, personJsonLd } from "./Seo";

/**
 * Frames to keep looking for a hash target before giving up.
 *
 * A direct hit on /about#experience runs this effect before the lazy /about
 * chunk has mounted, so the element does not exist on the first frame. ~30
 * frames (about half a second) covers chunk load without leaving a runaway
 * loop if the id genuinely does not exist.
 */
const HASH_RETRY_FRAMES = 30;

/**
 * Frames to keep a freshly deep-linked target parked under the header while
 * fonts swap and images decode. ~2s at 60fps; the loop also stops as soon as
 * the reader scrolls.
 */
const SETTLE_FRAMES = 120;

/**
 * Shared page chrome: skip link, header, <main>, the contact CTA that closes
 * every page, and the footer. Handles scroll + focus management on route
 * change so keyboard and screen-reader users land at the new page's content.
 */
const Layout = () => {
  const { t } = useTranslation();
  const { pathname, hash } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  useEffect(() => injectJsonLd("seo-person-jsonld", personJsonLd), []);

  useEffect(() => {
    const wasFirstRender = firstRender.current;
    firstRender.current = false;

    // A hash is handled on the initial render too. Skipping it here is what
    // left a direct /about#experience load at scrollY 0 with focus on <body>.
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      let frame = 0;
      let raf = 0;
      let cancelled = false;
      // Where we last parked the page and where the target sat in the document
      // at that moment, so a correction can tell its own scroll from one the
      // reader performed, and can notice content above the target growing.
      let parkedAt = -1;
      let parkedDocTop = -1;

      const align = (target: HTMLElement) => {
        // `scroll-padding-top: 6rem` on <html> (src/index.css) keeps the fixed
        // header off the target for both this call and native same-page
        // anchor jumps.
        //
        // On a direct load the jump is instant: `scroll-behavior: smooth`
        // would otherwise animate ~1,900px from a cold start, and that
        // animation is frame-driven, so a page opened in a background tab
        // never arrives. In-app navigation keeps the smooth CSS default —
        // there the reader is already looking at the page.
        target.scrollIntoView(wasFirstRender ? { behavior: "instant" } : undefined);
        parkedAt = window.scrollY;
        parkedDocTop = target.getBoundingClientRect().top + window.scrollY;
      };

      /**
       * A direct load scrolls before web fonts swap in and before images
       * decode. Those late reflows grow the content above the target and slide
       * it back out from under the viewport — measured at 96px on
       * /about#experience. Re-park while the page settles, and give up the
       * moment the reader scrolls or the budget runs out.
       */
      let corrections = 0;
      const correct = () => {
        if (cancelled || ++corrections > SETTLE_FRAMES) return;
        const target = document.getElementById(id);
        if (!target) return;
        if (Math.abs(window.scrollY - parkedAt) > 2) return; // reader took over
        const docTop = target.getBoundingClientRect().top + window.scrollY;
        if (Math.abs(docTop - parkedDocTop) > 1) align(target);
        raf = requestAnimationFrame(correct);
      };

      const settle = () => {
        if (cancelled) return;
        const target = document.getElementById(id);
        if (!target) {
          if (++frame <= HASH_RETRY_FRAMES) raf = requestAnimationFrame(settle);
          return;
        }
        align(target);
        // The target opts in with tabIndex={-1}; focusing it moves both the
        // screen-reader cursor and the tab sequence to the section instead of
        // leaving them on <body>.
        target.focus({ preventScroll: true });

        if (wasFirstRender) raf = requestAnimationFrame(correct);
      };

      settle();
      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
      };
    }

    // Initial load with no hash: leave the browser's own scroll restoration
    // and initial focus alone.
    if (wasFirstRender) return;

    window.scrollTo(0, 0);
    // Move focus to the page container so the next Tab lands in fresh content.
    mainRef.current?.focus();
  }, [pathname, hash]);

  return (
    <div className="app-shell relative min-h-screen">
      <FxLayer />
      <a href="#main" className="skip-link">
        {t("nav.skipToContent")}
      </a>
      <Navigation />
      {/* tabIndex=-1 lets route changes focus the main region programmatically */}
      <main id="main" ref={mainRef} tabIndex={-1} className="relative z-[1] outline-none">
        <Outlet />
      </main>
      <Contact />
      <Footer />
    </div>
  );
};

export default Layout;
