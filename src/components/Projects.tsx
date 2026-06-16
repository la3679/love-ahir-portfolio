import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Smartphone,
  Brain,
  BarChart3,
  BookOpen,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import {
  projects,
  projectCategories,
  filterProjects,
  countByCategory,
  type ProjectCategory,
} from "@/data/portfolio";

const categoryIcon: Record<ProjectCategory, typeof Globe> = {
  "Web App": Globe,
  "Mobile App": Smartphone,
  "Machine Learning": Brain,
  "Data Analysis": BarChart3,
  Publication: BookOpen,
};

const Projects = () => {
  const [active, setActive] = useState<ProjectCategory | "All">("All");
  const counts = useMemo(() => countByCategory(projects), []);
  const visible = useMemo(() => filterProjects(projects, active), [active]);

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Selected Work"
          title="Things I've designed, built, and shipped"
          description="A mix of production products, research, and ambitious side projects — filter by what you care about."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {projectCategories.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? "border-transparent bg-gradient-aurora text-background shadow-glow"
                    : "border-border bg-card/40 text-muted-foreground hover:border-aurora-violet/40 hover:text-foreground"
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-xs ${isActive ? "text-background/70" : "text-muted-foreground/60"}`}>
                  {counts[cat] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <motion.div layout className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => {
              const Icon = categoryIcon[project.category];
              return (
                <motion.a
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35 }}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-glow group relative flex flex-col overflow-hidden rounded-2xl glass p-6"
                >
                  {project.featured && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-aurora-amber/15 px-2 py-0.5 text-[10px] font-medium text-aurora-amber">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-aurora-violet/10 text-aurora-violet">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground transition-colors group-hover:text-aurora-violet">
                    {project.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {project.blurb}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border bg-card/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-aurora-cyan">
                    View project
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-aurora-violet/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </motion.a>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
