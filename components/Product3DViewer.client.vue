<template>
  <div class="space-y-4">
    <div
      ref="containerRef"
      class="aspect-square glass-panel rounded-3xl relative overflow-hidden bg-stone-100"
    >
      <div
        v-if="loading && viewMode === '3d'"
        class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      >
        <i class="ph ph-spinner animate-spin text-2xl text-stone-400"/>
      </div>

      <div
        v-show="viewMode === '3d'"
        ref="canvasContainerRef"
        class="w-full h-full relative cursor-move"
      >
        <button
          v-if="arModelSrc"
          title="Voir chez vous (RA)"
          class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-stone-900/10 backdrop-blur-md border border-white/20 rounded-full text-stone-600 hover:bg-stone-900 hover:text-white hover:scale-105 transition-all duration-300 z-20"
          @click="launchAR"
        >
          <i class="ph ph-cube-focus text-lg"/>
        </button>

        <div
          class="absolute bottom-4 left-4 right-4 text-center pointer-events-none z-10"
        >
          <span class="text-xs text-stone-500 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm shadow-sm">
            Cliquez et glissez pour tourner &middot; Molette pour zoomer
          </span>
        </div>

        <model-viewer
          v-if="arModelSrc"
          ref="modelViewerRef"
          :src="arModelSrc"
          ar
          ar-scale="fixed"
          ar-modes="webxr quick-look"
          camera-controls
          auto-rotate
          style="position:absolute;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-1"
        />
      </div>

      <template v-for="img in galleryImages" :key="img.id">
        <img
          v-if="viewMode === img.id"
          :src="img.src"
          class="w-full h-full object-cover animate-fade-in"
          :alt="img.alt"
        >
      </template>

      <button
        v-if="viewMode !== '3d'"
        class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-sm font-medium text-stone-800 hover:bg-white transition-all transform hover:scale-105 flex items-center gap-2"
        @click="viewMode = '3d'"
      >
        <i class="ph ph-cube"/>
        Retour à la vue 3D
      </button>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <button
        class="h-24 rounded-2xl border-2 transition-all overflow-hidden relative"
        :class="viewMode === '3d' ? 'border-stone-800 bg-stone-50' : 'border-transparent glass-panel hover:border-stone-300'"
        @click="viewMode = '3d'"
      >
        <div class="absolute inset-0 flex items-center justify-center">
          <i
            class="ph ph-cube text-3xl"
            :class="viewMode === '3d' ? 'text-stone-800' : 'text-stone-400'"
          />
        </div>
      </button>

      <button
        v-for="img in galleryImages"
        :key="img.id"
        class="h-24 rounded-2xl border-2 transition-all overflow-hidden relative"
        :class="viewMode === img.id ? 'border-stone-800' : 'border-transparent glass-panel hover:border-stone-300'"
        @click="viewMode = img.id"
      >
        <img
          :src="img.src"
          class="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
          :alt="img.alt"
        >
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

interface GalleryImage {
  id: string
  src: string
  alt: string
}

interface Dimensions {
  width: number
  height: number
  depth: number
}

const containerRef = ref<HTMLDivElement | null>(null)
const canvasContainerRef = ref<HTMLDivElement | null>(null)
const modelViewerRef = ref<HTMLElement & { activateAR(): void } | null>(null)

const loading = ref(true)
const arModelSrc = ref<string | null>(null)
const viewMode = ref<string>('3d')

const galleryImages: GalleryImage[] = [
  { id: 'env1', src: '/images/env1.png', alt: 'Salon moderne' },
  { id: 'env2', src: '/images/env2.png', alt: 'Ambiance soirée' },
  { id: 'env3', src: '/images/env3.png', alt: 'Cuisine' },
  { id: 'env4', src: '/images/env4.png', alt: 'Chambre' },
  { id: 'env5', src: '/images/env5.png', alt: 'Bureau' },
  { id: 'env6', src: '/images/env6.png', alt: 'Salon TV' },
  { id: 'env7', src: '/images/env7.png', alt: 'Entrée' },
  { id: 'env8', src: '/images/env8.png', alt: 'Bibliothèque' },
]

const dimensions: Dimensions = {
  width: 0.12,
  height: 0.05,
  depth: 0.08,
}

let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let controls: OrbitControls | null = null
let productGroup: THREE.Group | null = null
let rafId: number | null = null
let resizeObserver: ResizeObserver | null = null

/**
 * Activates the WebXR / Quick Look AR session via the hidden `<model-viewer>` element.
 */
function launchAR(): void {
  if (!modelViewerRef.value) return
  try {
    modelViewerRef.value.activateAR()
  } catch {
    alert('Impossible de lancer la RA. Vérifiez la compatibilité de votre appareil.')
  }
}

/**
 * Exports the current `productGroup` to a binary GLTF blob and stores its object URL
 * in `arModelSrc` so the `<model-viewer>` element can use it for AR.
 */
function generateARModel(): void {
  if (!productGroup) return
  const exporter = new GLTFExporter()
  exporter.parse(
    productGroup,
    (gltf: ArrayBuffer | { [key: string]: unknown }) => {
      const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' })
      arModelSrc.value = URL.createObjectURL(blob)
    },
    (error: ErrorEvent) => {
      console.error('GLTF export error', error)
    },
    { binary: true },
  )
}

/**
 * Adds a dimensional annotation (line + canvas label) to the scene.
 *
 * @param p1 - Start point of the measurement line.
 * @param p2 - End point of the measurement line.
 * @param valMeters - The real-world measurement value in metres.
 * @param offsetDir - Direction vector used to offset the label sprite from the midpoint.
 */
function addMeasurement(
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  valMeters: number,
  offsetDir: THREE.Vector3,
): void {
  if (!productGroup) return

  const measureGroup = new THREE.Group()

  const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2])
  const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 })
  measureGroup.add(new THREE.Line(lineGeo, lineMat))

  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.font = 'Bold 24px Inter, sans-serif'
    ctx.fillStyle = '#101010'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${Math.round(valMeters * 1000)} mm`, 64, 32)
  }

  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas) }))
  sprite.scale.set(0.04, 0.02, 1)
  sprite.position.set(
    (p1.x + p2.x) / 2 + offsetDir.x * 0.01,
    (p1.y + p2.y) / 2 + offsetDir.y * 0.01,
    (p1.z + p2.z) / 2 + offsetDir.z * 0.01,
  )
  measureGroup.add(sprite)
  productGroup.add(measureGroup)
}

/**
 * Bootstraps the Three.js scene: camera, renderer, lights, skybox, OBJ model,
 * OrbitControls, measurement annotations, and the render loop.
 */
function init(): void {
  const container = containerRef.value
  const canvasContainer = canvasContainerRef.value
  if (!container || !canvasContainer) return

  scene = new THREE.Scene()
  scene.background = null

  const textureLoader = new THREE.TextureLoader()
  textureLoader.load(
    '/images/skybox.png',
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      texture.colorSpace = THREE.SRGBColorSpace
      scene!.environment = texture
      scene!.background = texture
      scene!.backgroundBlurriness = 0.1
    },
  )

  camera = new THREE.PerspectiveCamera(45, 1, 0.01, 10)
  camera.position.set(0.2, 0.15, 0.25)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;outline:none'
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  canvasContainer.appendChild(renderer.domElement)

  scene.add(new THREE.AmbientLight(0xffffff, 0.6))

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(0.5, 1.0, 0.7)
  scene.add(dirLight)

  const backLight = new THREE.DirectionalLight(0xffffff, 0.3)
  backLight.position.set(-0.5, 0, -0.5)
  scene.add(backLight)

  productGroup = new THREE.Group()
  scene.add(productGroup)

  const finalMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.1,
    envMapIntensity: 1.5,
    side: THREE.DoubleSide,
  })

  const objLoader = new OBJLoader()
  objLoader.load(
    '/models/model.obj',
    (object) => {
      const safeGroup = new THREE.Group()

      object.traverse((child: THREE.Object3D) => {
        if (!(child instanceof THREE.Mesh)) return
        const oldGeo = child.geometry as THREE.BufferGeometry
        const newGeo = new THREE.BufferGeometry()

        if (oldGeo.attributes['position']) {
          newGeo.setAttribute('position', new THREE.BufferAttribute((oldGeo.attributes['position'] as THREE.BufferAttribute).array, 3))
        }
        if (oldGeo.attributes['normal']) {
          newGeo.setAttribute('normal', new THREE.BufferAttribute((oldGeo.attributes['normal'] as THREE.BufferAttribute).array, 3))
        } else {
          newGeo.computeVertexNormals()
        }
        if (oldGeo.attributes['uv']) {
          newGeo.setAttribute('uv', new THREE.BufferAttribute((oldGeo.attributes['uv'] as THREE.BufferAttribute).array, 2))
        }
        if (oldGeo.index) {
          newGeo.setIndex(new THREE.BufferAttribute(oldGeo.index.array, 1))
        }

        const mesh = new THREE.Mesh(newGeo, finalMaterial)
        mesh.castShadow = true
        mesh.receiveShadow = true
        safeGroup.add(mesh)
      })

      if (safeGroup.children.length === 0) {
        loading.value = false
        return
      }

      const box = new THREE.Box3().setFromObject(safeGroup)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())

      if (size.lengthSq() === 0) {
        loading.value = false
        return
      }

      safeGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.translate(-center.x, -center.y, -center.z)
        }
      })

      const scaleFactor = dimensions.width / Math.max(size.x, size.y, size.z)
      safeGroup.scale.setScalar(scaleFactor)
      safeGroup.rotation.set(-Math.PI / 2, 0, 0)

      productGroup!.add(safeGroup)

      const vs = size.clone().multiplyScalar(scaleFactor)
      const wh = vs.x * 0.5
      const hh = vs.y * 0.35
      const dh = vs.z * 0.7

      addMeasurement(
        new THREE.Vector3(-wh, -hh, dh + 0.015),
        new THREE.Vector3(wh, -hh, dh + 0.015),
        0.12,
        new THREE.Vector3(0, -2, 0),
      )
      addMeasurement(
        new THREE.Vector3(wh + 0.015, hh, -dh),
        new THREE.Vector3(wh + 0.015, -hh, -dh),
        0.05,
        new THREE.Vector3(1, 0, 0),
      )
      addMeasurement(
        new THREE.Vector3(-wh - 0.015, hh, -dh),
        new THREE.Vector3(-wh - 0.015, hh, dh),
        0.08,
        new THREE.Vector3(-2, 0, 0),
      )

      loading.value = false
      setTimeout(generateARModel, 500)
    },
    undefined,
    () => {
      loading.value = false
    },
  )

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enableZoom = true
  controls.minDistance = 0.1
  controls.maxDistance = 1
  controls.autoRotate = true
  controls.autoRotateSpeed = 2.0
  controls.addEventListener('start', () => {
    if (controls) controls.autoRotate = false
  })

  resizeObserver = new ResizeObserver(() => {
    if (!container || !renderer || !camera) return
    const w = container.clientWidth
    const h = container.clientHeight
    if (w > 0 && h > 0) {
      camera!.aspect = w / h
      camera!.updateProjectionMatrix()
      renderer!.setSize(w, h, false)
    }
  })
  resizeObserver.observe(container)

  const animate = () => {
    rafId = requestAnimationFrame(animate)
    controls!.update()
    renderer!.render(scene!, camera!)
  }
  animate()
}

onMounted(init)

onBeforeUnmount(() => {
  if (arModelSrc.value) URL.revokeObjectURL(arModelSrc.value)
  resizeObserver?.disconnect()
  if (rafId !== null) cancelAnimationFrame(rafId)
  renderer?.dispose()
})
</script>
