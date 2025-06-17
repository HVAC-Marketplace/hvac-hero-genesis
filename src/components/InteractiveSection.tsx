
import React, { useEffect, useRef, useState } from 'react';

const InteractiveSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const touchStartY = useRef(0);
  const sectionsData = [
    {
      id: 'transform',
      title: 'Transform Your',
      subtitle: 'HVAC Experience',
      description: 'Interactive control and insights for modern HVAC solutions that adapt to your needs.',
      bgImage: "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
    },
    {
      id: 'features',
      title: 'Smart Features',
      subtitle: 'Built for Professionals',
      description: 'Advanced automation and real-time monitoring for commercial and residential projects.',
      bgImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
    },
    {
      id: 'efficiency',
      title: 'Maximum',
      subtitle: 'Energy Efficiency',
      description: 'Optimize performance while reducing costs with intelligent HVAC management systems.',
      bgImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
    },
    {
      id: 'cta',
      title: 'Ready to',
      subtitle: 'Get Started?',
      description: 'Connect with certified contractors and discover premium HVAC solutions today.',
      bgImage: "url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
    }
  ];

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;

      setIsScrolling(true);
      if (e.deltaY > 0) {
        // Scroll down
        if (currentIndex < sectionsData.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
      } else {
        // Scroll up
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
      }

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1200);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      if (Math.abs(diff) > 50) {
        setIsScrolling(true);
        if (diff > 0) {
          // Swipe up (next section)
          if (currentIndex < sectionsData.length - 1) {
            setCurrentIndex(prev => prev + 1);
          }
        } else {
          // Swipe down (previous section)
          if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
          }
        }

        scrollTimeout = setTimeout(() => {
          setIsScrolling(false);
        }, 1200);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        if (currentIndex < sectionsData.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setIsScrolling(true);
          scrollTimeout = setTimeout(() => setIsScrolling(false), 1200);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
          setIsScrolling(true);
          scrollTimeout = setTimeout(() => setIsScrolling(false), 1200);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [currentIndex, isScrolling, sectionsData.length]);

  console.log('Current section index:', currentIndex);

  return (
    <div className="relative">
      {/* Progress Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 space-y-4">
        {sectionsData.map((_, index) => (
          <button
            key={index}
            onClick={() => !isScrolling && setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${
              currentIndex === index 
                ? 'bg-white scale-125 shadow-lg shadow-white/50' 
                : 'bg-transparent hover:scale-110 hover:shadow-md hover:shadow-white/30'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      {/* Single Section Container */}
      <section className="relative h-screen w-full overflow-hidden">
        {sectionsData.map((section, index) => (
          <div
            key={section.id}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              currentIndex === index 
                ? 'opacity-100 scale-100 z-10' 
                : 'opacity-0 scale-95 z-0'
            }`}
            style={{ 
              backgroundImage: section.bgImage,
              backgroundSize: '120%',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            {/* Background overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/50 to-black/80"></div>
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse delay-500"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center p-8 max-w-4xl mx-auto">
                
                {/* Main headline */}
                <h2 className={`text-6xl md:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-1200 ease-out ${
                  currentIndex === index 
                    ? 'translate-x-0 opacity-100' 
                    : '-translate-x-32 opacity-0'
                }`}>
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    {section.title}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
                    {section.subtitle}
                  </span>
                </h2>

                {/* Subtitle */}
                <p className={`text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-1200 ease-out delay-300 ${
                  currentIndex === index 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-32 opacity-0'
                }`}>
                  {section.description}
                </p>

                {/* Feature cards for section 1 */}
                {index === 0 && (
                  <div className={`grid md:grid-cols-3 gap-6 mb-10 transition-all duration-1200 ease-out delay-600 ${
                    currentIndex === index 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-32 opacity-0'
                  }`}>
                    {[
                      { title: 'Smart Control', desc: 'AI-powered automation', icon: '🎯' },
                      { title: 'Real-time Data', desc: 'Live performance metrics', icon: '📊' },
                      { title: 'Energy Efficient', desc: 'Optimize your savings', icon: '⚡' }
                    ].map((feature, featureIndex) => (
                      <div 
                        key={feature.title}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 hover:scale-105 transition-all duration-700 ease-out group"
                        style={{ transitionDelay: `${800 + featureIndex * 200}ms` }}
                      >
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-gray-300 text-sm">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <div className={`transition-all duration-1200 ease-out delay-900 ${
                  currentIndex === index 
                    ? 'translate-y-0 opacity-100' 
                    : '-translate-y-32 opacity-0'
                }`}>
                  <a 
                    href="#services" 
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 ease-out group"
                  >
                    {index === sectionsData.length - 1 ? 'Get Started Now' : 'Learn More'}
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
          </div>
        ))}
      </section>

      {/* Scroll hint */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 text-white/60 text-sm animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <span>Scroll to explore</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default InteractiveSection;
