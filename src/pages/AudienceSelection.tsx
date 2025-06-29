import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Building, Wrench, Bot, Link, BarChart3, ArrowRight, RotateCcw } from 'lucide-react';

const AudienceSelection = () => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleAudienceSelection = (audienceType: string) => {
    localStorage.setItem('audienceType', audienceType);
    navigate('/');
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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
            
            // Show rays extending from origin outward
            if (projLength < 0.0) return 0.0;
            
            vec2 projection = origin + direction * projLength;
            float distance = length(position - projection);
            
            // Tighter beam with higher contrast
            float beamFalloff = exp(-distance * width);
            // Gentle distance fade
            float lengthFalloff = exp(-projLength * 0.0005);
            
            return beamFalloff * lengthFalloff * intensity;
          }
          
          void main() {
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            vec2 pos = gl_FragCoord.xy;
            
            // Origin further away from bottom-right corner
            vec2 origin = vec2(iResolution.x * 1.3, iResolution.y * 1.3);
            
            vec3 color = vec3(0.0);
            
            float time = iTime * 0.2;
            
            // Less broad, higher contrast white flowing beams emanating from bottom-right
            float wave1 = sin(time * 0.8 + pos.y * 0.0008) * 0.1;
            vec2 dir1 = normalize(vec2(-0.7 + wave1, -0.7));
            color += vec3(0.675) * rayIntensity(origin, dir1, pos, 0.006, 0.35);
            
            float wave2 = cos(time * 1.0 + pos.x * 0.0006) * 0.08;
            vec2 dir2 = normalize(vec2(-0.8, -0.6 + wave2));
            color += vec3(0.675) * rayIntensity(origin, dir2, pos, 0.007, 0.3);
            
            float wave3 = sin(time * 0.6 + pos.y * 0.0005) * 0.06;
            vec2 dir3 = normalize(vec2(-0.6 + wave3, -0.8));
            color += vec3(0.675) * rayIntensity(origin, dir3, pos, 0.008, 0.28);
            
            float wave4 = cos(time * 1.2 + pos.x * 0.0007) * 0.05;
            vec2 dir4 = normalize(vec2(-0.5 + wave4, -0.9));
            color += vec3(0.675) * rayIntensity(origin, dir4, pos, 0.009, 0.25);
            
            float wave5 = sin(time * 1.5 + pos.y * 0.0004) * 0.04;
            vec2 dir5 = normalize(vec2(-0.9, -0.4 + wave5));
            color += vec3(0.675) * rayIntensity(origin, dir5, pos, 0.01, 0.22);
            
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

    const initAuroraBackground = () => {
      console.log('Initializing aurora background...');
      const canvas = document.getElementById('aurora-bg') as HTMLCanvasElement;
      if (!canvas) {
        console.error('Aurora canvas not found');
        return;
      }

      // @ts-ignore - THREE.js loaded via CDN
      if (!window.THREE) {
        console.error('Three.js not loaded for aurora');
        return;
      }

      console.log('Creating Three.js aurora scene...');
      
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

      // @ts-ignore - THREE.js loaded via CDN
      const material = new window.THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
          varying vec2 vUv;
          void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float iTime;
          uniform vec2 iResolution;
          varying vec2 vUv;

          #define S smoothstep

          vec4 Line(vec2 uv, float speed, float height, vec3 col) {
              uv.y += S(1., 0., abs(uv.x)) * sin(iTime * speed + uv.x * height) * 0.2;
              return vec4(S(0.06 * S(0.2, 0.9, abs(uv.x)), 0., abs(uv.y) - 0.004) * col, 1.0) * S(1., 0.3, abs(uv.x));
          }

          void main() {
              vec2 uv = (vUv - 0.5) * vec2(iResolution.x / iResolution.y, 1.0);
              vec4 O = vec4(0.);
              
              // Global color transition cycle - slower for smoother transitions
              float globalCycle = sin(iTime * 0.15) * 0.5 + 0.5; // 0 to 1
              
              for (float i = 0.; i <= 5.; i += 1.) {
                  float t = i / 5.;
                  float timeOffset = iTime * 0.3 + t * 2.0;
                  
                  // Create phase transitions: orange -> white -> blue -> white -> orange
                  float phase = mod(globalCycle + t * 0.3, 1.0);
                  vec3 brandColor;
                  
                  if (phase < 0.25) {
                      // Orange/yellow phase
                      float localPhase = phase / 0.25;
                      brandColor = vec3(
                          0.35 + 0.1 * sin(timeOffset),
                          0.15 + 0.08 * localPhase,
                          0.0
                      );
                  } else if (phase < 0.4) {
                      // Transition to white
                      float localPhase = (phase - 0.25) / 0.15;
                      vec3 orange = vec3(0.35, 0.15, 0.0);
                      vec3 white = vec3(0.3, 0.3, 0.3);
                      brandColor = mix(orange, white, localPhase);
                  } else if (phase < 0.65) {
                      // Blue phase
                      float localPhase = (phase - 0.4) / 0.25;
                      brandColor = vec3(
                          0.0,
                          0.03 + 0.02 * localPhase,
                          0.2 + 0.12 * sin(timeOffset * 1.1)
                      );
                  } else if (phase < 0.8) {
                      // Transition to white
                      float localPhase = (phase - 0.65) / 0.15;
                      vec3 blue = vec3(0.0, 0.03, 0.2);
                      vec3 white = vec3(0.3, 0.3, 0.3);
                      brandColor = mix(blue, white, localPhase);
                  } else {
                      // Transition back to orange
                      float localPhase = (phase - 0.8) / 0.2;
                      vec3 white = vec3(0.3, 0.3, 0.3);
                      vec3 orange = vec3(0.35, 0.15, 0.0);
                      brandColor = mix(white, orange, localPhase);
                  }
                  
                  O += Line(uv, 1. + t * 0.8, 4. + t, brandColor);
              }
              
              gl_FragColor = O;
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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio * 2, 3));
        uniforms.iResolution.value.set(w * 2, h * 2);
        console.log(`Aurora canvas resized to: ${w}x${h}`);
      };

      const animate = () => {
        uniforms.iTime.value = performance.now() * 0.001;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      console.log('Starting aurora animation loop...');
      resize();
      animate();

      const handleResize = () => {
        resize();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        console.log('Cleaning up aurora background...');
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        material.dispose();
        mesh.geometry.dispose();
      };
    };

    // Load Three.js and initialize both backgrounds
    const existingScript = document.querySelector('script[src*="three.min.js"]');
    if (existingScript) {
      // @ts-ignore - THREE.js loaded via CDN
      if (window.THREE) {
        const cleanupShader = initShaderBackground();
        const cleanupAurora = initAuroraBackground();
        return () => {
          if (cleanupShader) cleanupShader();
          if (cleanupAurora) cleanupAurora();
        };
      }
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        console.log('Three.js loaded successfully');
        const cleanupShader = initShaderBackground();
        const cleanupAurora = initAuroraBackground();
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

  const audienceOptions = [
    {
      id: 'homeowner',
      title: 'Homeowners',
      subtitle: 'Residential Solutions',
      description: 'Order, track, and maintain your home\'s HVAC equipment with ease.',
      icon: Home,
      gradient: 'from-blue-400/15 to-blue-600/15 hover:from-blue-400/25 hover:to-blue-600/25'
    },
    {
      id: 'business',
      title: 'Businesses',
      subtitle: 'Commercial Solutions',
      description: 'Centralize procurement and monitor your organization\'s HVAC assets from one dashboard.',
      icon: Building,
      gradient: 'from-white/10 to-white/5 hover:from-white/15 hover:to-white/10'
    },
    {
      id: 'contractor',
      title: 'Contractors',
      subtitle: 'Professional Tools',
      description: 'Unlock trade-only pricing, job management features, and technical resources.',
      icon: Wrench,
      gradient: 'from-orange-400/15 to-amber-500/15 hover:from-orange-400/25 hover:to-amber-500/25'
    }
  ];

  const platformFeatures = [
    {
      icon: Bot,
      title: 'Smart Order Automation',
      description: 'Automate repeat ordering, restocking alerts, and maintenance reminders—no coding required.',
      action: 'Learn how',
      gradient: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:border-blue-500/60 hover:shadow-blue-500/30',
      textColor: 'text-blue-400',
      bgHover: 'hover:bg-blue-500/10'
    },
    {
      icon: Link,
      title: 'Seamless System Connectivity',
      description: 'Connect your account to 100+ HVAC tools and services for real-time sync of orders, quotes, and service logs.',
      action: 'View integrations',
      gradient: 'from-orange-500 to-amber-600',
      hoverColor: 'hover:border-orange-500/60 hover:shadow-orange-500/30',
      textColor: 'text-orange-400',
      bgHover: 'hover:bg-orange-500/10'
    },
    {
      icon: BarChart3,
      title: 'Live Performance Dashboards',
      description: 'Monitor order statuses, project KPIs, and energy savings metrics with instant analytics.',
      action: 'See analytics',
      gradient: 'from-blue-600 to-cyan-600',
      hoverColor: 'hover:border-blue-600/60 hover:shadow-blue-600/30',
      textColor: 'text-blue-300',
      bgHover: 'hover:bg-blue-600/10'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Base Shader Background Canvas - Flowing beams */}
      <canvas 
        id="shader-bg" 
        className="fixed inset-0 w-full h-full"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Aurora Background Canvas - Above base layer but more transparent */}
      <canvas 
        id="aurora-bg" 
        className="fixed inset-0 w-full h-full opacity-60"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Content overlay */}
      <div className="min-h-screen flex flex-col justify-center items-center px-6 py-8 relative z-10">
        <div className="max-w-2xl w-full mx-auto">
          {/* Flip Container with 3D Perspective */}
          <div className="relative perspective-1000" style={{ perspective: '1000px' }}>
            <div 
              className={`relative transition-transform duration-700 transform-style-preserve-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front Side - Original Portal */}
              <div 
                className={`bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl backface-hidden ${
                  isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  {/* Brand Logo - Larger and without glass circle */}
                  <div className="inline-flex items-center justify-center mb-3">
                    <img 
                      src="/lovable-uploads/285c4d5c-0439-42e9-9ea6-a7a05b9c8489.png" 
                      alt="HVAC Marketplace Logo" 
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <h1 className="text-2xl font-light text-white mb-2 tracking-wide">
                    Welcome to the HVAC Marketplace
                  </h1>
                  <p className="text-white/70 text-sm font-light leading-relaxed max-w-lg mx-auto">
                    Choose your role to access tailor-made HVAC solutions and streamline your workflow.
                  </p>
                </div>

                {/* Features List */}
                <div className="flex justify-center items-center gap-4 mb-6 text-xs">
                  <div className="flex items-center text-white/60">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                    <span>Secure account management</span>
                  </div>
                  <div className="flex items-center text-white/60">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                    <span>Rapid product ordering</span>
                  </div>
                  <div className="flex items-center text-white/60">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                    <span>Personalized service & support</span>
                  </div>
                </div>
                
                {/* Vertical Portal Cards - Condensed */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {audienceOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAudienceSelection(option.id)}
                      className={`group relative overflow-hidden bg-gradient-to-b ${option.gradient} border border-white/20 hover:border-white/30 rounded-2xl p-4 text-center transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white/30 hover:scale-105 hover:shadow-2xl`}
                      style={{ minHeight: '220px' }}
                    >
                      <div className="relative z-10 flex flex-col items-center h-full">
                        {/* Icon */}
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center mb-3 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                          <option.icon className="w-5 h-5 text-white" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-grow flex flex-col justify-center">
                          <h3 className="text-lg font-semibold text-white mb-1">{option.title}</h3>
                          <p className="text-white/60 text-xs mb-2">{option.subtitle}</p>
                          <p className="text-white/50 text-xs leading-relaxed mb-3">{option.description}</p>
                        </div>
                        
                        {/* Sign In Button */}
                        <div className="w-full">
                          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 text-white font-medium group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300 text-xs">
                            Enter here →
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent translate-y-[100%] group-hover:translate-y-[-100%] transition-transform duration-700"></div>
                    </button>
                  ))}
                </div>

                {/* Discover Features Button */}
                <div className="text-center mb-4">
                  <button
                    onClick={handleFlip}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-orange-500/20 hover:from-blue-500/30 hover:to-orange-500/30 border border-white/20 hover:border-white/30 rounded-xl px-4 py-2 text-white font-medium transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-sm">Explore All Features</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-white/10 text-center">
                  <p className="text-white/40 text-xs mb-2">
                    New to HVAC Portal? <span className="text-white/60 underline cursor-pointer">Create your account</span>
                  </p>
                  <div className="flex justify-center space-x-4 text-xs text-white/30">
                    <span className="hover:text-white/50 cursor-pointer">Privacy Policy</span>
                    <span>•</span>
                    <span className="hover:text-white/50 cursor-pointer">Terms of Service</span>
                    <span>•</span>
                    <span className="hover:text-white/50 cursor-pointer">Support</span>
                  </div>
                </div>
              </div>

              {/* Back Side - Platform Features */}
              <div 
                className={`absolute inset-0 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl rotate-y-180 backface-hidden ${
                  isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                {/* Features Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center mb-4">
                    <img 
                      src="/lovable-uploads/285c4d5c-0439-42e9-9ea6-a7a05b9c8489.png" 
                      alt="HVAC Marketplace Logo" 
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    Power Up Every HVAC Role
                  </h2>
                  <p className="text-white/70 text-sm font-light leading-relaxed max-w-lg mx-auto">
                    Get the tools, insights, and integrations you need—tailored for homeowners, businesses, and contractors.
                  </p>
                </div>

                {/* Platform Features Grid */}
                <div className="grid gap-4 mb-6">
                  {platformFeatures.map((feature, index) => (
                    <div 
                      key={index}
                      className={`group bg-white/5 border border-white/10 ${feature.hoverColor} ${feature.bgHover} rounded-xl p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br ${feature.gradient} rounded-lg mb-1 group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-grow min-w-0">
                          <h3 className={`text-base font-semibold text-white mb-1 group-hover:${feature.textColor} transition-colors duration-200`}>
                            {feature.title}
                          </h3>
                          <p className="text-white/60 text-xs leading-relaxed mb-2">
                            {feature.description}
                          </p>
                          <div className={`flex items-center gap-2 text-xs ${feature.textColor} group-hover:underline transition-all duration-200 font-medium cursor-pointer`}>
                            <span>{feature.action}</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Back to Portal Button */}
                <div className="text-center">
                  <button
                    onClick={handleFlip}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/20 hover:border-white/30 rounded-xl px-4 py-2 text-white font-medium transition-all duration-300 hover:scale-105"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm">Back to Portal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default AudienceSelection;
