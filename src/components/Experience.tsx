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
    description: "Supported graduate-level instruction for Software Quality Assurance under Professor Xueling Zhang, focusing on software testing methodologies, research integration, and quality improvement practices.",
    achievements: [
      "Held weekly office hours (Zoom, Slack, and Email) to mentor students on testing strategies, research papers, and project deliverables.",
      "Guided student teams in open-source project quality analysis, including unit testing, coverage improvement, bug reporting, and static/mutation testing.",
      "Assisted with grading, feedback, and seminar facilitation on ~25 research papers in software testing and software quality.",
      "Reinforced academic integrity and ethical AI usage policies, ensuring adherence to RIT’s standards."
    ],
    color: "tech-green",
    offerLetterLink: "https://www.rit.edu/"
    },
    {
      title: "Graduate Assistant",
      company: "Rochester Institute of Technology",
      location: "Rochester, NY",
      period: "Aug 2024 – Present",
      description: "Collaborate with Professor Yiming Tang on advanced research in privacy leak detection, designing datasets using Monkey testing and logcat analysis to ensure robust application evaluation.",
      achievements: [
        "Collaborate with Professor Yiming Tang on advanced research in privacy leak detection, designing datasets using Monkey testing and logcat analysis to ensure robust application evaluation.",
        "Learned advanced research methods and collaborative problem-solving, strengthening skills in DEI-focused technology development."
      ],
      color: "tech-cyan",
      offerLetterLink: "https://www.rit.edu/"
    },
    {
      title: "Software Engineer Intern",
      company: "Axisray Pvt Ltd",
      location: "Ahmedabad, India",
      period: "Jan 2023 – May 2023", 
      description: "Refined Java-based architectures, enhancing software reliability and accelerating delivery timelines by 20%.",
      achievements: [
        "Refined Java-based architectures, enhancing software reliability and accelerating delivery timelines by 20%.",
        "Developed machine learning models using Python's Random Forest, increasing the accuracy of the Indian College Recommendation System by 30%.",
        "Streamlined data workflows by integrating Java SpringBoot and Python Flask, boosting system efficiency by 25%.",
        "Upgraded legacy JSP applications with SpringBoot for advanced data visualization, improving team collaboration.",
        "Orchestrated cross-departmental efforts, stabilizing delivery schedules and enhancing project timelines by 20%."
      ],
      color: "accent-bright",
      offerLetterLink: "https://drive.google.com/file/d/1y6q0oPhLX4bjA9EYl9T6jEtiki8fRQOw/view?usp=sharing"
    },
    {
      title: "Data Science and AI/ML Engineering Intern",
      company: "Moon Technolabs Pvt Ltd",
      location: "Ahmedabad, India", 
      period: "May 2022 – Oct 2022",
      description: "Spearheaded a SaaS supply chain resiliency project, increasing operational efficiency by 30%.",
      achievements: [
        "Spearheaded a SaaS supply chain resiliency project, increasing operational efficiency by 30%.",
        "Adopted diverse roles to enhance project versatility, improving processes across HRMS and CRM systems by 25%.",
        "Led the development of data pipelines and AI-driven solutions, ensuring scalable and adaptive operations.",
        "Worked on multiple AI/ML models to optimize resource allocation, reducing costs by 15%."
      ],
      color: "tech-pink",
      offerLetterLink: "https://drive.google.com/file/d/1M_VIli5rw8OYskoQgfm7xkrik3fm2nOT/view?usp=sharing"
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
                  setVisibleExperiences(prev => new Set([...prev, index]));
                }, index * 200);
              }
            });
          },
          { threshold: 0.1, rootMargin: "50px" }
        );
        observer.observe(ref);
        observers.set(index, observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-muted/20 via-background to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-bright to-tech-cyan bg-clip-text text-transparent">
            {t('experience.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('experience.subtitle')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-tech-cyan/50 to-primary/50"></div>
          
          {experiences.map((exp, index) => {
            const isVisible = visibleExperiences.has(index);
            return (
              <div 
                key={exp.title}
                ref={el => experienceRefs.current[index] = el}
                className={`mb-12 last:mb-0 ultra-smooth ${
                  isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'
                }`}
                style={{ transitionDelay: isVisible ? `${index * 200}ms` : '0ms' }}
              >
                <div className="flex items-start gap-6">
                  {/* Timeline Node */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-tech-cyan/20 border-2 border-primary/30 flex items-center justify-center group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:scale-105 group relative cursor-pointer"
                    onClick={() => window.open(exp.offerLetterLink, '_blank')}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{exp.title}</h3>
                          <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-tech-cyan font-medium text-lg">{exp.company}</p>
                          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{exp.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span className="font-semibold text-primary">{exp.period}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        {t('experience.achievements')}
                      </h4>
                      <ul className="space-y-3">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li 
                            key={achIndex}
                            className={`flex items-start gap-3 text-muted-foreground text-sm transition-all duration-300 ${
                              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                            }`}
                            style={{ 
                              transitionDelay: isVisible ? `${achIndex * 100}ms` : '0ms'
                            }}
                          >
                            <div className="w-2 h-2 rounded-full bg-tech-cyan mt-2 flex-shrink-0"></div>
                            <span className="leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hover gradient overlay */}
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
