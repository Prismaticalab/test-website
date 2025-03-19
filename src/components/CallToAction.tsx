import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Circle, Square, Hexagon } from "lucide-react";

// =============================================
// UTILITY FUNCTIONS
// =============================================
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

// =============================================
// HOOKS
// =============================================
const useScrollFriction = (options = { friction: 0.1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const container = containerRef.current;
    if (!container) return;
    
    let animationFrameId: number;
    let lastScrollTop = window.scrollY;
    let velocity = 0;
    
    const smoothScroll = () => {
      const currentScrollTop = window.scrollY;
      const delta = currentScrollTop - lastScrollTop;
      velocity = velocity * 0.9 + delta * 0.1;
      
      const friction = options.friction;
      
      if (Math.abs(velocity) > 0.1) {
        container.style.transform = `translateY(${-velocity * friction}px)`;
        animationFrameId = requestAnimationFrame(smoothScroll);
      } else {
        container.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = currentScrollTop;
    };
    
    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(smoothScroll);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [options.friction]);
  
  return containerRef;
};

// =============================================
// SCROLL OVERLAY COMPONENT
// =============================================
const ScrollOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

// =============================================
// HEADER COMPONENT
// =============================================
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out",
        scrolled 
          ? "py-4 bg-white/80 backdrop-blur-md border-b border-zinc-200/60 shadow-sm" 
          : "py-6 bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <a href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-black"></div>
          <span className={cn(
            "font-medium text-lg transition-colors duration-300",
            scrolled ? "text-zinc-800" : "text-zinc-900"
          )}>Prismatica Lab Limited</span>
        </a>
        
        <div className="flex items-center space-x-4">
          <a 
            href="#contact" 
            className={cn(
              "transition-all duration-300",
              scrolled 
                ? "button-primary text-sm py-2 px-4" 
                : "button-secondary text-sm py-2 px-4"
            )}
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
};

// =============================================
// HERO COMPONENT
// =============================================
const Hero = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold:.1,
      rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100");
          entry.target.classList.remove("opacity-0", "translate-y-8");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (headingRef.current) observer.observe(headingRef.current);
    if (subheadingRef.current) observer.observe(subheadingRef.current);
    if (imageRef.current) observer.observe(imageRef.current);

    return () => {
      if (headingRef.current) observer.unobserve(headingRef.current);
      if (subheadingRef.current) observer.unobserve(subheadingRef.current);
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-white -z-10"></div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 
            ref={headingRef}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight opacity-0 translate-y-8 transition-all duration-1000 ease-out"
          >
            <span className="hero-text-gradient">Grow With</span> <br />
            <span className="relative">
              Intention.
              <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-fluo-green"></span>
            </span>
          </h1>
          
          <p 
            ref={subheadingRef}
            className="text-lg md:text-xl text-zinc-600 max-w-lg opacity-0 translate-y-8 transition-all duration-1000 delay-300 ease-out"
          >
            Explore, synthesise, ignite. We help brands and businesses unlock their potential through innovation and strategic thinking.
          </p>
        </div>
        
        <div 
          ref={imageRef}
          className="relative h-[400px] md:h-[500px] opacity-0 translate-y-8 transition-all duration-1000 delay-700 ease-out"
        >
          <div className="absolute top-0 right-0 w-[80%] h-[80%] glass-panel animate-float group">
            <div className="w-full h-full bg-zinc-100 rounded-3xl overflow-hidden border-2 border-transparent transition-all duration-300 group-hover:border-fluo-green/50">
              <img 
                src="https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&sat=-100" 
                alt="Abstract architecture in grayscale" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-[60%] h-[60%] glass-panel animate-float animation-delay-2000 group">
            <div className="w-full h-full bg-zinc-100 rounded-3xl overflow-hidden border-2 border-transparent transition-all duration-300 group-hover:border-fluo-green/50">
              <img 
                src="https://images.unsplash.com/photo-1527576539890-dfa815648363?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&sat=-100" 
                alt="Abstract architecture in grayscale" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// =============================================
// APPROACH COMPONENT
// =============================================
const Approach = () => {
  const methodologySteps = [
    {
      icon: Circle,
      title: "EXPLORE",
      description: "We delve beyond the surface, illuminating hidden truths and uncovering the rich landscape of possibilities that exist within your unique context. Through deep discovery, we map the terrain of your audience's desires, market dynamics, and untapped opportunities with extraordinary precision."
    },
    {
      icon: Square,
      title: "SYNTHESIZE",
      description: "Where insights meet intention, true strategy emerges. We distill complex findings into crystalline clarity—transforming disparate elements into a cohesive vision perfectly aligned with your aspirations. This alchemical process converts raw potential into defined pathways forward."
    },
    {
      icon: Hexagon,
      title: "IGNITE",
      description: "Vision without execution remains merely a dream. We catalyze your journey from concept to reality, activating strategic initiatives that drive measurable impact. This final phase transforms potential energy into kinetic force—propelling your growth with purpose and precision."
    }
  ];

  return (
    <section id="approach" className="section py-24 bg-zinc-50 overflow-hidden relative">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] -z-10"></div>
      
      {/* Subtle accent lighting */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-zinc-200/40 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tl from-zinc-200/40 to-transparent rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block px-3 py-1 bg-zinc-100 rounded-full text-sm font-medium text-zinc-800">
            Our Approach
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Illuminating Paths To Extraordinary Growth</h2>
          
          <p className="text-zinc-600 md:text-lg">
            At Prismatica Labs, we believe that transformative growth emerges from clarity, purpose, and precision. 
            Our proprietary methodology doesn't just drive change—it orchestrates evolution through a carefully crafted journey:
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {methodologySteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index} 
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 h-full border border-zinc-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-fluo-green/30">
                  <div className="flex flex-col h-full">
                    <div>
                      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-zinc-100 mb-4 transition-colors duration-300 group-hover:bg-black group-hover:text-fluo-green">
                        <Icon strokeWidth={1.5} size={24} className="transition-colors duration-300" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 flex items-center group-hover:text-fluo-green transition-colors">
                        <span className="text-zinc-400 mr-2 group-hover:text-fluo-green/70">✧</span> {step.title}
                      </h3>
                      <p className="text-zinc-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Mobile accordion version */}
        <div className="lg:hidden mt-12">
          <div className="w-full">
            {methodologySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="border-t border-zinc-200 last:border-b py-4">
                  <button 
                    className="w-full flex items-center justify-between py-2 text-left transition-colors hover:text-fluo-green"
                    onClick={() => {
                      // Simple accordion toggle functionality
                      const content = document.getElementById(`accordion-content-${index}`);
                      if (content) {
                        content.classList.toggle('hidden');
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-100 mr-4 group-hover:text-fluo-green">
                        <Icon strokeWidth={1.5} size={20} />
                      </div>
                      <span className="text-lg font-medium">
                        <span className="text-zinc-400 mr-1 group-hover:text-fluo-green/70">✧</span> {step.title}
                      </span>
                    </div>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div id={`accordion-content-${index}`} className="hidden px-4 pt-2 pb-4">
                    <p className="text-zinc-600">{step.description}</p>
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

// =============================================
// FEATURES COMPONENT
// =============================================
const features = [
  {
    title: "Frameworks",
    description: "Our frameworks are meticulously crafted to provide structure while allowing for adaptation and evolution.",
    imagePath: "https://images.unsplash.com/photo-1502657877623-f66bf489d236?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&auto=format&fit=crop&w=800&q=80&sat=-100"
  },
  {
    title: "Consulting",
    description: "Our consultants bring decades of expertise across industries to solve your most complex business challenges.",
    imagePath: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sat=-100"
  },
  {
    title: "Creative Formats",
    description: "Transform ideas into tangible assets through our creative development process and strategic implementation.",
    imagePath: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sat=-100"
  },
  {
    title: "Strategic Innovation",
    description: "We identify emerging opportunities and create pathways to capitalize on them before your competitors.",
    imagePath: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sat=-100"
  },
];

const Features = ({ className }: { className?: string }) => {
  return (
    <section id="features" className={cn("section", className)}>
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="inline-block px-3 py-1 bg-zinc-100 rounded-full text-sm font-medium text-zinc-800">
          What We Do
        </span>
        <h2 className="text-3xl md:text-4xl font-bold">Crafted With Purpose</h2>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="h-full border border-zinc-100 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-fluo-green cursor-pointer group"
          >
            <div className="relative w-full h-40 overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-fluo-green/70 to-fluo-green/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <img 
                src={feature.imagePath} 
                alt={feature.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 grayscale"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold group-hover:text-fluo-green transition-colors">{feature.title}</h3>
              <div className="mt-3">
                <p className="text-sm text-zinc-500">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// =============================================
// CALL TO ACTION COMPONENT
// =============================================
const CallToAction = ({ className }: { className?: string }) => {
  return (
    <section id="contact" className={cn("section relative overflow-hidden bg-black", className)}>
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black to-zinc-900"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-zinc-800 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      <div className="bg-zinc-900 rounded-2xl p-8 md:p-12 max-w-5xl mx-auto border border-zinc-800 shadow-lg">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-zinc-800 rounded-full text-sm font-medium text-white mb-4">
            Let's Connect
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Step One: Explore</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Share your email address with us and we'll be in touch as soon as we can.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <form className="space-y-4">
            <div>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-fluo-green/30 transition-all placeholder:text-zinc-500"
              />
            </div>
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-fluo-green text-black font-medium transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-fluo-green/30"
            >
              Let's Connect <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
      
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-zinc-800 rounded-full opacity-20 z-0"></div>
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-zinc-700 rounded-full opacity-20 z-0"></div>
    </section>
  );
};

// =============================================
// FOOTER COMPONENT
// =============================================
const Footer = ({ className }: { className?: string }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("border-t border-zinc-100 py-12 md:py-16", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-black"></div>
              <span className="font-medium text-lg">Prismatica Lab Limited</span>
            </div>
            <p className="text-zinc-600 max-w-xs">
              We create experiences that elevate.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-zinc-600 hover:text-black transition-colors hover:text-fluo-green">About Us</a></li>
              <li><a href="#" className="text-zinc-600 hover:text-black transition-colors hover:text-fluo-green">Careers</a></li>
              <li><a href="#" className="text-zinc-600 hover:text-black transition-colors hover:text-fluo-green">Press</a></li>
              <li><a href="#" className="text-zinc-600 hover:text-black transition-colors hover:text-fluo-green">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-zinc-600 hover:text-black transition-colors hover:text-fluo-green">Help Center</a></li>
              <li><a href="#contact" className="text-zinc-600 hover:text-black transition-colors hover:text-fluo-green">Contact Us</a></li>
              <li><a href="#" className="text-zinc-600 hover:text-black transition-colors hover:text-fluo-green">Privacy Policy</a></li>
              <li><a href="#" className="text-zinc-600 hover:text-black transition-colors hover:text-fluo-green">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-sm mb-4 md:mb-0">
            © {currentYear} Prismatica Lab Limited. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center border border-zinc-200 text-zinc-600 hover:border-fluo-green/30 hover:text-fluo-green hover:shadow-sm transition-all duration-300">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center border border-zinc-200 text-zinc-600 hover:border-fluo-green/30 hover:text-fluo-green hover:shadow-sm transition-all duration-300">
              <span className="sr-only">Instagram</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center border border-zinc-200 text-zinc-600 hover:border-fluo-green/30 hover:text-fluo-green hover:shadow-sm transition-all duration-300">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// =============================================
// MAIN INDEX COMPONENT
// =============================================
const StandaloneIndex = () => {
  // Using the scroll friction hook
  const scrollContainerRef = useScrollFriction();

  useEffect(() => {
    // Simple smooth scroll for anchor links without complex effects
    const handleAnchorClick = function(e: Event) {
      e.preventDefault();
      
      const anchor = e.currentTarget as HTMLAnchorElement;
      const targetId = anchor.getAttribute('href');
      if (!targetId) return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 80;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    };
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Place ScrollOverlay at the top level */}
      <ScrollOverlay />
      <div ref={scrollContainerRef} className="scroll-container relative">
        <Header />
        <Hero />
        <Approach />
        <Features className="bg-zinc-50" />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
};

export default StandaloneIndex;
