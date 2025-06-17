
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
      
      if (!canvas || !window.THREE) return;

      try {
        const renderer = new window.THREE.WebGLRenderer({ 
          canvas, 
          alpha: true,
          antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        
        const scene = new window.THREE.Scene();
        const camera = new window.THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Create Earth texture using a simple procedural approach
        const canvas2D = document.createElement('canvas');
        canvas2D.width = 512;
        canvas2D.height = 256;
        const ctx = canvas2D.getContext('2d');
        
        // Create a simple Earth-like texture
        if (ctx) {
          // Ocean background
          ctx.fillStyle = '#1e40af';
          ctx.fillRect(0, 0, 512, 256);
          
          // Simple landmass shapes (approximating continents)
          ctx.fillStyle = '#22c55e';
          
          // North America approximation
          ctx.beginPath();
          ctx.ellipse(120, 80, 60, 40, 0, 0, 2 * Math.PI);
          ctx.fill();
          
          // South America approximation
          ctx.beginPath();
          ctx.ellipse(140, 160, 25, 50, 0, 0, 2 * Math.PI);
          ctx.fill();
          
          // Europe/Africa approximation
          ctx.beginPath();
          ctx.ellipse(280, 100, 40, 60, 0, 0, 2 * Math.PI);
          ctx.fill();
          
          // Asia approximation
          ctx.beginPath();
          ctx.ellipse(380, 80, 70, 45, 0, 0, 2 * Math.PI);
          ctx.fill();
          
          // Australia approximation
          ctx.beginPath();
          ctx.ellipse(420, 180, 30, 20, 0, 0, 2 * Math.PI);
          ctx.fill();
        }
        
        const texture = new window.THREE.CanvasTexture(canvas2D);
        
        // Create globe with the texture
        const globe = new window.THREE.Mesh(
          new window.THREE.SphereGeometry(1.5, 64, 32),
          new window.THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true,
            opacity: 0.7
          })
        );
        scene.add(globe);
        
        // Add subtle ambient light
        const ambientLight = new window.THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);
        
        // Start camera far away and small globe
        camera.position.set(0, 0, 15);
        globe.scale.setScalar(0.1);
        camera.lookAt(0, 0, 0);
        
        console.log('Globe with texture created');
        
        let animationId: number;
        let startTime = Date.now();
        const animationDuration = 4000; // 4 seconds
        
        function animate() {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / animationDuration, 1);
          
          // Easing function for smooth animation
          const easeInOut = (t: number) => t * t * (3.0 - 2.0 * t);
          const easedProgress = easeInOut(progress);
          
          // Zoom in animation
          const startZ = 15;
          const endZ = 4;
          camera.position.z = startZ + (endZ - startZ) * easedProgress;
          
          // Scale up the globe
          const startScale = 0.1;
          const endScale = 1;
          const currentScale = startScale + (endScale - startScale) * easedProgress;
          globe.scale.setScalar(currentScale);
          
          // Rotate globe - faster at start, slower at end
          const rotationSpeed = 0.02 * (1 - easedProgress * 0.8);
          globe.rotation.y += rotationSpeed;
          
          // Focus on North America (rotate to show it prominently)
          if (progress > 0.7) {
            const focusProgress = (progress - 0.7) / 0.3;
            const targetRotationY = -Math.PI * 0.3; // Show North America
            globe.rotation.y += (targetRotationY - globe.rotation.y) * focusProgress * 0.02;
            globe.rotation.x = Math.sin(focusProgress * Math.PI) * 0.1;
          }
          
          renderer.render(scene, camera);
          animationId = requestAnimationFrame(animate);
        }
        
        animate();
        console.log('Globe animation started with zoom and focus sequence');
        
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
          texture.dispose();
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
      {/* Globe Canvas - positioned behind content */}
      <canvas 
        id="globeCanvas" 
        className="absolute inset-0 w-full h-full hidden sm:block"
        style={{ 
          zIndex: 1,
          opacity: 0.4,
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
