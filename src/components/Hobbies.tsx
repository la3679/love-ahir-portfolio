import { Heart, Camera, Plane, Book, Music, Gamepad2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Hobbies = () => {
  const [visibleHobbies, setVisibleHobbies] = useState(new Set());
  const hobbyRefs = useRef([]);

  const hobbies = [
    {
      icon: Gamepad2,
      title: "Coding Projects",
      description: "Building innovative solutions and exploring new technologies in my free time",
      color: "text-tech-cyan"
    },
    {
      icon: Music,
      title: "Music",
      description: "Listening to various genres and discovering new artists",
      color: "text-accent-bright"
    },
    {
      icon: Camera,
      title: "Photography",
      description: "Capturing moments and exploring visual storytelling",
      color: "text-tech-pink"
    },
    {
      icon: Gamepad2,
      title: "Gaming",
      description: "Strategy games and exploring virtual worlds",
      color: "text-tech-cyan"
    },
    {
      icon: Book,
      title: "Reading",
      description: "Tech blogs, research papers, and science fiction novels",
      color: "text-accent-bright"
    },
    {
      icon: Plane,
      title: "Travel",
      description: "Exploring new places and experiencing different cultures",
      color: "text-tech-pink"
    }
  ];

  useEffect(() => {
    const observers = new Map();
    
    hobbyRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  setVisibleHobbies(prev => new Set([...prev, index]));
                }, index * 100);
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
    <section id="hobbies" className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-bright to-tech-cyan bg-clip-text text-transparent">
            Hobbies & Interests
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Beyond coding, I enjoy exploring creativity and learning through various activities
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {hobbies.map((hobby, index) => {
            const IconComponent = hobby.icon;
            const isVisible = visibleHobbies.has(index);
            
            return (
              <div 
                key={hobby.title}
                ref={el => hobbyRefs.current[index] = el}
                className={`bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-700 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:scale-110 group cursor-pointer relative ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                }`}
              >
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-2xl mb-4 bg-primary/20 group-hover:bg-primary/30 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
                    <IconComponent className="h-8 w-8 text-primary transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{hobby.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{hobby.description}</p>

                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hobbies;