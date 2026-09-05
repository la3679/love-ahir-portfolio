import { ArrowRight, FileDown, Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { profile } from "@/data/portfolio";
import {
  getTechnology,
  stageTechnologyRails,
  type TechnologyId,
} from "@/data/technologyCatalog";
import { riseDelay } from "@/lib/motion";
import HeroSystemsVideo from "./HeroSystemsVideo";
import { useLattice, useSceneSection } from "./lattice/latticeState";

/**
 * Recruiter-first hero for the warm systems observatory (§34).
 *
 * Copy owns the left plane and the motion plate is physically mounted inside
 * the right-hand stage, sharing its clip, radius and tilt. The plate is now an
 * authored clip rather than a WebGL scene, so the hero ships no renderer and
 * no scene controls. The global FX layer is still mounted once by Layout,
 * outside this isolated hero stacking context.
 */
const Hero = () => {
  const { t } = useTranslation();
  const { section: activeSceneSection } = useLattice();
  const sectionRef = useSceneSection("hero");

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate overflow-hidden pt-28 lg:min-h-[46rem] lg:pt-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(55%_65%_at_84%_36%,hsl(var(--primary)/0.08),transparent_72%)]"
      />

      <div className="container relative z-10 grid items-center gap-10 pb-10 lg:grid-cols-[minmax(20rem,0.84fr)_minmax(30rem,1.16fr)] lg:gap-10 lg:pb-16 xl:gap-14">
        <div className="relative z-10 max-w-3xl">
          <div
            className="rise-in inline-flex items-center rounded-full border border-signal/30 bg-background/80 px-3 py-1.5 text-xs font-medium text-signal"
            style={riseDelay(0)}
          >
            {t("hero.badge")}
          </div>

          <h1
            className="rise-in mt-7 max-w-[13ch] font-display text-display-lg font-bold text-foreground"
            style={riseDelay(1)}
          >
            {t("hero.statement")}
          </h1>

          <p
            className="rise-in mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
            style={riseDelay(2)}
          >
            {t("hero.roles")}
          </p>

          <div
            className="rise-in mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            style={riseDelay(3)}
          >
            <Link
              to="/work"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:translate-y-[-1px]"
            >
              {t("hero.seeWork")}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border-bright bg-background/65 px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/70"
            >
              <FileDown className="h-4 w-4" aria-hidden="true" />
              {t("hero.resume")}
            </a>
          </div>

          <div
            className="rise-in mt-6 flex items-center gap-3"
            style={riseDelay(4)}
          >
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
        </div>

        {/* Two nested transforms, deliberately on separate elements: the outer
            box takes the viewport-wide pointer parallax and the inner stage
            takes its own tilt, so neither controller overwrites the other. */}
        <div className="rise-in relative" style={riseDelay(2)}>
          <div data-parallax="true">
            <div
              data-tilt
              data-tilt-max="9"
              data-stage-rails-active={
                activeSceneSection === "hero" ? "true" : "false"
              }
              className="observatory-stage hero-video-stage relative min-h-[22rem] overflow-hidden rounded-[var(--radius-stage)] border border-border-bright/70 sm:min-h-[28rem] lg:min-h-[34rem] xl:min-h-[38rem]"
            >
              {/* Decorative throughout: the clip states nothing the heading
                  and copy do not already say, so it carries no control, no
                  caption and no accessible name. */}
              <HeroSystemsVideo />
              <StageTechRail position="top" items={stageTechnologyRails.top} />
              <StageTechRail
                position="bottom"
                items={stageTechnologyRails.bottom}
              />
            </div>
          </div>
        </div>
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
    className="grid h-11 w-11 place-items-center rounded-full border border-border bg-background/55 text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
  >
    {children}
  </a>
);

export default Hero;

const StageTechRail = ({
  position,
  items,
}: {
  position: "top" | "bottom";
  items: readonly TechnologyId[];
}) => {
  // Exactly two copies are required for the track's -50% seamless loop.
  const loop = ([0, 1] as const).flatMap((copy) =>
    items.map((technologyId) => ({ copy, technologyId })),
  );
  const duration = position === "top" ? 38 : 44;

  return (
    <div
      aria-hidden="true"
      data-tech-rail={position}
      className={`stage-tech-rail ${
        position === "top" ? "stage-tech-rail--top" : "stage-tech-rail--bottom"
      }`}
    >
      <div
        className="stage-tech-rail__track"
        data-tech-rail-track={position}
        style={{
          animationDirection: position === "top" ? "normal" : "reverse",
          animationDuration: `${duration}s`,
        }}
      >
        {loop.map(({ copy, technologyId }) => {
          const technology = getTechnology(technologyId);

          return (
            <span
              key={`${copy}-${technologyId}`}
              className="stage-tech-rail__item"
              data-technology={technologyId}
            >
              <span
                className={`stage-tech-rail__logo technology-logo-tile ${
                  technology.wide ? "stage-tech-rail__logo--wide" : ""
                }`}
              >
                <img
                  src={technology.icon}
                  alt=""
                  width={technology.wide ? 34 : 24}
                  height={24}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              {technology.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};
