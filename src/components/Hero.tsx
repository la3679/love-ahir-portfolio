import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail, FileDown, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import TypingAnimation from "./TypingAnimation";
import { profile, stats } from "@/data/portfolio";
import profilePhoto from "@/assets/profile-photo.jpg";
import { scrollToHref } from "./Navigation";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-0 pt-24"
    >
      <div className="absolute left-1/2 top-28 h-px w-[min(56rem,80vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-aurora-cyan/40 to-transparent" />
      <div className="container grid items-center gap-12 pb-14 lg:grid-cols-[1.08fr_0.92fr] lg:pb-28">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-aurora-emerald/30 bg-aurora-emerald/10 px-3 py-1.5 text-xs font-medium text-aurora-emerald shadow-[0_0_40px_-20px_hsl(var(--aurora-emerald))]"
          >
            <span className="h-2 w-2 animate-pulse-ring rounded-full bg-aurora-emerald" />
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.02] md:text-7xl xl:text-8xl"
          >
            <span className="text-foreground">Love</span>{" "}
            <span className="text-gradient">Ahir</span>
          </motion.h1>

          <motion.div
            variants={item}
            className="mt-5 flex min-h-9 flex-wrap items-center gap-2 text-xl font-medium text-muted-foreground md:text-2xl"
          >
            <span className="text-foreground/80">{t("hero.intro")}</span>
            <TypingAnimation words={profile.roles} />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg"
          >
            {profile.summary}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => scrollToHref("#projects")}
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-aurora px-6 py-3 text-sm font-semibold text-background shadow-glow transition-transform hover:scale-[1.03]"
            >
              {t("hero.explore")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-card/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-aurora-violet/50"
            >
              <FileDown className="h-4 w-4" />
              {t("hero.resume")}
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <SocialLink href={profile.github} label="GitHub">
                <Github className="h-5 w-5" />
              </SocialLink>
              <SocialLink href={profile.linkedin} label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </SocialLink>
              <SocialLink href={`mailto:${profile.email}`} label="Email">
                <Mail className="h-5 w-5" />
              </SocialLink>
            </div>
            <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 text-sm text-muted-foreground backdrop-blur">
              <MapPin className="h-4 w-4 text-aurora-cyan" />
              {profile.location}
            </span>
          </motion.div>

          <motion.div variants={item} className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl glass px-4 py-3">
                <div className="text-xl font-bold text-gradient">{s.value}</div>
                <div className="mt-1 text-xs leading-snug text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative mx-auto w-full max-w-[24rem] lg:max-w-[28rem]"
        >
          <div className="relative aspect-square premium-border rounded-[2rem] glass-strong p-4">
            <div className="absolute inset-3 rounded-[1.5rem] aurora-ring animate-spin-slower opacity-50 blur-[2px]" />
            <div className="absolute inset-[18px] rounded-[1.35rem] bg-background" />
            <img
              src={profilePhoto}
              alt={profile.name}
              className="absolute inset-6 h-[calc(100%-48px)] w-[calc(100%-48px)] rounded-[1.1rem] object-cover"
            />
            <div className="absolute inset-6 rounded-[1.1rem] ring-1 ring-inset ring-white/10" />
          </div>

          <FloatingChip className="-left-3 top-6 animate-float" label="EASE 2026" sub="Published" />
          <FloatingChip className="-right-3 top-1/3 animate-float-slow" label="GPA 3.94" sub="RIT M.S." />
          <FloatingChip className="bottom-8 left-3 animate-float" label="86M+" sub="Logs analyzed" />
        </motion.div>
      </div>
    </section>
  );
};

const SocialLink = ({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card/40 text-muted-foreground backdrop-blur transition-all hover:-translate-y-1 hover:border-aurora-violet/50 hover:text-foreground hover:shadow-glow"
  >
    {children}
  </a>
);

const FloatingChip = ({
  className,
  label,
  sub,
}: {
  className: string;
  label: string;
  sub: string;
}) => (
  <div
    className={`absolute hidden rounded-2xl glass-strong px-4 py-2.5 shadow-lg sm:block ${className}`}
  >
    <div className="text-sm font-bold text-gradient">{label}</div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{sub}</div>
  </div>
);

export default Hero;
