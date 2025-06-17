
import React, { useEffect, useRef, useState } from 'react';

const InteractiveSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Intersection Observer for entrance animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);

    // Only add mousemove listener on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        section.style.backgroundPosition = `${x}% ${y}%`;
      };

      section.addEventListener('mousemove', handleMouseMove);

      return () => {
        section.removeEventListener('mousemove', handleMouseMove);
        observer.disconnect();
      };
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="interactive-section" 
      className="min-h-screen bg-fixed bg-center bg-cover relative overflow-hidden transition-all duration-1000 ease-out" 
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: '120%'
      }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/50 to-black/80 transition-all duration-700 ease-out"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-center p-8 max-w-4xl mx-auto transform transition-all duration-1000 ease-out ${
          isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-12 opacity-0 scale-95'
        }`}>
          
          {/* Main headline with staggered animation */}
          <h2 className={`text-6xl md:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-1000 ease-out delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Transform Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
              HVAC Experience
            </span>
          </h2>

          {/* Subtitle with delayed animation */}
          <p className={`text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ease-out delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            Interactive control and insights for modern HVAC solutions that adapt to your needs.
          </p>

          {/* Feature cards */}
          <div className={`grid md:grid-cols-3 gap-6 mb-10 transition-all duration-1000 ease-out delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            {[
              { title: 'Smart Control', desc: 'AI-powered automation', icon: '🎯' },
              { title: 'Real-time Data', desc: 'Live performance metrics', icon: '📊' },
              { title: 'Energy Efficient', desc: 'Optimize your savings', icon: '⚡' }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 hover:scale-105 transition-all duration-500 ease-out group ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${800 + index * 150}ms` }}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Button with enhanced styling */}
          <div className={`transition-all duration-1000 ease-out delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <a 
              href="#services" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 ease-out group"
            >
              Explore Services
              <svg 
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
    </section>
  );
};

export default InteractiveSection;
