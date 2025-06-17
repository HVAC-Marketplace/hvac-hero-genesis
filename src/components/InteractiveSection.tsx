
import React, { useEffect, useRef } from 'react';

const InteractiveSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Only add mousemove listener on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      section.style.backgroundPosition = `${x}% ${y}%`;
    };

    section.addEventListener('mousemove', handleMouseMove);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="interactive-section" 
      className="min-h-screen bg-fixed bg-center bg-cover relative" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-5xl font-bold text-white mb-4">Transform Your HVAC Experience</h2>
          <p className="text-xl text-gray-200 mb-6">Interactive control and insights for modern HVAC solutions.</p>
          <a 
            href="#services" 
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300"
          >
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
};

export default InteractiveSection;
