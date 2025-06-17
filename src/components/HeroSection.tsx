
import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  useEffect(() => {
    // Only initialize globe on desktop and when user doesn't prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 640;
    
    if (prefersReducedMotion || isMobile) return;

    let phi = 0;
    let globe: any = null;

    // Load COBE library and initialize globe
    const initializeGlobe = async () => {
      try {
        // Import COBE from CDN
        const createGlobe = await import('https://cdn.skypack.dev/cobe').then(m => m.default);
        const canvas = document.getElementById('globeCanvas') as HTMLCanvasElement;
        
        if (!canvas || !createGlobe) {
          console.log('Missing canvas or COBE library');
          return;
        }

        console.log('Initializing COBE globe...');

        // Create globe with HVAC marketplace styling
        globe = createGlobe(canvas, {
          devicePixelRatio: 2,
          width: 1000,
          height: 1000,
          phi: 0,
          theta: 0,
          dark: 1,
          diffuse: 1.2,
          scale: 1,
          mapSamples: 16000,
          mapBrightness: 6,
          baseColor: [0.1, 0.1, 0.3], // Dark blue base
          markerColor: [0.3, 0.6, 1], // Bright blue markers
          glowColor: [0.2, 0.4, 1], // Blue glow
          offset: [0, 0],
          markers: [
            // North America focus
            { location: [40.7128, -74.006], size: 0.1 }, // New York
            { location: [34.0522, -118.2437], size: 0.08 }, // Los Angeles
            { location: [41.8781, -87.6298], size: 0.07 }, // Chicago
            { location: [39.7392, -104.9903], size: 0.06 }, // Denver
            { location: [25.7617, -80.1918], size: 0.05 }, // Miami
            { location: [47.6062, -122.3321], size: 0.05 }, // Seattle
            { location: [29.7604, -95.3698], size: 0.05 }, // Houston
            { location: [33.4484, -112.0740], size: 0.04 }, // Phoenix
            // International locations
            { location: [51.5074, -0.1278], size: 0.04 }, // London
            { location: [35.6762, 139.6503], size: 0.04 }, // Tokyo
            { location: [-33.8688, 151.2093], size: 0.03 }, // Sydney
            { location: [22.3193, 114.1694], size: 0.03 }, // Hong Kong
          ],
          onRender: (state) => {
            state.phi = phi;
            phi += 0.003; // Slower rotation
          },
        });

        console.log('COBE globe initialized successfully');

      } catch (error) {
        console.error('Failed to initialize COBE globe:', error);
      }
    };

    initializeGlobe();

    // Cleanup function
    return () => {
      if (globe) {
        globe.destroy?.();
      }
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

      <div className="relative container mx-auto px-4 py-16 lg:py-24" style={{ zIndex: 20 }}>
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12 animate-fade-in">
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
          
          {/* Globe Visualization */}
          <div className="lg:w-1/2 relative hidden lg:block">
            <div className="relative h-[500px] w-[500px] mx-auto">
              {/* Glow effect behind globe */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
              {/* COBE Globe Canvas */}
              <canvas
                id="globeCanvas"
                style={{ width: '500px', height: '500px' }}
                width="1000"
                height="1000"
                className="relative z-10"
              />
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-slide-up">
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
        <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 text-sm font-medium mt-16 animate-slide-up">
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
