
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
        background: '#000000',
        ocean: '#0F172A',
        glow: '#3B82F6',
        particles: {
          north_america: '#60A5FA',
          south_america: '#34D399',
          europe: '#F59E0B',
          africa: '#EF4444',
          asia: '#8B5CF6',
          australia: '#06B6D4'
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
    // Realistic continent coordinate data
    this.continentData = {
      "north_america": {
        "name": "North America",
        "color": "#60A5FA",
        "points": [
          [-168, 65], [-140, 69], [-110, 69], [-95, 69], [-85, 65],
          [-75, 60], [-70, 50], [-75, 45], [-80, 40], [-85, 35],
          [-95, 30], [-105, 25], [-110, 20], [-100, 15], [-85, 18],
          [-80, 25], [-75, 30], [-70, 35], [-65, 40], [-60, 45],
          [-65, 50], [-75, 55], [-85, 60], [-100, 65], [-120, 68],
          [-140, 65], [-160, 62], [-168, 65]
        ]
      },
      "south_america": {
        "name": "South America", 
        "color": "#34D399",
        "points": [
          [-80, 12], [-70, 10], [-60, 5], [-55, 0], [-50, -5],
          [-45, -10], [-40, -20], [-35, -30], [-40, -40], [-45, -45],
          [-50, -50], [-55, -52], [-65, -50], [-70, -45], [-75, -35],
          [-80, -25], [-85, -15], [-80, -5], [-80, 12]
        ]
      },
      "europe": {
        "name": "Europe",
        "color": "#F59E0B",
        "points": [
          [-10, 60], [0, 65], [10, 68], [20, 65], [30, 60],
          [35, 55], [30, 50], [25, 45], [15, 40], [5, 35],
          [-5, 40], [-10, 45], [-15, 50], [-10, 55], [-10, 60]
        ]
      },
      "africa": {
        "name": "Africa",
        "color": "#EF4444",
        "points": [
          [-15, 35], [-10, 30], [0, 25], [10, 20], [20, 15],
          [30, 10], [35, 0], [40, -10], [35, -20], [30, -30],
          [20, -35], [10, -30], [0, -25], [-10, -20], [-15, -10],
          [-20, 0], [-15, 10], [-10, 20], [-15, 35]
        ]
      },
      "asia": {
        "name": "Asia",
        "color": "#8B5CF6",
        "points": [
          [40, 70], [60, 75], [80, 70], [100, 65], [120, 60],
          [140, 55], [160, 50], [170, 45], [160, 35], [140, 30],
          [120, 25], [100, 20], [80, 25], [60, 30], [40, 35],
          [30, 45], [35, 55], [40, 65], [40, 70]
        ]
      },
      "australia": {
        "name": "Australia",
        "color": "#06B6D4",
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
    this.scene.background = new window.THREE.Color(this.options.colors.background);
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
    this.renderer.setClearColor(this.options.colors.background, 0);
  }
  
  createGlobe() {
    // Ocean sphere
    const oceanGeometry = new window.THREE.SphereGeometry(this.options.globeRadius, 64, 32);
    const oceanMaterial = new window.THREE.MeshBasicMaterial({
      color: this.options.colors.ocean,
      transparent: true,
      opacity: 0.3
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
          intensity = pow(dot(normalize(viewVector), actual_normal), 2.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, 1.0);
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
    const colors = [];
    const sizes = [];
    
    // Create LED-style particles for each continent
    for (const [continentName, data] of Object.entries(this.dotMatrixData)) {
      const color = new window.THREE.Color(data.color);
      
      for (const dot of data.dots) {
        const radius = this.options.globeRadius + 0.01;
        positions.push(
          dot.x * radius,
          dot.y * radius,
          dot.z * radius
        );
        
        colors.push(color.r, color.g, color.b);
        sizes.push(this.options.particleSize);
      }
    }
    
    particleGeometry.setAttribute('position', new window.THREE.Float32BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new window.THREE.Float32BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new window.THREE.Float32BufferAttribute(sizes, 1));
    
    const particleMaterial = new window.THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // LED pulsing effect
          float pulse = sin(time * 2.0 + position.x * 10.0) * 0.1 + 1.0;
          gl_PointSize = size * pulse * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          if (distanceToCenter > 0.5) discard;
          
          // LED-like appearance with bright center
          float intensity = 1.0 - distanceToCenter * 2.0;
          intensity = pow(intensity, 2.0);
          
          gl_FragColor = vec4(vColor * intensity, intensity);
        }
      `,
      blending: window.THREE.AdditiveBlending,
      transparent: true,
      vertexColors: true
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
    
    // Organic easing functions
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
    
    // Decelerated rotation
    const rotationSpeed = 0.015 * (1 - progress * 0.7);
    this.globe.rotation.y += rotationSpeed;
    this.particles.rotation.y += rotationSpeed;
    this.glowMesh.rotation.y += rotationSpeed;
    
    // Precise North America focusing
    if (progress > 0.6) {
      const focusProgress = (progress - 0.6) / 0.4;
      const focusEase = easeInOutQuart(focusProgress);
      
      // Calculated for optimal North America view
      const targetRotationY = -Math.PI * 0.25;
      const targetRotationX = Math.PI * 0.05;
      
      this.globe.rotation.y += (targetRotationY - this.globe.rotation.y) * focusEase * 0.03;
      this.globe.rotation.x += (targetRotationX - this.globe.rotation.x) * focusEase * 0.03;
      this.particles.rotation.copy(this.globe.rotation);
      this.glowMesh.rotation.copy(this.globe.rotation);
    }
    
    // Update particle pulsing
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
