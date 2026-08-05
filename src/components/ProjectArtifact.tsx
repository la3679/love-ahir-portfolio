import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowUpRight, Github } from "lucide-react";
import { getCaseStudy } from "@/data/caseStudies";
import { useLattice, type SystemLayer } from "./lattice/latticeState";

const SLUG = "pokedex-mongodb";

/**
 * The lead-project systems artifact (IMPLEMENTATION.md §31.3).
 *
 * This keeps the editorial character of the ivory architecture-summary stage
 * that Love approved at Gate 2 — the `stage-surface` panel, numbered mono
 * stages, ruled divider and permanent disclaimer — and changes only its
 * subject, from ResuMatch to the Pokédex MongoDB Platform.
 *
 * Every fact is copied from the verified record in `caseStudies.ts` /
 * `portfolio.ts`: the four stages, the stack, and the 296k+ outcome. Pokédex is
 * a full-stack data project and is never described as an AI project. No AI, ML,
 * real-time multiplayer, deployment, user count, performance figure or external
 * integration is claimed for it.
 *
 * Intellectual property: nothing here references Pokémon characters, sprites,
 * silhouettes, Poké Balls, logos, cards, artwork or environments. The visual
 * identity is entirely abstract geometry and the portfolio's own tokens.
 *
 * Accessibility: the four stages are real `<button>`s in a toolbar with
 * `aria-pressed`, each at least 44px tall, reachable and operable by keyboard,
 * and distinguished by border weight and a filled marker as well as by colour.
 * They select a layer in the shared background visualization, but the component
 * is completely usable — and completely legible — when that visualization never
 * loads at all.
 */

interface Stage {
  layer: SystemLayer;
  /** Verified component name; a proper noun, so it is not translated. */
  name: string;
  detailKey: string;
}

const STAGES: Stage[] = [
  { layer: "interface", name: "React interface", detailKey: "artifact.stage.interface" },
  { layer: "services", name: "Flask API", detailKey: "artifact.stage.services" },
  { layer: "data", name: "MongoDB 2dsphere", detailKey: "artifact.stage.data" },
  { layer: "systems", name: "GridFS + battle systems", detailKey: "artifact.stage.systems" },
];

const ProjectArtifact = () => {
  const { t } = useTranslation();
  const { activeLayer, setActiveLayer } = useLattice();
  const study = getCaseStudy(SLUG);
  const headingId = useId();

  if (!study) return null;

  const outcome = study.metrics[0];

  return (
    <figure
      data-tilt
      data-tilt-max="6"
      className="stage-surface relative overflow-hidden rounded-stage border border-border p-5 shadow-stage sm:p-8"
      aria-labelledby={headingId}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div>
          <span className="meta-line uppercase">{t("artifact.label")}</span>
          <p id={headingId} className="mt-2 font-display text-xl font-semibold text-foreground">
            {study.project}
          </p>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          {study.stack.join(" · ")}
        </p>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {t(study.summaryKey)}
      </p>

      <div className="mt-7">
        <p className="meta-line uppercase" id={`${headingId}-stages`}>
          {t("artifact.stagesLabel")}
        </p>
        {/* Selection clears when the pointer leaves the group or focus moves
            out of it, so hover never leaves a stage stuck as selected. */}
        <ol
          className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4"
          aria-describedby={`${headingId}-stages`}
          onMouseLeave={() => setActiveLayer(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setActiveLayer(null);
            }
          }}
        >
          {STAGES.map((stage, i) => {
            const selected = activeLayer === stage.layer;
            return (
              <li key={stage.layer}>
                <button
                  type="button"
                  aria-pressed={selected}
                  /* Hover, focus, click and tap all resolve to the same
                     thing: this stage becomes the selected one. Click does
                     not toggle, because hover has usually already selected it
                     and a toggle would then read as "clicking turns it off". */
                  onClick={() => setActiveLayer(stage.layer)}
                  onMouseEnter={() => setActiveLayer(stage.layer)}
                  onFocus={() => setActiveLayer(stage.layer)}
                  className={`flex min-h-[44px] w-full flex-col items-start gap-1 rounded-md border p-3 text-left transition-colors ${
                    selected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-border-bright"
                  }`}
                >
                  <span className="flex items-center gap-2 font-mono text-xs text-signal">
                    {/* A filled marker, so the selected state is never
                        signalled by colour alone. */}
                    <span
                      aria-hidden="true"
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        selected ? "bg-primary" : "bg-transparent ring-1 ring-border-bright"
                      }`}
                    />
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-sm font-medium text-foreground">
                    {stage.name}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {t(stage.detailKey)}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {outcome && (
        <div className="mt-7 border-t border-border pt-5">
          <span className="meta-line uppercase">{t("artifact.outcomeLabel")}</span>
          <p className="mt-2 text-base leading-relaxed text-foreground">
            <span className="font-display text-2xl font-bold text-accent">
              {outcome.value}
            </span>{" "}
            {outcome.label}
          </p>
        </div>
      )}

      <figcaption className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        {/* Permanent and plain, never on hover: this is a diagram. */}
        <span className="max-w-md text-xs leading-relaxed text-muted-foreground">
          {t("artifact.disclaimer")}
        </span>
        <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Link
            to={`/work/${study.slug}`}
            className="link-underline inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-foreground"
          >
            {t("artifact.cta")}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {study.links.repo && (
            <a
              href={study.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              {t("artifact.repo")}
              <span className="sr-only"> — {study.project}</span>
            </a>
          )}
        </span>
      </figcaption>
    </figure>
  );
};

export default ProjectArtifact;
