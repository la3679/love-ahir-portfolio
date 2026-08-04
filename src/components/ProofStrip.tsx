import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLattice, useSceneSection } from "./lattice/latticeState";

interface ProofItem {
  value: string;
  labelKey: string;
  to: string;
}

/**
 * Four professional signals, no more — a metric wall reads as noise.
 * Values come from the Morgan Stanley and Sage Softtech roles documented in
 * the experience section each one links to; GPA and publication counts are
 * deliberately not here, they are supporting credentials rather than
 * engineering proof.
 */
const items: ProofItem[] = [
  { value: "4+", labelKey: "home.proof.yearsLabel", to: "/about#experience" },
  { value: "99.97%", labelKey: "home.proof.uptimeLabel", to: "/about#experience" },
  { value: "500K+", labelKey: "home.proof.transactionsLabel", to: "/about#experience" },
  { value: "10M+", labelKey: "home.proof.documentsLabel", to: "/about#experience" },
];

/**
 * Credibility strip: each stat links to the artifact that backs it, not a
 * floating number. Rendered without Framer Motion so the figures are present
 * in React's first paint — this is proof content a recruiter scans
 * immediately, and it must never wait on an animation frame.
 */
const ProofStrip = () => {
  const { t } = useTranslation();
  const sectionRef = useSceneSection("proof");
  const { setEmphasis } = useLattice();

  return (
    <section ref={sectionRef} className="relative z-10 pb-6 lg:-mt-8 lg:pb-8">
      <ul className="container grid grid-cols-2 overflow-hidden border-y border-border bg-background/90 shadow-card backdrop-blur-sm lg:grid-cols-4 lg:divide-x lg:rounded-2xl lg:border">
        {items.map((item, i) => (
          <li key={item.labelKey} className="rise-in" style={{ animationDelay: `${i * 60}ms` }}>
            <Link
              to={item.to}
              /* Hover and keyboard focus produce the same restrained response
                 in the shared scene. It carries no meaning about which metric
                 was engaged — no metric is ever associated with a project. */
              onMouseEnter={() => setEmphasis(true)}
              onMouseLeave={() => setEmphasis(false)}
              onFocus={() => setEmphasis(true)}
              onBlur={() => setEmphasis(false)}
              className="group block min-h-full px-2 py-6 transition-colors hover:bg-secondary/50 lg:px-7"
            >
              <span className="flex items-start gap-1 font-display text-3xl font-bold text-foreground">
                {item.value}
                <ArrowUpRight
                  className="mt-1 h-4 w-4 text-signal opacity-60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-2 block text-sm text-muted-foreground">
                {t(item.labelKey)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProofStrip;
