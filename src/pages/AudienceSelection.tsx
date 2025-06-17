
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AudienceSelection = () => {
  const navigate = useNavigate();

  const handleAudienceSelection = (audienceType: string) => {
    localStorage.setItem('audienceType', audienceType);
    navigate('/');
  };

  useEffect(() => {
    // Initialize Three.js shader background similar to Nexus
    const initShaderBackground = () => {
      console.log('Initializing Three.js shader background...');
      const canvas = document.getElementById('shader-bg') as HTMLCanvasElement;
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
      const scene = new THREE.Scene();
      // @ts-ignore
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      // @ts-ignore
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
      
      const uniforms = {
        // @ts-ignore
        iTime: { value: 0 },
        // @ts-ignore
        iResolution: { value: new THREE.Vector2() }
      };

      // @ts-ignore
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `void main(){gl_Position=vec4(position,1.0);}`,
        fragmentShader: `
          uniform vec2 iResolution;
          uniform float iTime;
          
          float strength(vec2 src, vec2 dir, vec2 c, float a, float b, float s) {
            vec2 d = c - src; 
            float cosang = dot(normalize(d), dir);
            return clamp((0.45 + 0.15 * sin(cosang * a + iTime * s)) + (0.3 + 0.2 * cos(-cosang * b + iTime * s)), 0., 1.) *
                   clamp((iResolution.x - length(d)) / iResolution.x, 0.5, 1.);
          }
          
          void main() {
            vec2 c = gl_FragCoord.xy;
            vec2 res = iResolution;
            vec2 p1 = res * vec2(.7, -.4);
            vec2 d1 = normalize(vec2(1., -.116));
            vec2 p2 = res * vec2(.8, -.6);
            vec2 d2 = normalize(vec2(1., .241));
            
            vec4 col = vec4(0);
            col += vec4(1) * strength(p1, d1, c, 36.22, 21.11, 1.5) * .5;
            col += vec4(1) * strength(p2, d2, c, 22.39, 18.02, 1.1) * .4;
            
            float br = 1. - (c.y / res.y);
            col.x *= .1 + br * .8; 
            col.y *= .3 + br * .6; 
            col.z *= .5 + br * .5;
            
            gl_FragColor = col * .25;
          }
        `
      });

      // @ts-ignore
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

      const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h);
        uniforms.iResolution.value.set(w, h);
      };

      const animate = () => {
        uniforms.iTime.value = performance.now() * 0.001;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      console.log('Starting animation loop...');
      resize();
      animate();

      const handleResize = () => {
        resize();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        material.dispose();
      };
    };

    // Load Three.js and initialize
    const existingScript = document.querySelector('script[src*="three.min.js"]');
    if (existingScript) {
      // @ts-ignore
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
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Shader Background */}
      <canvas 
        id="shader-bg" 
        className="fixed inset-0 w-full h-full -z-10"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -10
        }}
      ></canvas>

      <div className="min-h-screen flex flex-col justify-center items-center px-6 py-8 relative z-10">
        <div className="max-w-md w-full mx-auto">
          {/* Glass morphism card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
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
