import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const globeRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only initialize globe on desktop and when user doesn't prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 640;
    
    if (prefersReducedMotion || isMobile) return;

    let phi = 0;
    let scale = 1.5; // Zoom level to show full North American continent
    let isRotating = false;

    // Load COBE library and initialize globe
    const initializeGlobe = async () => {
      try {
        // Use dynamic import to avoid TypeScript module resolution issues
        const cobeModule = await eval('import("https://cdn.skypack.dev/cobe")');
        const createGlobe = cobeModule.default;
        const canvas = canvasRef.current;
        
        if (!canvas || !createGlobe) {
          console.log('Missing canvas or COBE library');
          return;
        }

        console.log('Initializing COBE globe...');

        // Create globe with dark theme - no custom markers, just the natural pixel grid
        globeRef.current = createGlobe(canvas, {
          devicePixelRatio: 2,
          width: 1200,
          height: 1200,
          phi: 0,
          theta: 0.5, // Angle to show North America prominently
          dark: 1,
          diffuse: 1.2,
          scale: scale,
          mapSamples: 16000,
          mapBrightness: 6,
          baseColor: [0.05, 0.05, 0.1], // Very dark blue/black
          markerColor: [1, 1, 1], // Bright white for natural grid
          glowColor: [0.1, 0.2, 0.4], // Subtle blue glow
          offset: [0, 0],
          markers: [], // No custom markers - just the natural pixel grid
          onRender: (state: any) => {
            state.phi = phi;
            state.scale = scale;
            if (isRotating) {
              phi += 0.005; // Slow rotation when scrolling
            }
          },
        });

        console.log('COBE globe initialized successfully');

      } catch (error) {
        console.error('Failed to initialize COBE globe:', error);
      }
    };

    // Scroll handler for zoom out and rotation
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Start effects after scrolling 10% of viewport
      const scrollThreshold = windowHeight * 0.1;
      
      if (scrollY > scrollThreshold) {
        // Gradually zoom out and start rotating
        const scrollProgress = Math.min((scrollY - scrollThreshold) / windowHeight, 1);
        scale = 1.5 - (scrollProgress * 0.5); // Zoom out from 1.5 to 1.0
        isRotating = scrollProgress > 0.3; // Start rotating after 30% scroll progress
      } else {
        // Reset to initial state
        scale = 1.5;
        isRotating = false;
        phi = 0; // Reset rotation
      }
    };

    initializeGlobe();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup function
    return () => {
      if (globeRef.current) {
        globeRef.current.destroy?.();
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="relative min-h-screen bg-slate-900 overflow-hidden font-inter">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{ zIndex: 2 }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 via-slate-900/50 to-slate-900/70" style={{ zIndex: 3 }} />

      {/* Globe - full width background without container */}
      <div className="absolute inset-0 flex items-center justify-center hidden lg:flex" style={{ zIndex: 1 }}>
        {/* COBE Globe Canvas - no container boundaries */}
        <canvas
          ref={canvasRef}
          style={{ width: '100vw', height: '100vh' }}
          width="1200"
          height="1200"
          className="opacity-80"
        />
      </div>

      <div className="relative container mx-auto px-4 py-16 lg:py-24" style={{ zIndex: 20 }}>
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content - now properly overlaying globe */}
          <div className="lg:w-full mb-12 lg:mb-0 animate-fade-in relative z-30">
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-6 text-white">
              <span className="bg-blue-gradient bg-clip-text text-transparent">
                Professional HVAC Solutions
              </span>
              <br />
              <span className="text-white">
                for Commercial & Residential Projects
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mb-12 leading-relaxed font-light">
              Connect with certified contractors and source quality equipment for commercial, residential, and industrial HVAC projects. Trusted by professionals nationwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-16 animate-slide-up">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-600/25"
              >
                Find Contractors
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 bg-transparent"
              >
                Browse Equipment
              </Button>
              
              <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-lg font-medium transition-all duration-300 hover:gap-3 group">
                Join Contractor Network
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-slide-up relative z-30">
          <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
              500<span className="text-blue-400">+</span>
            </div>
            <div className="text-slate-400 font-medium">Verified Contractors</div>
          </div>
          
          <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
              15<span className="text-blue-400">K+</span>
            </div>
            <div className="text-slate-400 font-medium">HVAC Products</div>
          </div>
          
          <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
              24<span className="text-blue-400">/7</span>
            </div>
            <div className="text-slate-400 font-medium">Expert Support</div>
          </div>
          
          <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
              98<span className="text-blue-400">%</span>
            </div>
            <div className="text-slate-400 font-medium">Customer Satisfaction</div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 text-sm font-medium mt-16 animate-slide-up relative z-30">
          <div className="flex items-center gap-2 hover:text-slate-400 transition-colors duration-300">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            EPA Certified
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-600"></div>
          <div className="flex items-center gap-2 hover:text-slate-400 transition-colors duration-300">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            NATE Approved
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-600"></div>
          <div className="flex items-center gap-2 hover:text-slate-400 transition-colors duration-300">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            BBB A+
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-600"></div>
          <div className="flex items-center gap-2 hover:text-slate-400 transition-colors duration-300">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Licensed & Insured
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" style={{ zIndex: 5 }}></div>
    </section>
  );
};

export default HeroSection;
