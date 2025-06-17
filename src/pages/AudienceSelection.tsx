
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AudienceSelection = () => {
  const navigate = useNavigate();

  const handleAudienceSelection = (audienceType: string) => {
    localStorage.setItem('audienceType', audienceType);
    navigate('/');
  };

  useEffect(() => {
    // Initialize Three.js shader background
    const initShaderBackground = () => {
      console.log('Initializing Three.js shader background...');
      const canvas = document.getElementById('branchShader') as HTMLCanvasElement;
      if (!canvas) {
        console.error('Canvas not found');
        return;
      }

      // @ts-ignore
      if (!window.THREE) {
        console.error('Three.js not loaded');
        return;
      }

      console.log('Creating Three.js scene...');
      
      // @ts-ignore
      const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      
      // @ts-ignore
      const scene = new THREE.Scene();
      // @ts-ignore
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
      camera.position.z = 2;

      // @ts-ignore
      const geometry = new THREE.PlaneGeometry(6, 6);
      // @ts-ignore
      const material = new THREE.ShaderMaterial({
        uniforms: {
          // @ts-ignore
          u_time: { value: 0.0 },
          // @ts-ignore
          u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
          void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float u_time;
          uniform vec2 u_resolution;
          
          void main() {
            vec2 st = gl_FragCoord.xy / u_resolution.xy;
            float wave1 = sin(st.x * 8.0 + u_time) * cos(st.y * 6.0 + u_time * 0.5);
            float wave2 = sin(st.x * 12.0 + u_time * 1.2) * cos(st.y * 10.0 + u_time * 0.8);
            vec3 color = vec3(
              0.3 + wave1 * 0.2, 
              0.5 + wave2 * 0.3, 
              0.8 + (wave1 + wave2) * 0.2
            );
            gl_FragColor = vec4(color, 0.6);
          }
        `,
        transparent: true,
        side: 2
      });

      // @ts-ignore
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      console.log('Starting animation loop...');
      
      const animate = () => {
        requestAnimationFrame(animate);
        material.uniforms.u_time.value += 0.02;
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        material.uniforms.u_resolution.value.set(width, height);
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    };

    // Load Three.js and initialize
    const existingScript = document.querySelector('script[src*="three.min.js"]');
    if (existingScript) {
      if (window.THREE) {
        initShaderBackground();
      }
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        console.log('Three.js loaded successfully');
        setTimeout(initShaderBackground, 100);
      };
      script.onerror = () => {
        console.error('Failed to load Three.js');
      };
      document.head.appendChild(script);
    }

    return () => {
      const script = document.querySelector('script[src*="three.min.js"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Shader Background */}
      <canvas 
        id="branchShader" 
        className="fixed inset-0 w-full h-full z-0"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0
        }}
      ></canvas>

      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-5"></div>

      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative z-10">
        <div className="max-w-md w-full mx-auto">
          {/* Glass morphism card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-light text-white mb-3 tracking-wide">
                Welcome
              </h1>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                Choose your role to access the appropriate features and experience
              </p>
            </div>
            
            {/* Selection buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleAudienceSelection('homeowner')}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-white/20 hover:border-white/30 rounded-2xl p-4 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <div className="relative z-10">
                  <div className="text-white font-medium mb-1">Homeowners</div>
                  <div className="text-white/60 text-xs">Residential solutions</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
              
              <button
                onClick={() => handleAudienceSelection('business')}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-white/20 hover:border-white/30 rounded-2xl p-4 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <div className="relative z-10">
                  <div className="text-white font-medium mb-1">Businesses</div>
                  <div className="text-white/60 text-xs">Commercial & organizations</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
              
              <button
                onClick={() => handleAudienceSelection('contractor')}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-white/20 hover:border-white/30 rounded-2xl p-4 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <div className="relative z-10">
                  <div className="text-white font-medium mb-1">Contractors</div>
                  <div className="text-white/60 text-xs">Professional technicians</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-white/50 text-xs">
                HVAC Marketplace Platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceSelection;
