
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
      console.log('Initializing enhanced shader background...');
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

      console.log('Creating Three.js scene with enhanced shader...');
      
      // @ts-ignore
      const scene = new THREE.Scene();
      // @ts-ignore
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      // @ts-ignore
      const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      
      const uniforms = {
        // @ts-ignore
        iTime: { value: 0 },
        // @ts-ignore
        iResolution: { value: new THREE.Vector2() }
      };

      // Enhanced shader with more visible flowing light beams
      // @ts-ignore
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec2 iResolution;
          uniform float iTime;
          
          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for(int i = 0; i < 4; i++) {
              value += amplitude * noise(p);
              p *= 2.0;
              amplitude *= 0.5;
            }
            return value;
          }
          
          float beam(vec2 uv, vec2 start, vec2 end, float width, float intensity) {
            vec2 dir = normalize(end - start);
            vec2 perp = vec2(-dir.y, dir.x);
            vec2 toPoint = uv - start;
            float along = dot(toPoint, dir);
            float across = abs(dot(toPoint, perp));
            float falloff = 1.0 - smoothstep(0.0, width, across);
            float lengthFalloff = 1.0 - smoothstep(0.0, length(end - start), along);
            lengthFalloff *= smoothstep(-0.1, 0.0, along);
            return falloff * lengthFalloff * intensity;
          }
          
          void main() {
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            vec2 centeredUv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
            
            vec3 color = vec3(0.0);
            
            // Multiple flowing light beams
            float time = iTime * 0.5;
            
            // Beam 1 - Diagonal flowing
            vec2 start1 = vec2(-1.5 + sin(time) * 0.3, -1.0 + cos(time * 0.7) * 0.2);
            vec2 end1 = vec2(1.5 + cos(time * 0.8) * 0.4, 1.0 + sin(time * 0.6) * 0.3);
            float beam1 = beam(centeredUv, start1, end1, 0.05, 0.8);
            color += vec3(0.2, 0.6, 1.0) * beam1;
            
            // Beam 2 - Horizontal flowing
            vec2 start2 = vec2(-1.2 + cos(time * 1.2) * 0.4, 0.3 + sin(time * 0.9) * 0.2);
            vec2 end2 = vec2(1.2 + sin(time * 0.7) * 0.3, -0.2 + cos(time * 1.1) * 0.25);
            float beam2 = beam(centeredUv, start2, end2, 0.04, 0.6);
            color += vec3(0.6, 0.3, 1.0) * beam2;
            
            // Beam 3 - Curved path
            vec2 start3 = vec2(0.8 + sin(time * 1.5) * 0.2, -0.8 + cos(time) * 0.3);
            vec2 end3 = vec2(-0.6 + cos(time * 0.8) * 0.4, 0.6 + sin(time * 1.3) * 0.2);
            float beam3 = beam(centeredUv, start3, end3, 0.06, 0.7);
            color += vec3(0.3, 1.0, 0.7) * beam3;
            
            // Add subtle background gradient
            float gradient = 1.0 - length(centeredUv) * 0.3;
            color += vec3(0.02, 0.05, 0.1) * gradient;
            
            // Add some sparkle effects
            float sparkle = fbm(centeredUv * 10.0 + time) * 0.1;
            color += vec3(sparkle);
            
            // Enhance brightness and contrast
            color = pow(color, vec3(0.8));
            color *= 1.2;
            
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        transparent: true
      });

      // @ts-ignore
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
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

      console.log('Starting enhanced animation loop...');
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
      // @ts-ignore
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
      {/* Enhanced Shader Background */}
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
