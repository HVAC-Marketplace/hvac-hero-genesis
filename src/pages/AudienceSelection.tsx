
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

      // Nexus-inspired subtle flowing beams shader
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
          
          float rayIntensity(vec2 origin, vec2 direction, vec2 position, float width, float intensity) {
            vec2 toPoint = position - origin;
            float projLength = dot(toPoint, direction);
            
            // Only show rays that extend away from origin
            if (projLength < 50.0) return 0.0;
            
            vec2 projection = origin + direction * projLength;
            float distance = length(position - projection);
            
            // Ultra soft falloff for elegant beams
            float beamFalloff = exp(-distance * width);
            // Very gradual fade over distance with minimum threshold
            float lengthFalloff = smoothstep(0.0, 1.0, projLength / 800.0) * exp(-projLength * 0.0003);
            
            return beamFalloff * lengthFalloff * intensity;
          }
          
          void main() {
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            vec2 pos = gl_FragCoord.xy;
            
            // Origin completely off-screen at bottom right
            vec2 origin = vec2(iResolution.x * 1.2, iResolution.y * -0.2);
            
            vec3 color = vec3(0.0);
            
            float time = iTime * 0.15;
            
            // Primary beam - soft blue flowing upward-left
            float wave1 = sin(time * 0.7 + pos.y * 0.0003) * 0.08;
            vec2 dir1 = normalize(vec2(-0.65 + wave1, 0.75));
            color += vec3(0.08, 0.15, 0.25) * rayIntensity(origin, dir1, pos, 0.002, 0.6);
            
            // Secondary beam - purple-blue, slightly different angle
            float wave2 = cos(time * 0.9 + pos.x * 0.0004) * 0.06;
            vec2 dir2 = normalize(vec2(-0.75, 0.65 + wave2));
            color += vec3(0.12, 0.08, 0.2) * rayIntensity(origin, dir2, pos, 0.003, 0.5);
            
            // Third beam - cyan tint, more vertical
            float wave3 = sin(time * 0.5 + pos.y * 0.0002) * 0.05;
            vec2 dir3 = normalize(vec2(-0.55 + wave3, 0.83));
            color += vec3(0.05, 0.18, 0.3) * rayIntensity(origin, dir3, pos, 0.004, 0.4);
            
            // Fourth subtle beam - light purple
            float wave4 = cos(time * 1.1 + pos.x * 0.0005) * 0.04;
            vec2 dir4 = normalize(vec2(-0.85 + wave4, 0.55));
            color += vec3(0.15, 0.1, 0.25) * rayIntensity(origin, dir4, pos, 0.005, 0.3);
            
            // Very subtle fifth beam for depth
            float wave5 = sin(time * 1.4 + pos.y * 0.0001) * 0.03;
            vec2 dir5 = normalize(vec2(-0.6, 0.8 + wave5));
            color += vec3(0.1, 0.2, 0.35) * rayIntensity(origin, dir5, pos, 0.006, 0.25);
            
            // Additional atmospheric rays for more depth
            float wave6 = cos(time * 0.3 + pos.x * 0.0002) * 0.02;
            vec2 dir6 = normalize(vec2(-0.7 + wave6, 0.7));
            color += vec3(0.06, 0.12, 0.2) * rayIntensity(origin, dir6, pos, 0.008, 0.2);
            
            // Final subtle darkening to match Nexus aesthetic
            color *= 0.3;
            
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
