
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
      renderer.setClearColor(0x000000, 0); // Transparent background
      
      // @ts-ignore
      const scene = new THREE.Scene();
      // @ts-ignore
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
      camera.position.z = 2;

      // Simple animated gradient geometry
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
        side: 2 // Double sided
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
      // Three.js already loaded
      if (window.THREE) {
        initShaderBackground();
      }
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        console.log('Three.js loaded successfully');
        setTimeout(initShaderBackground, 100); // Small delay to ensure DOM is ready
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
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

      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative z-10">
        <div className="max-w-2xl w-full mx-auto text-center">
          <h1 className="text-4xl font-medium text-white mb-2">
            Welcome to HVAC Marketplace
          </h1>
          <p className="text-lg font-light text-gray-200 mb-8">
            Please select your role to continue
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => handleAudienceSelection('homeowner')}
              className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Homeowners & Residential
            </button>
            
            <button
              onClick={() => handleAudienceSelection('business')}
              className="w-full px-6 py-4 border-2 border-blue-600 text-blue-100 bg-white/10 hover:bg-white/20 rounded-lg text-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Businesses & Organizations
            </button>
            
            <button
              onClick={() => handleAudienceSelection('contractor')}
              className="w-full px-6 py-4 text-blue-200 hover:text-white underline bg-transparent text-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
            >
              Professional Contractors & Technicians
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceSelection;
