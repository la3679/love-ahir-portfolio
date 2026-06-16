import { motion } from "framer-motion";
import { GraduationCap, MapPin, Calendar, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { education } from "@/data/portfolio";

const About = () => {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="About"
          title="Engineer by training, researcher by curiosity"
          description="I care about the unglamorous middle of software — the place where a clean interface meets data that doesn't behave. That's where the interesting problems live."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="space-y-5 text-base leading-relaxed text-muted-foreground"
          >
            <p>
              I recently completed my{" "}
              <span className="text-foreground">
                M.S. in Computer Software Engineering at RIT
              </span>{" "}
              with a 3.94 GPA. Along the way I worked as both a teaching and
              research assistant — teaching software quality to graduate
              students while running large-scale privacy experiments of my own.
            </p>
            <p>
              My research asked a deceptively simple question:{" "}
              <span className="text-foreground">
                do apps actually do what their privacy policies say?
              </span>{" "}
              The answer, across 86 million log entries, was mostly no — and
              that work is now published in the EASE 2026 Research Track.
            </p>
            <p>
              Outside research, I ship product. I've built AI streaming
              platforms, recruitment engines, and 3D strategy games — usually
              full-stack, usually with an LLM doing something genuinely useful
              rather than decorative.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {["Privacy & Security", "Full-Stack", "Applied AI", "Data"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </motion.div>

          <div className="space-y-5">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <GraduationCap className="h-5 w-5 text-aurora-violet" />
              Education
            </h3>
            {education.map((edu, i) => (
              <motion.a
                key={edu.degree}
                href={edu.documentLink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="card-glow group block rounded-2xl glass p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-semibold text-foreground transition-colors group-hover:text-aurora-violet">
                    {edu.degree}
                  </h4>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-aurora-violet" />
                </div>
                <p className="mt-1 text-sm font-medium text-aurora-cyan">
                  {edu.institution}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {edu.period}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {edu.location}
                  </span>
                  <span className="font-semibold text-aurora-violet">
                    GPA {edu.gpa}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {edu.highlight}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
