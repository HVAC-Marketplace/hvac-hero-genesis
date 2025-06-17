/**
 * Enhanced Three.js Globe Animation
 * Features realistic geography, LED-style particles, and smooth animations
 */

export class EnhancedGlobe {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.options = {
      globeRadius: 1.5,
      particleSize: 0.025,
      animationDuration: 4000,
      focusRegion: 'north_america',
      colors: {
        background: 'transparent',
        ocean: '#0a0a0f',
        glow: '#1e40af',
        particles: {
          north_america: '#ffffff',
          south_america: '#e5e7eb',
          europe: '#d1d5db',
          africa: '#9ca3af',
          asia: '#6b7280',
          australia: '#4b5563'
        }
      },
      ...options
    };
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globe = null;
    this.particles = null;
    this.glowMesh = null;
    this.animationId = null;
    this.startTime = null;
    this.isAnimating = false;
  }
  
  async init() {
    if (!this.canvas || !window.THREE) {
      throw new Error('Canvas or Three.js not available');
    }
    
    try {
      await this.loadGeographyData();
      this.setupScene();
      this.setupCamera();
      this.setupRenderer();
      this.createGlobe();
      this.createParticles();
      this.setupLighting();
      this.startAnimation();
      
      console.log('Enhanced globe initialized successfully');
    } catch (error) {
      console.error('Failed to initialize enhanced globe:', error);
      throw error;
    }
  }
  
  async loadGeographyData() {
    // More accurate continent coordinate data with proper North America shape
    this.continentData = {
      "north_america": {
        "name": "North America",
        "color": "#ffffff",
        "points": [
          [-170, 70], [-160, 72], [-140, 70], [-120, 69], [-100, 70], [-90, 68],
          [-80, 65], [-70, 60], [-65, 55], [-70, 50], [-75, 45], [-80, 40],
          [-85, 35], [-90, 30], [-95, 25], [-100, 20], [-105, 25], [-110, 30],
          [-115, 35], [-120, 40], [-125, 45], [-130, 50], [-135, 55], [-140, 60],
          [-145, 62], [-150, 65], [-155, 67], [-160, 68], [-165, 69], [-170, 70]
        ]
      },
      "south_america": {
        "name": "South America", 
        "color": "#e5e7eb",
        "points": [
          [-80, 12], [-70, 10], [-60, 5], [-55, 0], [-50, -5],
          [-45, -10], [-40, -20], [-35, -30], [-40, -40], [-45, -45],
          [-50, -50], [-55, -52], [-65, -50], [-70, -45], [-75, -35],
          [-80, -25], [-85, -15], [-80, -5], [-80, 12]
        ]
      },
      "europe": {
        "name": "Europe",
        "color": "#d1d5db",
        "points": [
          [-10, 60], [0, 65], [10, 68], [20, 65], [30, 60],
          [35, 55], [30, 50], [25, 45], [15, 40], [5, 35],
          [-5, 40], [-10, 45], [-15, 50], [-10, 55], [-10, 60]
        ]
      },
      "africa": {
        "name": "Africa",
        "color": "#9ca3af",
        "points": [
          [-15, 35], [-10, 30], [0, 25], [10, 20], [20, 15],
          [30, 10], [35, 0], [40, -10], [35, -20], [30, -30],
          [20, -35], [10, -30], [0, -25], [-10, -20], [-15, -10],
          [-20, 0], [-15, 10], [-10, 20], [-15, 35]
        ]
      },
      "asia": {
        "name": "Asia",
        "color": "#6b7280",
        "points": [
          [40, 70], [60, 75], [80, 70], [100, 65], [120, 60],
          [140, 55], [160, 50], [170, 45], [160, 35], [140, 30],
          [120, 25], [100, 20], [80, 25], [60, 30], [40, 35],
          [30, 45], [35, 55], [40, 65], [40, 70]
        ]
      },
      "australia": {
        "name": "Australia",
        "color": "#4b5563",
        "points": [
          [110, -10], [130, -12], [150, -15], [155, -25], [150, -35],
          [140, -40], [130, -38], [120, -35], [115, -25], [110, -15],
          [110, -10]
        ]
      }
    };
    
    this.dotMatrixData = this.generateDotMatrix();
  }
  
  generateDotMatrix() {
    const dotMatrix = {};
    const density = 1.5;
    
    for (const [continentName, data] of Object.entries(this.continentData)) {
      const points = data.points;
      const color = data.color;
      
      const minLon = Math.min(...points.map(p => p[0]));
      const maxLon = Math.max(...points.map(p => p[0]));
      const minLat = Math.min(...points.map(p => p[1]));
      const maxLat = Math.max(...points.map(p => p[1]));
      
      const dots = [];
      const step = density;
      
      for (let lon = minLon; lon <= maxLon; lon += step) {
        for (let lat = minLat; lat <= maxLat; lat += step) {
          if (this.isPointInPolygon(lon, lat, points)) {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            
            dots.push({
              lon, lat, phi, theta,
              x: Math.sin(phi) * Math.cos(theta),
              y: Math.cos(phi),
              z: Math.sin(phi) * Math.sin(theta)
            });
          }
        }
      }
      
      dotMatrix[continentName] = { color, dots };
    }
    
    return dotMatrix;
  }
  
  isPointInPolygon(x, y, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (((polygon[i][1] > y) !== (polygon[j][1] > y)) &&
          (x < (polygon[j][0] - polygon[i][0]) * (y - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0])) {
        inside = !inside;
      }
    }
    return inside;
  }
  
  setupScene() {
    this.scene = new window.THREE.Scene();
    // Dark space background
    this.scene.background = new window.THREE.Color('#000510');
  }
  
  setupCamera() {
    this.camera = new window.THREE.PerspectiveCamera(
      45,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 15);
    this.camera.lookAt(0, 0, 0);
  }
  
  setupRenderer() {
    this.renderer = new window.THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setClearColor('#000510', 0.1);
  }
  
  createGlobe() {
    // Dark ocean sphere
    const oceanGeometry = new window.THREE.SphereGeometry(this.options.globeRadius, 64, 32);
    const oceanMaterial = new window.THREE.MeshBasicMaterial({
      color: this.options.colors.ocean,
      transparent: true,
      opacity: 0.6
    });
    
    this.globe = new window.THREE.Mesh(oceanGeometry, oceanMaterial);
    this.scene.add(this.globe);
    
    // Atmospheric glow effect
    const glowGeometry = new window.THREE.SphereGeometry(this.options.globeRadius * 1.05, 32, 16);
    const glowMaterial = new window.THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new window.THREE.Color(this.options.colors.glow) },
        viewVector: { value: this.camera.position }
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));
          intensity = pow(dot(normalize(viewVector), actual_normal), 1.5);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, intensity * 0.3);
        }
      `,
      side: window.THREE.BackSide,
      blending: window.THREE.AdditiveBlending,
      transparent: true
    });
    
    this.glowMesh = new window.THREE.Mesh(glowGeometry, glowMaterial);
    this.scene.add(this.glowMesh);
  }
  
  createParticles() {
    const particleGeometry = new window.THREE.BufferGeometry();
    const positions = [];
    const particleColors = [];
    const sizes = [];
    
    // Create bright LED-style particles for each continent
    for (const [continentName, data] of Object.entries(this.dotMatrixData)) {
      const color = new window.THREE.Color(data.color);
      
      for (const dot of data.dots) {
        const radius = this.options.globeRadius + 0.02;
        positions.push(
          dot.x * radius,
          dot.y * radius,
          dot.z * radius
        );
        
        particleColors.push(color.r, color.g, color.b);
        // Make North America particles larger and brighter
        const size = continentName === 'north_america' ? this.options.particleSize * 1.5 : this.options.particleSize;
        sizes.push(size);
      }
    }
    
    particleGeometry.setAttribute('position', new window.THREE.Float32BufferAttribute(positions, 3));
    particleGeometry.setAttribute('particleColor', new window.THREE.Float32BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new window.THREE.Float32BufferAttribute(sizes, 1));
    
    const particleMaterial = new window.THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        attribute float size;
        attribute vec3 particleColor;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = particleColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Bright LED pulsing effect
          float pulse = sin(time * 3.0 + position.x * 15.0) * 0.2 + 1.2;
          gl_PointSize = size * pulse * (400.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          if (distanceToCenter > 0.5) discard;
          
          // Bright LED appearance with very bright center
          float intensity = 1.0 - distanceToCenter * 2.0;
          intensity = pow(intensity, 1.5);
          
          // Extra brightness for white particles (North America)
          float brightness = vColor.r > 0.9 ? 2.0 : 1.0;
          
          gl_FragColor = vec4(vColor * intensity * brightness, intensity);
        }
      `,
      blending: window.THREE.AdditiveBlending,
      transparent: true
    });
    
    this.particles = new window.THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particles);
  }
  
  setupLighting() {
    const ambientLight = new window.THREE.AmbientLight(0x404040, 0.2);
    this.scene.add(ambientLight);
    
    const directionalLight = new window.THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }
  
  startAnimation() {
    this.startTime = Date.now();
    this.globe.scale.setScalar(0.1);
    this.particles.scale.setScalar(0.1);
    this.glowMesh.scale.setScalar(0.1);
    this.isAnimating = true;
    this.animate();
  }
  
  animate() {
    if (!this.isAnimating) return;
    
    const elapsed = Date.now() - this.startTime;
    const progress = Math.min(elapsed / this.options.animationDuration, 1);
    
    // Smoother easing functions
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const easeInOutQuart = t => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    
    const scaleProgress = easeOutCubic(progress);
    const cameraProgress = easeInOutQuart(progress);
    
    // Smooth zoom animation
    const startZ = 15;
    const endZ = 4;
    this.camera.position.z = startZ + (endZ - startZ) * cameraProgress;
    
    // Smooth scale animation
    const startScale = 0.1;
    const endScale = 1;
    const currentScale = startScale + (endScale - startScale) * scaleProgress;
    this.globe.scale.setScalar(currentScale);
    this.particles.scale.setScalar(currentScale);
    this.glowMesh.scale.setScalar(currentScale);
    
    // Slower, more controlled rotation
    const rotationSpeed = 0.008 * (1 - progress * 0.5);
    this.globe.rotation.y += rotationSpeed;
    this.particles.rotation.y += rotationSpeed;
    this.glowMesh.rotation.y += rotationSpeed;
    
    // Improved North America focusing - more gradual approach
    if (progress > 0.5) {
      const focusProgress = (progress - 0.5) / 0.5;
      const focusEase = easeInOutQuart(focusProgress);
      
      // Better positioned for North America view
      const targetRotationY = -Math.PI * 0.35;  // Better angle for NA
      const targetRotationX = Math.PI * 0.1;    // Slight tilt up
      
      // Gradual, smooth transition to target
      const lerpFactor = focusEase * 0.02;
      this.globe.rotation.y += (targetRotationY - this.globe.rotation.y) * lerpFactor;
      this.globe.rotation.x += (targetRotationX - this.globe.rotation.x) * lerpFactor;
      this.particles.rotation.copy(this.globe.rotation);
      this.glowMesh.rotation.copy(this.globe.rotation);
    }
    
    // Update particle pulsing for LED effect
    if (this.particles.material.uniforms) {
      this.particles.material.uniforms.time.value = elapsed * 0.001;
    }
    
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    // Clean up geometries and materials
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
  }
  
  handleResize() {
    if (this.camera && this.renderer) {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }
  }
}
