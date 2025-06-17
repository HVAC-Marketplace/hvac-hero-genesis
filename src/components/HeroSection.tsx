
import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Extend Window interface to include THREE
declare global {
  interface Window {
    THREE: any;
  }
}

const HeroSection = () => {
  useEffect(() => {
    // Only initialize globe on desktop and when user doesn't prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 640;
    
    console.log('Globe init check:', { prefersReducedMotion, isMobile, width: window.innerWidth });
    
    if (prefersReducedMotion || isMobile) return;

    // Lazy load Three.js and initialize globe
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/three@0.152.0/build/three.min.js';
    script.onload = () => {
      const canvas = document.getElementById('globeCanvas');
      console.log('Canvas found:', canvas);
      console.log('THREE loaded:', !!window.THREE);
      console.log('Canvas dimensions:', canvas?.offsetWidth, 'x', canvas?.offsetHeight);
      
      if (!canvas || !window.THREE) return;

      try {
        const renderer = new window.THREE.WebGLRenderer({ 
          canvas, 
          alpha: true,
          antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background
        
        const scene = new window.THREE.Scene();
        const camera = new window.THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Create a more visible globe with solid material
        const globe = new window.THREE.Mesh(
          new window.THREE.SphereGeometry(1.2, 32, 32), // Slightly larger
          new window.THREE.MeshBasicMaterial({ 
            color: 0x60a5fa, // Brighter blue
            wireframe: true,
            wireframeLinewidth: 3
          })
        );
        scene.add(globe);
        
        // Position camera closer
        camera.position.set(0, 0, 3);
        camera.lookAt(0, 0, 0);
        
        console.log('Globe created and added to scene');
        console.log('Camera position:', camera.position);
        console.log('Globe position:', globe.position);
        
        let animationId: number;
        
        function animate() {
          // Simple continuous rotation
          globe.rotation.y += 0.01;
          globe.rotation.x += 0.005;
          
          renderer.render(scene, camera);
          animationId = requestAnimationFrame(animate);
        }
        
        animate();
        console.log('Animation loop started');
        
        const handleResize = () => {
          renderer.setSize(window.innerWidth, window.innerHeight);
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
        };
        
        window.addEventListener('resize', handleResize);
        
        // Cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
          renderer.dispose();
        };
      } catch (error) {
        console.error('Failed to initialize Three.js globe:', error);
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load Three.js library');
    };
    
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="relative min-h-screen bg-slate-900 overflow-hidden font-inter section-wave">
      {/* Simple Globe Canvas - positioned behind content */}
      <canvas 
        id="globeCanvas" 
        className="absolute inset-0 w-full h-full hidden sm:block"
        style={{ 
          zIndex: 1,
          opacity: 0.3,
          pointerEvents: 'none'
        }}
      />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{ zIndex: 2 }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-slate-900/80 to-slate-900" style={{ zIndex: 3 }} />

      <div className="relative container mx-auto px-4 py-16 lg:py-24" style={{ zIndex: 10 }}>
        {/* Main Hero Content */}
        <div className="max-w-6xl mx-auto text-center animate-fade-in">
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
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
            Connect with certified contractors and source quality equipment for commercial, residential, and industrial HVAC projects. Trusted by professionals nationwide.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up">
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

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 animate-slide-up">
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
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 text-sm font-medium animate-slide-up">
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
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" style={{ zIndex: 5 }}></div>
    </section>
  );
};

export default HeroSection;
