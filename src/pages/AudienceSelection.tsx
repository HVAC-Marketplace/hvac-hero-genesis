
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Wrench, Clock, Award } from 'lucide-react';

const AudienceSelection = () => {
  const navigate = useNavigate();

  const handleAudienceSelection = (audienceType: string) => {
    localStorage.setItem('audienceType', audienceType);
    navigate('/');
  };

  useEffect(() => {
    // Initialize Three.js shader background
    const initShaderBackground = () => {
      const canvas = document.getElementById('branchShader') as HTMLCanvasElement;
      if (!canvas) return;

      // @ts-ignore
      const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // @ts-ignore
      const scene = new THREE.Scene();
      // @ts-ignore
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
      camera.position.z = 2;

      // Simple animated gradient geometry
      // @ts-ignore
      const geometry = new THREE.PlaneGeometry(4, 4);
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
            float wave = sin(st.x * 10.0 + u_time) * cos(st.y * 8.0 + u_time * 0.8);
            vec3 color = vec3(0.2 + wave * 0.1, 0.3 + wave * 0.15, 0.8 + wave * 0.1);
            gl_FragColor = vec4(color, 0.3);
          }
        `,
        transparent: true
      });

      // @ts-ignore
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const animate = () => {
        requestAnimationFrame(animate);
        material.uniforms.u_time.value += 0.01;
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    };

    // Load Three.js and initialize
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = initShaderBackground;
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="three.min.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      {/* Animated Shader Background */}
      <canvas id="branchShader" className="fixed inset-0 w-full h-full -z-10"></canvas>

      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8">
        <div className="max-w-2xl w-full mx-auto text-center">
          <h1 className="text-4xl font-medium text-gray-800 mb-2">
            Welcome to HVAC Marketplace
          </h1>
          <p className="text-lg font-light text-gray-600 mb-8">
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
              className="w-full px-6 py-4 border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-lg text-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Businesses & Organizations
            </button>
            
            <button
              onClick={() => handleAudienceSelection('contractor')}
              className="w-full px-6 py-4 text-blue-600 hover:text-blue-800 underline bg-transparent text-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
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
