import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BrandLogo from "./BrandLogo";

const INTRO_SESSION_KEY = "love-ahir-intro-seen";

function shouldShowIntro() {
  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) !== "true";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, "true");
  } catch {
    // Storage can be unavailable in private contexts; the intro should not block.
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const IntroLoader = () => {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => shouldShowIntro());

  useEffect(() => {
    if (!visible) return;

    markIntroSeen();
    const duration = prefersReducedMotion() ? 180 : 1550;
    const timer = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <motion.div
      role="status"
      aria-label="Loading Love Ahir portfolio"
      className="pointer-events-none fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 aurora-noise opacity-30" />
      <motion.div
        className="absolute h-[34rem] w-[34rem] rounded-full bg-gradient-aurora opacity-20 blur-[120px]"
        initial={reduceMotion ? false : { scale: 0.72, rotate: -18 }}
        animate={reduceMotion ? undefined : { scale: 1.05, rotate: 8 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="relative flex flex-col items-center gap-6"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.12 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <BrandLogo size="xl" animated={!reduceMotion} title="Love Ahir Aurora Prism logo" />
        <motion.div
          className="h-px w-48 overflow-hidden rounded-full bg-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.35, duration: 0.35 }}
        >
          <motion.span
            className="block h-full bg-gradient-aurora"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              delay: reduceMotion ? 0 : 0.38,
              duration: reduceMotion ? 0.12 : 0.86,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </motion.div>
        <span className="font-mono text-xs uppercase tracking-[0.32em] text-muted-foreground">
          Love Ahir
        </span>
      </motion.div>
    </motion.div>
  );
};

export default IntroLoader;
