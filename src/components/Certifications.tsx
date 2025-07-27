import { Award, Calendar, ExternalLink, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Certifications = () => {
  const [visibleCertifications, setVisibleCertifications] = useState(new Set());
  const certificationRefs = useRef([]);

  const certifications = [
    {
      title: "Java Programming",
      provider: "Udemy",
      date: "2023",
      status: "Completed",
      color: "tech-cyan",
      link: "https://www.udemy.com/certificate/example-java"
    },
    {
      title: "Web Development",
      provider: "Udemy", 
      date: "2023",
      status: "Completed",
      color: "accent-bright",
      link: "https://www.udemy.com/certificate/example-web"
    },
    {
      title: "Machine Learning",
      provider: "Udemy",
      date: "2023",
      status: "Completed",
      color: "tech-pink",
      link: "https://www.udemy.com/certificate/example-ml"
    },
    {
      title: "Python for Data Science",
      provider: "Udemy",
      date: "2023",
      status: "Completed",
      color: "tech-cyan",
      link: "https://www.udemy.com/certificate/example-python"
    },
    {
      title: "C++ Programming",
      provider: "Udemy",
      date: "2022",
      status: "Completed",
      color: "accent-bright",
      link: "https://www.udemy.com/certificate/example-cpp"
    },
    {
      title: "C Programming",
      provider: "CDAC",
      date: "2022",
      status: "Completed",
      color: "tech-pink",
      link: "https://cdac.in/certificate/example-c"
    },
    {
      title: "Data Analytics",
      provider: "Various Platforms",
      date: "2024",
      status: "In Progress",
      color: "tech-cyan",
      link: "https://example.com/certificate/data-analytics"
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