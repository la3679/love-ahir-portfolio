import { Award, Calendar, ExternalLink, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Certifications = () => {
  const [visibleCertifications, setVisibleCertifications] = useState(new Set());
  const certificationRefs = useRef([]);

  const certifications = [
    {
      title: "Microsoft Azure Fundamentals (AZ-900) Cert Prep",
      provider: "Microsoft & LinkedIn Learning",
      date: "Jun 2025",
      status: "Completed",
      color: "tech-cyan",
      link: "https://www.linkedin.com/learning/certificates/53b8f4559dd722ff7fb5e3a6438894f33da0e7cb07636ca3936ff99f150ab5bc"
    },
    {
      title: "Learning Data Analytics: 1 Foundations",
      provider: "LinkedIn Learning",
      date: "Jun 2025",
      status: "Completed",
      color: "accent-bright",
      link: "https://www.linkedin.com/learning/certificates/b3e66a7d7344afa613aea09e7dba21533b25eb62d2d6506917ca3e6f1f6ca3f3"
    },
    {
      title: "Career Essentials in Data Analysis",
      provider: "Microsoft and LinkedIn",
      date: "Jun 2025",
      status: "Completed",
      color: "tech-pink",
      link: "https://www.linkedin.com/learning/certificates/b7e85032290a4f063ef4905f75d28d23df2ef7d98a738df62e79268b6ce3eb14"
    },
    {
      title: "Python Essential Training",
      provider: "LinkedIn Learning",
      date: "May 2025",
      status: "Completed",
      color: "tech-cyan",
      link: "https://www.linkedin.com/learning/certificates/4c32a950aef5b51ab3e526d3daa47af2bdb69bc99c58400c61d4fb4243674cce"
    },
    {
      title: "Introduction to Career Skills in Data Analytics",
      provider: "LinkedIn Learning",
      date: "Jun 2025",
      status: "Completed",
      color: "accent-bright",
      link: "https://www.linkedin.com/learning/certificates/a6b15365103a23ac6ac545c9d987b73904128f9d31e1f3cffc0e0a327a37f24a?trk=share_certificate"
    },
    {
      title: "Learning Data Analytics Part 2: Extending and Applying Core Knowledge",
      provider: "LinkedIn Learning",
      date: "June 1, 2025",
      status: "Completed",
      color: "tech-pink", // Choosing a color, assuming it fits with the existing theme
      link: "https://www.linkedin.com/learning/certificates/83056fccabeba7e7f5127c74177147622ced93f8e9d1cdc5f202a62bb7b046f1?trk=share_certificate" // Link was not provided, leaving it empty for now
    },
    {
      title: "C Programming",
      provider: "CDAC",
      date: "2022",
      status: "Completed",
      color: "tech-pink",
      link: "https://drive.google.com/file/d/1WQ3hoFj-Nefw_vXWt_k6-8nWN8Q42ZxN/view?usp=sharing"
    }
  ];

  useEffect(() => {
    const observers = new Map();
    
    certificationRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  setVisibleCertifications(prev => new Set([...prev, index]));
                }, index * 150);
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
    <section id="certifications" className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-bright to-tech-cyan bg-clip-text text-transparent">
            Certifications
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Continuous learning and professional development in cutting-edge technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => {
            const StatusIcon = cert.status === "Completed" ? CheckCircle : Clock;
            const isVisible = visibleCertifications.has(index);
            
            return (
              <div 
                key={cert.title}
                ref={el => certificationRefs.current[index] = el}
                className={`bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-700 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:scale-105 group relative cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                }`}
                onClick={() => window.open(cert.link, '_blank')}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl transition-all duration-500 group-hover:scale-110 ${
                    cert.status === "Completed" ? 'bg-tech-cyan/20 group-hover:bg-tech-cyan/30' : 'bg-accent-bright/20 group-hover:bg-accent-bright/30'
                  }`}>
                    <Award className={`h-6 w-6 transition-transform duration-500 group-hover:scale-110 ${
                      cert.status === "Completed" ? 'text-tech-cyan' : 'text-accent-bright'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{cert.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusIcon className={`h-4 w-4 ${cert.status === "Completed" ? 'text-tech-cyan' : 'text-accent-bright'}`} />
                      <span className={`text-sm font-medium ${cert.status === "Completed" ? 'text-tech-cyan' : 'text-accent-bright'}`}>
                        {cert.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    <span>{cert.provider}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{cert.date}</span>
                  </div>
                </div>

                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                  cert.status === "Completed" 
                    ? 'bg-gradient-to-br from-tech-cyan/5 to-transparent' 
                    : 'bg-gradient-to-br from-accent-bright/5 to-transparent'
                }`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Certifications;