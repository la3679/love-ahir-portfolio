import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import portrait from "@/assets/profile-photo.jpg";
import { education, experiences, profile } from "@/data/portfolio";
import { useReveal } from "@/lib/motion";
import { usePointerDepth } from "@/lib/pointerMotion";
import { useSceneSection } from "./lattice/latticeState";

/**
 * Editorial About moment: Love's real portrait carries the left plane while
 * concise, verified engineering context occupies the protected right plane.
 * DOM order keeps the title and first paragraph before the photo on mobile.
 */
const AboutSection = () => {
  const { t } = useTranslation();
  const reveal = useReveal();
  const sectionRef = useSceneSection("about");
  const portraitRef = useRef<HTMLDivElement>(null);
  usePointerDepth(portraitRef, "portrait");

  const current = experiences.find((role) => role.current) ?? experiences[0];
  const masters = education[0];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section home-about-section hairline-t overflow-hidden"
      aria-labelledby="home-about-heading"
    >
      <div className="container">
        <motion.div
          {...reveal}
          className="grid items-start gap-8 lg:grid-cols-[minmax(18rem,0.82fr)_minmax(0,1.18fr)] lg:gap-x-20 lg:gap-y-7"
        >
          <div className="lg:col-start-2">
            <span className="meta-line uppercase">{t("about.eyebrow")}</span>
            <h2
              id="home-about-heading"
              className="mt-4 max-w-2xl font-display text-display-md font-bold text-foreground"
            >
              {t("about.title")}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("about.p1")}
            </p>
          </div>

          <div className="mx-auto w-full max-w-[16rem] sm:max-w-[22rem] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:max-w-[26rem]">
            <div
              ref={portraitRef}
              data-depth-surface="portrait"
              className="portrait-depth-scene relative pb-5 pl-5"
            >
              <span
                aria-hidden="true"
                className="portrait-depth-back absolute bottom-0 left-0 h-[78%] w-[82%] rounded-2xl border border-primary/25 bg-primary/5"
              />
              <span
                aria-hidden="true"
                className="absolute -left-px bottom-14 h-28 w-px bg-gradient-to-b from-transparent via-primary to-transparent"
              />
              <div
                className="portrait-depth-frame relative rounded-2xl border border-border-bright bg-card p-3 shadow-card"
              >
                <div className="portrait-depth-photo overflow-hidden rounded-xl">
                  <img
                    src={portrait}
                    alt={t("home.about.photoAlt")}
                    width={640}
                    height={853}
                    loading="lazy"
                    decoding="async"
                    className="block w-full object-cover"
                    style={{ aspectRatio: "3 / 4" }}
                  />
                </div>
                <p className="portrait-depth-caption mt-3 px-1 font-mono text-xs text-muted-foreground">
                  {profile.shortName} · {profile.location}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-start-2">
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              {t("about.p2")}
            </p>

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-5 sm:grid-cols-3">
              <Fact label={t("home.about.nowLabel")}>
                {t(current.roleKey)} · {current.company}
              </Fact>
              <Fact label={t("home.about.basedLabel")}>{profile.location}</Fact>
              <Fact label={t("home.about.studiedLabel")}>
                {masters.degree} · RIT
              </Fact>
            </dl>

            <Link
              to="/about"
              className="link-underline group mt-7 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-foreground"
            >
              {t("home.about.cta")}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Fact = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <dt className="meta-line uppercase">{label}</dt>
    <dd className="mt-1.5 text-sm leading-relaxed text-foreground">{children}</dd>
  </div>
);

export default AboutSection;
