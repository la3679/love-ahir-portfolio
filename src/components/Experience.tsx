import { Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const Experience = () => {
  const { t } = useTranslation();

  const [visibleExperiences, setVisibleExperiences] = useState(new Set());

  const experienceRefs = useRef([]);

  const experiences = [
    {
      title: "Teaching Assistant – Software Quality Assurance (SWEN 777)",
      company: "Rochester Institute of Technology",
      location: "Rochester, NY",
      period: "Aug 2025 – Dec 2025",
      description:
        "Supported graduate-level instruction for Software Quality Assurance under Professor Xueling Zhang, focusing on software testing methodologies, research integration, and quality improvement practices.",
      achievements: [
        "Assisted Dr. Xueling Zhang in teaching graduate-level Software Quality Assurance, enhancing student comprehension.",
        "Held weekly office hours via Slack, Email, and Zoom to answer student questions on assignments and research papers, improving assignment quality and overall class satisfaction.",
        "Facilitated engagement in seminars discussing more than 25 research papers, fostering critical thinking and collaboration.",
        "Strengthened student understanding of software testing methodologies and academic integrity."
      ],
      color: "tech-green",
      offerLetterLink: "https://www.rit.edu/"
    },

    {
      title: "Graduate Assistant",
      company: "Rochester Institute of Technology",
      location: "Rochester, NY",
      period: "Aug 2024 – Dec 2025",
      description: (
        <>
          Collaborated with Professor Yiming Tang on advanced research in
          privacy leak detection. Co-authored the research paper{" "}
          <a
            href="https://conf.researchr.org/details/ease-2026/ease-2026-research-papers/2/Do-Privacy-Policies-Match-with-the-Logs-An-Empirical-Study-of-Privacy-Disclosure-in-"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            "Do Privacy Policies Match with the Logs? An Empirical Study of
            Privacy Disclosure in Android Application Logs"
          </a>{" "}
          published in the EASE 2026 Research Track.
        </>
      ),
      achievements: [
        "Published research in the EASE 2026 Research Track analyzing inconsistencies between Android privacy policies and more than 86M real log entries.",
        "Conducted privacy leak detection research in Android applications, focusing on automated testing and behavioral analysis.",
        "Developed Python scripts for metadata scraping and automated testing using ADB, Monkey, and logcat."
      ],
      color: "tech-cyan",
      offerLetterLink: "https://www.rit.edu/"
    },

    {
      title: "Software Engineer Intern",
      company: "Axisray Pvt Ltd",
      location: "Ahmedabad, India",
      period: "Jan 2023 – May 2023",
      description:
        "Refined Java-based architectures, enhancing software reliability and accelerating delivery timelines by 20%.",
      achievements: [
        "Refined Java-based microservices architecture using Spring Boot, enhancing software reliability and accelerating feature delivery timelines by 20%.",
        "Built ML models and integrated scalable workflows using Python and Java Spring Boot, improving recommendation accuracy by 30% and system efficiency by 25%.",
        "Upgraded legacy JSP applications with Spring Boot for advanced data visualization, improving team collaboration.",
        "Orchestrated cross-departmental efforts, stabilizing delivery schedules and improving project timelines by 20%."
      ],
      color: "accent-bright",
      offerLetterLink:
        "https://drive.google.com/file/d/1y6q0oPhLX4bjA9EYl9T6jEtiki8fRQOw/view?usp=sharing"
    },

    {
      title: "Data Science and AI/ML Engineering Intern",
      company: "Moon Technolabs Pvt Ltd",
      location: "Ahmedabad, India",
      period: "May 2022 – Oct 2022",
      description:
        "Spearheaded a SaaS supply chain resiliency project, increasing operational efficiency by 30%.",
      achievements: [
        "Spearheaded a SaaS supply chain resiliency project, increasing operational efficiency by 30%.",
        "Adopted diverse roles to enhance project versatility, improving processes across HRMS and CRM systems by 25%.",
        "Led the development of data pipelines and AI-driven solutions, ensuring scalable and adaptive operations.",
        "Worked on multiple AI/ML models to optimize resource allocation, reducing operational costs by 15%."
      ],
      color: "tech-pink",
      offerLetterLink:
        "https://drive.google.com/file/d/1NSkvGMOANb5-mr1zKGDQZNfSDczWdcZj/view?usp=sharing"
    }
  ];

  useEffect(() => {
    const observers = new Map();

    experienceRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  setVisibleExperiences((prev) => new Set([...prev, index]));
                }, index * 200);
              }
            });
          },
          {
            threshold: 0.1,
            rootMargin: "50px"
          }
        );

        observer.observe(ref);
        observers.set(index, observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <section
      id="experience"
      className="py-20 bg-gradient-to-br from-muted/20 via-background to-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-bright to-tech-cyan bg-clip-text text-transparent">
            {t("experience.title")}
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("experience.subtitle")}
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-tech-cyan/50 to-primary/50"></div>

          {experiences.map((exp, index) => {
            const isVisible = visibleExperiences.has(index);

            return (
              <div
                key={exp.title}
                ref={(el) => (experienceRefs.current[index] = el)}
                className={`mb-12 last:mb-0 ultra-smooth ${
                  isVisible
                    ? "opacity-100 translate-x-0 scale-100"
                    : "opacity-0 translate-x-8 scale-95"
                }`}
                style={{
                  transitionDelay: isVisible
                    ? `${index * 200}ms`
                    : "0ms"
                }}
              >
                <div className="flex items-start gap-6">
                  {/* Timeline Node */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-tech-cyan/20 border-2 border-primary/30 flex items-center justify-center backdrop-blur-sm">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div
                    className="group flex-1 bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:scale-105 relative cursor-pointer"
                    onClick={() =>
                      window.open(exp.offerLetterLink, "_blank", "noopener,noreferrer")
                    }
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {exp.title}
                          </h3>

                          <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                        </div>

                        <div className="space-y-2">
                          <p className="text-tech-cyan font-medium text-lg">
                            {exp.company}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{exp.location}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span className="font-semibold text-primary">
                                {exp.period}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-muted-foreground mb-6 leading-relaxed">
                      {exp.description}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        {t("experience.achievements")}
                      </h4>

                      <ul className="space-y-3">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li
                            key={achIndex}
                            className={`flex items-start gap-3 text-muted-foreground text-sm transition-all duration-300 ${
                              isVisible
                                ? "translate-x-0 opacity-100"
                                : "translate-x-4 opacity-0"
                            }`}
                            style={{
                              transitionDelay: isVisible
                                ? `${achIndex * 100}ms`
                                : "0ms"
                            }}
                          >
                            <div className="w-2 h-2 rounded-full bg-tech-cyan mt-2 flex-shrink-0"></div>

                            <span className="leading-relaxed">
                              {achievement}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
