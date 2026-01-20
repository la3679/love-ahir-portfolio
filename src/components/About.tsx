import { User, GraduationCap, MapPin, Calendar, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  const educationData = [
    {
      institution: "Rochester Institute of Technology",
      degree: "Master of Science in Computer Software Engineering",
      gpa: "3.94/4.0",
      period: "Aug 2023 - Dec 2025",
      location: "Rochester, NY",
      coursework: [
        "Software Construction (SWEN 601)","Foundations of Software Engineering (SWEN 610)","Model-Driven Development (SWEN 746)","Engineering Cloud Software Systems (SWEN 614)","Research Methods (SWEN 640)","Collaborative Software Development (SWEN 732)","Database Design & Implementation (ISTE 608)","Software Architecture (SWEN 755)","Software Quality Assurance (SWEN 777)","Foundations of Data Science & Analytics (DSCI 633)","Non-Relational Data Management (ISTE 610)","Capstone Research Project (SWEN 780)"
      ],
      documentLink:
        "https://drive.google.com/file/d/1CLQWs_LEnGDcOs5_CRYSTpJ3bPdpjjl4/view?usp=sharing"
    },
    {
      institution: "LJ Institute of Engineering and Technology",
      degree: "Bachelor of Engineering in Electronics and Communication",
      gpa: "3.81/4.0",
      period: "Aug 2019 - May 2023",
      location: "Ahmedabad, India",
      coursework: [
        "Data Structures","Python Programming","Microprocessor Systems","Embedded Systems","VLSI Design","Digital Electronics","Analog Communication","Digital Communication","Signals & Systems","Control Systems","Computer Networks","Operating Systems","Object-Oriented Programming","Database Management Systems","Engineering Mathematics","Probability & Statistics","Project Work / Final Year Project"
      ],
      documentLink:
        "https://drive.google.com/file/d/1xjhIE7WPiRIKxO9jHZe8ZK7wySq7NRr1/view?usp=sharing"
    }
  ];


  useEffect(() => {
    const observers = new Map();
    
    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  setVisibleSections(prev => new Set([...prev, index]));
                }, index * 300);
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
    <section id="about" className="py-20 bg-gradient-to-br from-background to-muted/20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-tech-cyan bg-clip-text text-transparent">
              {t('about.title')}
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* About Content */}
        <div 
          ref={el => sectionRefs.current[0] = el}
          className={`grid lg:grid-cols-2 gap-12 items-center mb-20 transition-all duration-700 ${
            visibleSections.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <User className="h-6 w-6 text-primary" />
                {t('about.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                I am a passionate and driven Software Engineer and a recent graduate of the Rochester Institute of Technology, 
                with a strong foundation in full-stack development, data science, and machine learning. Over the past few years, 
                I have built a diverse skill set through academic coursework, industry internships, and hands-on projects.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                My experience ranges from developing scalable web and mobile applications to conducting research in privacy 
                leak detection using Monkey testing and behavioral analysis. I thrive in collaborative environments where 
                I can contribute to innovative solutions that have real-world impact.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With a solid academic foundation and practical experience in both research and development, I am actively 
                seeking opportunities where I can grow as a software engineer while contributing to cutting-edge projects 
                in full-stack development, AI/ML, or cloud computing.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-tech-cyan/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-tech-cyan rounded-full flex items-center justify-center">
                  <GraduationCap className="h-12 w-12 text-background" />
                </div>
                <h4 className="text-xl font-bold text-foreground">{t('about.currentFocus')}</h4>
                <p className="text-muted-foreground">{t('about.focusDescription')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Education Timeline */}
        <div 
          ref={el => sectionRefs.current[1] = el}
          className={`transition-all duration-700 ${
            visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              {t('about.education')}
            </h3>
            <p className="text-xl text-muted-foreground">{t('about.educationSubtitle')}</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-tech-cyan/50 to-primary/50"></div>
            
            {educationData.map((edu, index) => {
              const isVisible = visibleSections.has(1);
              return (
                <div 
                  key={edu.degree}
                  className={`mb-12 last:mb-0 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}
                  style={{ transitionDelay: isVisible ? `${index * 200}ms` : '0ms' }}
                >
                  <div className="flex items-start gap-6">
                    {/* Timeline Node */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-tech-cyan/20 border-2 border-primary/30 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-all duration-300">
                        <GraduationCap className="h-8 w-8 text-primary" />
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:scale-105 group relative cursor-pointer"
                      onClick={() => window.open(edu.documentLink, '_blank')}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{edu.degree}</h4>
                          <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2 lg:mt-0">
                          <Calendar className="h-4 w-4" />
                          <span>{edu.period}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-tech-cyan font-medium text-lg">{edu.institution}</p>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{edu.location}</span>
                          </div>
                          <span className="font-semibold text-primary">{t('about.gpa')} {edu.gpa}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-semibold text-foreground">{t('about.relevantCoursework')}</h5>
                        <div className="flex flex-wrap gap-2">
                          {edu.coursework.map((course, courseIndex) => (
                            <span 
                              key={courseIndex}
                              className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm border border-primary/20 hover:bg-primary/20 transition-all duration-300 hover:scale-105"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
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
      </div>
    </section>
  );
};

export default About;
