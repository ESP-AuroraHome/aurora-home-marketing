<template>
  <div class="space-y-4">
    <!-- Main Display Area -->
    <div
      class="aspect-square glass-panel rounded-3xl relative overflow-hidden bg-stone-100"
      ref="container"
    >
      <!-- Loading Spinner -->
      <div
        v-if="loading && viewMode === '3d'"
        class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      >
        <i class="ph ph-spinner animate-spin text-2xl text-stone-400"></i>
      </div>

      <!-- 3D View Layer -->
      <!-- We hide it with v-show to keep the WebGL context alive -->
      <div
        v-show="viewMode === '3d'"
        ref="canvasContainer"
        class="w-full h-full relative group cursor-move"
      >
        <!-- Three.js Canvas appended here by init() -->

        <!-- AR Button -->
        <button
          v-if="arModelSrc"
          @click="launchAR"
          title="Voir chez vous (RA)"
          class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-stone-900/10 backdrop-blur-md border border-white/20 rounded-full text-stone-600 hover:bg-stone-900 hover:text-white hover:scale-105 transition-all duration-300 z-20 group/ar"
        >
          <i class="ph ph-cube-focus text-lg"></i>
        </button>

        <!-- Controls Hint -->
        <div
          class="absolute bottom-4 left-4 right-4 text-center pointer-events-none opacity-100 <!--group-hover:opacity-100--> transition-opacity duration-500 z-10"
        >
          <svg color-interpolation-filters="sRGB" style="display: none;">
            <defs>
              <filter id="product-3d-viewer-tuto-filter">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blurred_source"></feGaussianBlur>
                <feImage href="/images/liquid-glass/header_bar_displacement_xl.png" x="183" y="0" width="326" height="28" result="displacement_map"></feImage>
                <feDisplacementMap in="blurred_source" in2="displacement_map" scale="54.97305784439829" xChannelSelector="R" yChannelSelector="G" result="displaced"></feDisplacementMap>
                <feColorMatrix in="displaced" type="saturate" result="displaced_saturated" values="4"></feColorMatrix>
                <feImage href="/images/liquid-glass/header_bar_specular_xl.png" x="183" y="0" width="326" height="28" result="specular_layer"></feImage>
                <feComposite in="displaced_saturated" in2="specular_layer" operator="in" result="specular_saturated"></feComposite>
                <feComponentTransfer in="specular_layer" result="specular_faded"><feFuncA type="linear" slope="1"></feFuncA>
                </feComponentTransfer><feBlend in="specular_saturated" in2="displaced" mode="normal" result="withSaturation"></feBlend>
                <feBlend in="specular_faded" in2="withSaturation" mode="normal"></feBlend>
              </filter>
            </defs>
          </svg>
          <span
            class="text-xs text-stone-500 px-3 py-1 rounded-full shadow-sm"
            style="
              backdrop-filter: url(#product-3d-viewer-tuto-filter);
              padding-block: 6px;
            "
          >
            Cliquez et glissez pour tourner &middot; Molette pour zoomer
          </span>
        </div>

        <!-- Hidden Model Viewer for AR -->
        <model-viewer
          ref="modelViewerRef"
          v-if="arModelSrc"
          :src="arModelSrc"
          ar
          ar-scale="fixed"
          ar-modes="webxr quick-look"
          camera-controls
          auto-rotate
          style="
            position: absolute;
            top: 0;
            left: 0;
            width: 1px;
            height: 1px;
            opacity: 0;
            pointer-events: none;
            z-index: -1;
          "
        >
        </model-viewer>
      </div>

      <!-- Image Layers -->
      <template v-for="img in galleryImages" :key="img.id">
        <img
          v-if="viewMode === img.id"
          :src="img.src"
          class="w-full h-full object-cover animate-fade-in"
          :alt="img.alt"
        />
      </template>

      <!-- Back to 3D Button (visible only in image mode) -->
      <button
        v-if="viewMode !== '3d'"
        @click="viewMode = '3d'"
        class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-sm font-medium text-stone-800 hover:bg-white transition-all transform hover:scale-105 flex items-center gap-2"
      >
        <i class="ph ph-cube"></i>
        Retour à la vue 3D
      </button>
    </div>

    <!-- Thumbnails Grid -->
    <!-- 3D + 8 Images = 9 items. 3x3 Grid is perfect. -->
    <div class="grid grid-cols-3 gap-4">
      <!-- 3D Thumbnail -->
      <button
        @click="viewMode = '3d'"
        class="h-24 rounded-2xl border-2 transition-all overflow-hidden relative group"
        :class="
          viewMode === '3d'
            ? 'border-primary bg-stone-50'
            : 'border-transparent glass-panel hover:border-stone-300'
        "
      >
        <div class="absolute inset-0 flex items-center justify-center">
          <i
            class="ph ph-cube text-3xl"
            :class="viewMode === '3d' ? 'text-primary' : 'text-stone-400'"
          ></i>
        </div>
      </button>

      <!-- Gallery Thumbnails -->
      <button
        v-for="img in galleryImages"
        :key="img.id"
        @click="viewMode = img.id"
        class="h-24 rounded-2xl border-2 transition-all overflow-hidden relative group"
        :class="
          viewMode === img.id
            ? 'border-primary'
            : 'border-transparent glass-panel hover:border-stone-300'
        "
      >
        <img
          :src="img.src"
          class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

const container = ref(null); // Outer container (for sizing)
const canvasContainer = ref(null); // Inner 3D container
const loading = ref(true);
const modelViewerRef = ref(null);
const arModelSrc = ref(null);
const viewMode = ref("3d");

const galleryImages = [
  { id: "env1", src: "/images/env1.png", alt: "Salon moderne" },
  { id: "env2", src: "/images/env2.png", alt: "Ambiance soirée" },
  { id: "env3", src: "/images/env3.png", alt: "Cuisine" },
  { id: "env4", src: "/images/env4.png", alt: "Chambre" },
  { id: "env5", src: "/images/env5.png", alt: "Bureau" },
  { id: "env6", src: "/images/env6.png", alt: "Salon TV" },
  { id: "env7", src: "/images/env7.png", alt: "Entrée" },
  { id: "env8", src: "/images/env8.png", alt: "Bibliothèque" },
];

// CONFIGURATION (Units in Meters)
// Easy to modify dimensions here
// NOTE: Ces dimensions servent pour les lignes de mesure. Adaptez-les à votre modèle !
// CONFIGURATION (Units in Meters)
// Easy to modify dimensions here
// NOTE: Ces dimensions servent pour les lignes de mesure. Adaptez-les à votre modèle !
const dimensions = {
  width: 0.12, // 120mm
  height: 0.5, // 50mm
  depth: 0.08, // 80mm
};

let scene, camera, renderer, controls, rafId;
let productGroup;
let resizeObserver;

const launchAR = () => {
  console.log("Attempting to launch AR...");
  const isSecure = window.isSecureContext;
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (!isSecure && !isIOS) {
    alert(
      "Attention : La Réalité Augmentée sur Android nécessite une connexion sécurisée (HTTPS). Si vous êtes en local, utilisez localhost."
    );
  }
  if (modelViewerRef.value) {
    try {
      modelViewerRef.value.activateAR();
    } catch (e) {
      console.error("Failed to activate AR:", e);
      alert(
        "Impossible de lancer la RA. Vérifiez la compatibilité de votre appareil."
      );
    }
  }
};

const generateARModel = () => {
  if (!productGroup) return;
  const exporter = new GLTFExporter();
  exporter.parse(
    productGroup,
    (gltf) => {
      const blob = new Blob([gltf], { type: "application/octet-stream" });
      arModelSrc.value = URL.createObjectURL(blob);
    },
    (error) => {
      console.error("An error happened during GLTF export", error);
    },
    { binary: true }
  );
};

const init = () => {
  if (!container.value || !canvasContainer.value) return;

  scene = new THREE.Scene();
  scene.background = null;

  // ENVIRONMENT MAP (SKYBOX)
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('/images/skybox.png', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.environment = texture;
    scene.background = texture; // Visible background
    scene.backgroundBlurriness = 0.1; // Slight blur for depth
  }, undefined, (err) => {
    console.error("Skybox failed", err);
  });

  camera = new THREE.PerspectiveCamera(45, 1, 0.01, 10); 
  camera.position.set(0.2, 0.15, 0.25); 

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  renderer.domElement.style.outline = "none";
  renderer.toneMapping = THREE.ACESFilmicToneMapping; // Better lighting
  renderer.toneMappingExposure = 1.0;

  canvasContainer.value.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(0.5, 1.0, 0.7);
  scene.add(dirLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
  backLight.position.set(-0.5, 0, -0.5);
  scene.add(backLight);

  productGroup = new THREE.Group();
  scene.add(productGroup);

  const { width, height, depth } = dimensions;

  const objLoader = new OBJLoader();



  // DEBUG: Visual Logs (Using top-level function)

  objLoader.load(
    "/models/model.obj",
    (object) => {
      console.log("DEBUG: Model loaded. Processing...");

      const safeGroup = new THREE.Group();
      
      // Material final : Blanc mat moderne avec reflets
      // 0xffffff + roughness 0 = Miroir. Sans environnement = Noir.
      // Avec environnement, ça sera un miroir.
      // Pour un look "Plastique Blanc Brillant" : Roughness 0.1, Metalness 0.0
      // Pour un look "Céramique" : Roughness 0.2, Metalness 0.0
      const finalMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, 
        roughness: 0.15, 
        metalness: 0.1,  
        envMapIntensity: 1.5, // Booste les reflets de la skybox
        side: THREE.DoubleSide
      });

      object.traverse((child) => {
        if (child.isMesh) {
          const oldGeo = child.geometry;
          const newGeo = new THREE.BufferGeometry();
          
          if (oldGeo.attributes.position) {
            newGeo.setAttribute('position', new THREE.BufferAttribute(oldGeo.attributes.position.array, 3));
          }
          if (oldGeo.attributes.normal) {
            newGeo.setAttribute('normal', new THREE.BufferAttribute(oldGeo.attributes.normal.array, 3));
          } else {
             newGeo.computeVertexNormals();
          }
          if (oldGeo.attributes.uv) {
            newGeo.setAttribute('uv', new THREE.BufferAttribute(oldGeo.attributes.uv.array, 2));
          }
          if (oldGeo.index) {
            newGeo.setIndex(new THREE.BufferAttribute(oldGeo.index.array, 1));
          }
          
          const newMesh = new THREE.Mesh(newGeo, finalMaterial);
          newMesh.castShadow = true;
          newMesh.receiveShadow = true;
          safeGroup.add(newMesh);
        }
      });
      
      if (safeGroup.children.length === 0) {
         loading.value = false;
         return;
      }

      // --- AUTO-SCALING & CENTERING (GEOMETRY LEVEL) ---
      const box = new THREE.Box3().setFromObject(safeGroup);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      if (size.lengthSq() === 0) {
         loading.value = false;
         return;
      }

      // 1. HARD-CENTER GEOMETRIES
      safeGroup.children.forEach(mesh => {
         mesh.geometry.translate(-center.x, -center.y, -center.z);
      });
      
      // 2. Scale
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = dimensions.width; 
      const scaleFactor = targetSize / maxDim;

      safeGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
      
      // 3. Initial Rotation (Ajustez ici !)
      safeGroup.rotation.y = 0; // 45 degrés
      safeGroup.rotation.x = -Math.PI / 2; 
      safeGroup.rotation.z = 0;
      
      console.log(`Model scaled by: ${scaleFactor}`);

      productGroup.add(safeGroup);

      // 4. Dynamic Measurements from Bounding Box
      // On recalcule la box après scaling (approximatif car le scale est sur le groupe)
      // La taille visuelle est: size * scaleFactor
      const visualSize = size.clone().multiplyScalar(scaleFactor);
      const wHalf = visualSize.x * 0.5;
      const hHalf = visualSize.y * 0.35;
      const dHalf = visualSize.z * 0.7;

      // Width
      addMeasurement(
        new THREE.Vector3(-wHalf, -hHalf, dHalf + 0.015),
        new THREE.Vector3(wHalf, -hHalf, dHalf + 0.015),
        0.120,
        new THREE.Vector3(0, -2, 0)
      );

      // Height
      addMeasurement(
        new THREE.Vector3(wHalf + 0.015, hHalf, -dHalf),
        new THREE.Vector3(wHalf + 0.015, -hHalf, -dHalf),
        0.05,
        new THREE.Vector3(1, 0, 0)
      );

      // Depth
      addMeasurement(
        new THREE.Vector3(-wHalf - 0.015, hHalf, -dHalf),
        new THREE.Vector3(-wHalf - 0.015, hHalf, dHalf),
        0.08,
        new THREE.Vector3(-2, 0, 0)
      );

      loading.value = false;
      
      setTimeout(generateARModel, 500);
    },
    (xhr) => {
      // Progress
    },
    (error) => {
      console.error("DEBUG: Error loading OBJ:", error);
      loading.value = false;
    }
  );

  // 6. Measurements
  // Note: Les mesures ici sont basées sur les constantes 'dimensions'.
  // Si vous chargez un OBJ, vous devriez probablement ajuster ces points manuellement
  // ou les retirer si elles ne correspondent plus.
  const addMeasurement = (p1, p2, valMeters, offsetDir) => {
    const measureGroup = new THREE.Group();

    // Line
    const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });
    const mLine = new THREE.Line(lineGeo, lineMat);
    measureGroup.add(mLine);

    // Label
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 128;
    canvas.height = 64;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "Bold 24px Inter, sans-serif";
    ctx.fillStyle = "#101010";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const valMm = Math.round(valMeters * 1000); // Convert m to mm
    ctx.fillText(`${valMm} mm`, canvas.width / 2, canvas.height / 2);

    const tex = new THREE.CanvasTexture(canvas);
    const spriteMatAR = new THREE.SpriteMaterial({ map: tex });

    const sprite = new THREE.Sprite(spriteMatAR);
    sprite.scale.set(0.04, 0.02, 1); // 4cm wide label

    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const midZ = (p1.z + p2.z) / 2;

    sprite.position.set(
      midX + offsetDir.x * 0.01,
      midY + offsetDir.y * 0.01,
      midZ + offsetDir.z * 0.01
    );
    measureGroup.add(sprite);
    productGroup.add(measureGroup);
  };

  // 7. Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.minDistance = 0.1;
  controls.maxDistance = 1;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.0;

  controls.addEventListener("start", () => {
    controls.autoRotate = false;
  });

  // NOTE: loading.value est mis à false dans le callback du loader.
  // setTimeout(generateARModel, 500); <--- Déplacé dans le callback

  resizeObserver = new ResizeObserver(() => {
    if (!container.value || !renderer || !camera) return;
    const width = container.value.clientWidth;
    const height = container.value.clientHeight;
    if (width > 0 && height > 0) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }
  });
  resizeObserver.observe(container.value);

  const animate = () => {
    rafId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
};

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  if (arModelSrc.value) URL.revokeObjectURL(arModelSrc.value);
  if (resizeObserver) resizeObserver.disconnect(); // Disconnect the ResizeObserver
  if (rafId) cancelAnimationFrame(rafId);
  if (renderer) renderer.dispose();
  // Optional: clean up geometries/materials
});
</script>
