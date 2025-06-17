
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AudienceSelection = () => {
  const navigate = useNavigate();

  const handleAudienceSelection = (audienceType: string) => {
    localStorage.setItem('audienceType', audienceType);
    navigate('/');
  };

  useEffect(() => {
    const initShaderBackground = () => {
      console.log('Initializing shader background...');
      const canvas = document.getElementById('shader-bg') as HTMLCanvasElement;
      if (!canvas) {
        console.error('Canvas not found');
        return;
      }

      // @ts-ignore - THREE.js loaded via CDN
      if (!window.THREE) {
        console.error('Three.js not loaded');
        return;
      }

      console.log('Creating Three.js scene with flowing beams...');
      
      // @ts-ignore - THREE.js loaded via CDN
      const scene = new window.THREE.Scene();
      // @ts-ignore - THREE.js loaded via CDN
      const camera = new window.THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      // @ts-ignore - THREE.js loaded via CDN
      const renderer = new window.THREE.WebGLRenderer({ 
        canvas, 
        alpha: true,
        antialias: true
      });
      
      const uniforms = {
        // @ts-ignore - THREE.js loaded via CDN
        iTime: { value: 0 },
        // @ts-ignore - THREE.js loaded via CDN
        iResolution: { value: new window.THREE.Vector2() }
      };

      // Subtle flowing beams shader inspired by Nexus
      // @ts-ignore - THREE.js loaded via CDN
      const material = new window.THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec2 iResolution;
          uniform float iTime;
          
          float smoothBeam(vec2 origin, vec2 direction, vec2 position, float width, float intensity, float falloffRate) {
            vec2 toPoint = position - origin;
            float projLength = dot(toPoint, direction);
            
            if (projLength < 0.0) return 0.0;
            
            vec2 projection = origin + direction * projLength;
            float distance = length(position - projection);
            
            float beamFalloff = exp(-distance * width);
            float lengthFalloff = exp(-projLength * falloffRate);
            
            return beamFalloff * lengthFalloff * intensity;
          }
          
          void main() {
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            vec2 pos = gl_FragCoord.xy;
            
            // Light source anchored at bottom right (80% from left, 5% from bottom)
            vec2 lightSource = vec2(iResolution.x * 0.8, iResolution.y * 0.05);
            
            vec3 color = vec3(0.0);
            
            // Subtle flowing beams with gentle animation
            float time = iTime * 0.3;
            
            // Main diagonal beam (blue-cyan)
            vec2 dir1 = normalize(vec2(-0.7, 0.7));
            color += vec3(0.2, 0.5, 0.8) * smoothBeam(lightSource, dir1, pos, 0.008, 0.4, 0.0002);
            
            // Secondary beam with slight wave (purple-blue)
            float wave1 = sin(time + pos.y * 0.001) * 0.1;
            vec2 dir2 = normalize(vec2(-0.6 + wave1, 0.8));
            color += vec3(0.4, 0.3, 0.7) * smoothBeam(lightSource, dir2, pos, 0.01, 0.3, 0.0002);
            
            // Third beam going more upward (cyan)
            float wave2 = cos(time * 0.8 + pos.x * 0.001) * 0.08;
            vec2 dir3 = normalize(vec2(-0.5, 0.85 + wave2));
            color += vec3(0.3, 0.6, 0.9) * smoothBeam(lightSource, dir3, pos, 0.012, 0.25, 0.0002);
            
            // Fourth subtle beam (light purple)
            float wave3 = sin(time * 1.2 + pos.y * 0.0008) * 0.06;
            vec2 dir4 = normalize(vec2(-0.8 + wave3, 0.6));
            color += vec3(0.5, 0.4, 0.8) * smoothBeam(lightSource, dir4, pos, 0.015, 0.2, 0.0002);
            
            // Subtle ambient gradient from bottom right
            float distToCorner = length(uv - vec2(0.8, 0.05));
            float ambientGlow = 0.1 * exp(-distToCorner * 2.0);
            color += vec3(0.1, 0.2, 0.4) * ambientGlow;
            
            // Overall scene darkening to match reference
            color *= 0.7;
            
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        transparent: true,
        // @ts-ignore - THREE.js loaded via CDN
        blending: window.THREE.AdditiveBlending
      });

      // @ts-ignore - THREE.js loaded via CDN
      const mesh = new window.THREE.Mesh(new window.THREE.PlaneGeometry(2, 2), material);
      scene.add(mesh);

      const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        uniforms.iResolution.value.set(w, h);
        console.log(`Canvas resized to: ${w}x${h}`);
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
        console.log('Cleaning up shader background...');
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        material.dispose();
        mesh.geometry.dispose();
      };
    };

    // Load Three.js and initialize
    const existingScript = document.querySelector('script[src*="three.min.js"]');
    if (existingScript) {
      // @ts-ignore - THREE.js loaded via CDN
      if (window.THREE) {
        const cleanup = initShaderBackground();
        return cleanup;
      }
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        console.log('Three.js loaded successfully');
        setTimeout(() => {
          const cleanup = initShaderBackground();
          return cleanup;
        }, 100);
      };
      script.onerror = () => {
        console.error('Failed to load Three.js');
      };
      document.head.appendChild(script);
      
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Shader Background Canvas */}
      <canvas 
        id="shader-bg" 
        className="fixed inset-0 w-full h-full"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Content overlay */}
      <div className="min-h-screen flex flex-col justify-center items-center px-6 py-8 relative z-10">
        <div className="max-w-md w-full mx-auto">
          {/* Glass morphism card */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
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
