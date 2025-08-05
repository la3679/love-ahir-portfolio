import { useState, useEffect, useRef } from "react";
import { Code2, Cloud, Database, Smartphone, Shield, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";

const Expertise = () => {
  const { t } = useTranslation();
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  const expertiseAreas = [
    {
      title: "Full Stack Development",
      description: "Expert in building scalable and high-performance web and mobile applications using React, Spring Boot, Flask, and PostgreSQL.",
      icon: Code2,
      color: "tech-cyan",
      skills: ["React", "Spring Boot", "Flask", "PostgreSQL"]
    },
    {
      title: "Cloud Computing & DevOps",
      description: "Specialized in AWS, Azure, Kubernetes, Docker, and CI/CD Pipelines for efficient deployment, scaling, and automation.",
      icon: Cloud,
      color: "accent-bright",
      skills: ["AWS", "Azure", "Kubernetes", "Docker", "CI/CD"]
    },
    {
      title: "Database Engineering",
      description: "Proficient in designing and managing relational and NoSQL databases like MySQL, PostgreSQL, and MongoDB for optimized data handling.",
      icon: Database,
      color: "tech-pink",
      skills: ["MySQL", "PostgreSQL", "MongoDB", "Redis"]
    },
    {
      title: "Mobile App Development",
      description: "Building cross-platform mobile applications with React Native and integrating cloud services for seamless performance.",
      icon: Smartphone,
      color: "tech-cyan",
      skills: ["React Native", "Android", "iOS", "Cross-platform"]
    },
    {
      title: "Software Testing & QA",
      description: "Expertise in unit testing, integration testing, and test automation to ensure software reliability and performance.",
      icon: Shield,
      color: "accent-bright",
      skills: ["Unit Testing", "Integration Testing", "Automation", "QA"]
    },
    {
      title: "System Architecture",
      description: "Designing robust, scalable system architectures with microservices, API design, and distributed systems.",
      icon: Layers,
      color: "tech-pink",
      skills: ["Microservices", "API Design", "System Design", "Architecture"]
    }
  ];

  useEffect(() => {
    const observers = new Map();
    
    cardRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  setVisibleCards(prev => new Set([...prev, index]));
                }, index * 150);
              }
            });
          },
          { threshold: 0.2, rootMargin: "50px" }
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
    <section id="expertise" className="py-20 bg-gradient-to-br from-background via-muted/10 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-tech-cyan/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-bright via-tech-cyan to-tech-pink bg-clip-text text-transparent">
            Technical Expertise
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive technical skills across the full development lifecycle, from conception to deployment and maintenance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {expertiseAreas.map((area, index) => {
            const IconComponent = area.icon;
            const isVisible = visibleCards.has(index);
            
            return (
              <div
                key={area.title}
                ref={el => cardRefs.current[index] = el}
                className={`group ultra-smooth ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
              >
                <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_40px_hsl(var(--primary)/0.15)] hover:scale-105 h-full">
                  {/* Icon with animated background */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-${area.color}/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100`}></div>
                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br from-${area.color}/20 to-${area.color}/10 border border-${area.color}/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <IconComponent className={`h-8 w-8 text-${area.color} transition-all duration-500 group-hover:scale-110`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {area.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {area.description}
                    </p>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {area.skills.map((skill, skillIndex) => (
                        <span
                          key={skill}
                          className={`px-3 py-1 bg-${area.color}/10 text-${area.color} rounded-full text-xs font-medium border border-${area.color}/20 hover:bg-${area.color}/20 hover:scale-105 transition-all duration-300 cursor-default ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                          }`}
                          style={{ 
                            transitionDelay: isVisible ? `${(index * 100) + (skillIndex * 50)}ms` : '0ms'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  
                  {/* Floating particles effect */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-8 right-8 w-1 h-1 bg-tech-cyan/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.7s' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Expertise;