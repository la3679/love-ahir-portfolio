import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowUpRight, Database } from "lucide-react";
import { getCaseStudy } from "@/data/caseStudies";

const SLUG = "resumatch-ai";

/**
 * The four stages of ResuMatch's request path. Titles are the real component
 * names from the project's verified stack; the descriptive line for each is a
 * locale key. Everything traces to `caseStudies.ts` → `resumatch-ai`
 * (`approach`, `stack`, `shipped`) — see IMPLEMENTATION.md §10.2.
 */
const FLOW = [
  { name: "React", detailKey: "hero.stage.step.client" },
  { name: "FastAPI", detailKey: "hero.stage.step.api" },
  { name: "LLM embeddings", detailKey: "hero.stage.step.match" },
  { name: "Gemini", detailKey: "hero.stage.step.explain" },
] as const;

/**
 * Direction A's ivory engineering-artifact stage, replacing the portrait that
 * used to sit beside the hero.
 *
 * This is an **architecture illustration, not a screenshot**. There is no
 * product UI, no fabricated interface, no invented user, deployment, or
 * customer — only the real request path of a real project, drawn from the
 * verified case-study record. It is built from HTML text rather than an image
 * so it translates, scales, reflows at 320px, and survives 200% zoom.
 *
 * It renders visible with no opacity gating, in line with the Gate 2
 * first-paint guarantee: critical content is visible immediately once React
 * mounts, even when Framer/rAF does not advance.
 */
const HeroStage = () => {
  const { t } = useTranslation();
  const study = getCaseStudy(SLUG);
  if (!study) return null;

  return (
    <figure className="stage-surface relative overflow-hidden rounded-stage border border-border p-6 shadow-stage sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div>
          <span className="meta-line uppercase">{t("hero.stage.label")}</span>
          <p className="mt-2 font-display text-lg font-semibold text-foreground">
            {study.project}
          </p>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          {study.stack.join(" · ")}
        </p>
      </div>

      <ol className="mt-7 grid gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        {FLOW.map((step, i) => (
          <li key={step.name} className="relative">
            {/* Connector: decorative only, and only between steps. */}
            {i < FLOW.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute -right-2 top-2 hidden h-px w-4 bg-border-bright lg:block"
              />
            )}
            {/* `--signal`, not `--primary`: measured on the ivory stage,
                primary is 3.95:1 and fails 4.5:1 for 12px text. */}
            <span className="font-mono text-xs text-signal">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-1.5 font-mono text-sm font-medium text-foreground">
              {step.name}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t(step.detailKey)}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-7 flex items-start gap-2 border-t border-border pt-5 text-sm text-muted-foreground">
        <Database className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
        {t("hero.stage.store")}
      </p>

      <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        {/* Stated plainly and permanently, not on hover: this is a diagram. */}
        <span className="max-w-md text-xs leading-relaxed text-muted-foreground">
          {t("hero.stage.disclaimer")}
        </span>
        <Link
          to={`/work/${study.slug}`}
          className="link-underline inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-foreground"
        >
          {t("hero.stage.cta")}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </figcaption>
    </figure>
  );
};

export default HeroStage;
