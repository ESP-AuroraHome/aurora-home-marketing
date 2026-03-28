<template>
  <div class="space-y-32">
    <section class="space-y-24 animate-fade-in-up relative z-10">
      <div class="pt-12 text-center space-y-8">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 bg-white/40 text-xs font-medium text-stone-500 uppercase tracking-wider backdrop-blur-sm"
        >
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          En stock
        </div>

        <h1 class="text-5xl md:text-7xl font-light tracking-tight text-stone-800">
          L'harmonie invisible <br />
          de votre <span class="text-gradient font-normal">intérieur</span>.
        </h1>

        <p class="text-xl text-stone-500 max-w-xl mx-auto font-light leading-relaxed">
          Aurora veille sur la qualité de l'air, la température et la lumière. Un objet design,
          open-source, qui prend soin de vous.
        </p>

        <div class="flex justify-center gap-4 pt-4">
          <NuxtLink
            to="/product"
            class="px-8 py-3 rounded-xl bg-stone-800 text-white font-medium hover:bg-stone-700 hover-lift shadow-xl shadow-stone-200/50 transition-all"
          >
            Découvrir Aurora (89€)
          </NuxtLink>
          <a
            href="https://aurora-home-documentation.vercel.app/fr/docs"
            target="_blank"
            class="px-8 py-3 rounded-xl glass-button text-stone-800 font-medium hover-lift"
          >
            Documentation
          </a>
        </div>

        <LiquidGlass
          id="hero-glass"
          class="relative mt-16 h-96 md:h-[500px] w-full max-w-4xl mx-auto rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl shadow-stone-200/50 reveal-on-scroll bg-white/20 backdrop-blur-xl border border-white/40"
        >
          <div class="absolute inset-0">
            <img
              :src="'/aurora-bg.png'"
              alt=""
              class="w-full h-full object-cover opacity-80 animate-aurora-slow"
            />
            <div class="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
          </div>

          <div class="absolute z-20 text-center select-none parallax-item" data-speed="0.05">
            <LiquidGlass
              class="p-6 md:p-8 rounded-[2rem] inline-block backdrop-blur-md border border-white/60 shadow-lg animate-float bg-white/40"
            >
              <i class="ph ph-plant text-3xl md:text-4xl text-green-600 mb-2 md:mb-4 block" />
              <div class="text-4xl md:text-5xl font-light text-stone-800">
                420 <span class="text-base md:text-lg text-stone-500">ppm</span>
              </div>
              <div class="text-xs md:text-sm text-stone-500 mt-2 uppercase tracking-wide">
                Qualité de l'air excellente
              </div>
            </LiquidGlass>
          </div>

          <div
            class="absolute left-4 md:left-20 top-10 md:top-20 z-10 text-center select-none parallax-item"
            data-speed="0.12"
          >
            <LiquidGlass
              class="p-4 md:p-6 rounded-[1.5rem] inline-block backdrop-blur-sm border border-white/40 shadow-md scale-90 md:scale-100 opacity-90 animate-float delay-1000 bg-white/40"
            >
              <i
                class="ph ph-thermometer text-2xl md:text-3xl text-orange-400 mb-1 md:mb-2 block"
              />
              <div class="text-xl md:text-3xl font-light text-stone-800">21.5°</div>
            </LiquidGlass>
          </div>

          <div
            class="absolute right-4 md:right-20 bottom-10 md:bottom-20 z-10 text-center select-none parallax-item"
            data-speed="0.08"
          >
            <LiquidGlass
              class="p-4 md:p-6 rounded-[1.5rem] inline-block backdrop-blur-sm border border-white/40 shadow-md scale-90 md:scale-100 opacity-90 animate-float delay-2000 bg-white/40"
            >
              <i class="ph ph-drop text-2xl md:text-3xl text-blue-400 mb-1 md:mb-2 block" />
              <div class="text-xl md:text-3xl font-light text-stone-800">45%</div>
            </LiquidGlass>
          </div>

          <div
            class="absolute right-8 md:right-16 top-8 md:top-12 z-0 text-center hidden sm:block select-none parallax-item"
            data-speed="0.15"
          >
            <LiquidGlass
              class="p-3 md:p-4 rounded-2xl inline-block backdrop-blur-sm border border-white/30 scale-75 md:scale-100 opacity-60 animate-float delay-1500 bg-white/30"
            >
              <i class="ph ph-speaker-high text-xl md:text-2xl text-purple-400 mb-1 block" />
              <div class="text-lg md:text-xl font-light text-stone-800">35dB</div>
            </LiquidGlass>
          </div>

          <div
            class="absolute left-8 md:left-16 bottom-8 md:bottom-12 z-0 text-center hidden sm:block select-none parallax-item"
            data-speed="0.18"
          >
            <LiquidGlass
              class="p-3 md:p-4 rounded-2xl inline-block backdrop-blur-sm border border-white/30 scale-75 md:scale-100 opacity-60 animate-float delay-2500 bg-white/30"
            >
              <i class="ph ph-sun text-xl md:text-2xl text-yellow-400 mb-1 block" />
              <div class="text-lg md:text-xl font-light text-stone-800">450lx</div>
            </LiquidGlass>
          </div>
        </LiquidGlass>
      </div>
    </section>

    <section class="reveal-on-scroll">
      <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h2 class="text-3xl font-light text-stone-800">Conçu pour la sérénité</h2>
        <p class="text-stone-500">Une technologie qui s'efface pour laisser place au bien-être.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <div
          class="glass-panel p-8 rounded-2xl hover:bg-white/60 hover-lift transition-all duration-500 text-center md:text-left stagger-delay-1"
        >
          <div
            class="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mb-6 mx-auto md:mx-0"
          >
            <i class="ph ph-eye-slash text-2xl text-stone-800" />
          </div>
          <h3 class="text-lg font-semibold mb-2">Discret &amp; Élégant</h3>
          <p class="text-stone-500 text-sm leading-relaxed">
            Conçu pour se fondre dans votre décoration. Pas de lumières clignotantes agressives,
            juste du pur design scandinave.
          </p>
        </div>

        <div
          class="glass-panel p-8 rounded-2xl hover:bg-white/60 hover-lift transition-all duration-500 text-center md:text-left stagger-delay-2"
        >
          <div
            class="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mb-6 mx-auto md:mx-0"
          >
            <i class="ph ph-lock-open text-2xl text-stone-800" />
          </div>
          <h3 class="text-lg font-semibold mb-2">100% Open Source</h3>
          <p class="text-stone-500 text-sm leading-relaxed">
            Pas de cloud obligatoire. Vos données restent chez vous. Le code est auditable par tous
            pour une transparence totale.
          </p>
        </div>

        <div
          class="glass-panel p-8 rounded-2xl hover:bg-white/60 hover-lift transition-all duration-500 text-center md:text-left stagger-delay-3"
        >
          <div
            class="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mb-6 mx-auto md:mx-0"
          >
            <i class="ph ph-sliders text-2xl text-stone-800" />
          </div>
          <h3 class="text-lg font-semibold mb-2">Plug &amp; Play</h3>
          <p class="text-stone-500 text-sm leading-relaxed">
            Pré-assemblé et calibré en France. Branchez-le, scannez le QR code, c'est prêt en moins
            de 2 minutes.
          </p>
        </div>
      </div>
    </section>

    <section class="reveal-on-scroll">
      <div class="relative glass-panel rounded-3xl p-8 md:p-12 overflow-hidden">
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -z-10 opacity-60"
        />
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <h2 class="text-3xl font-light text-stone-800">Installation simplifiée</h2>
            <div class="space-y-6">
              <div class="flex gap-4">
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center font-bold"
                >
                  1
                </div>
                <div>
                  <h4 class="font-medium text-stone-900">Déballez</h4>
                  <p class="text-sm text-stone-500">
                    Un packaging recyclable, sans plastique superflu.
                  </p>
                </div>
              </div>
              <div class="flex gap-4">
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold"
                >
                  2
                </div>
                <div>
                  <h4 class="font-medium text-stone-900">Branchez</h4>
                  <p class="text-sm text-stone-500">
                    USB-C standard. Compatible avec vos chargeurs existants.
                  </p>
                </div>
              </div>
              <div class="flex gap-4">
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold"
                >
                  3
                </div>
                <div>
                  <h4 class="font-medium text-stone-900">Respirez</h4>
                  <p class="text-sm text-stone-500">
                    L'app Aurora détecte automatiquement votre appareil.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="relative h-64 md:h-full bg-stone-100 rounded-2xl flex items-center justify-center overflow-hidden"
          >
            <img
              :src="'/images/app-detection.png'"
              alt="Application Aurora détectant l'appareil"
              class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="reveal-on-scroll">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-light text-stone-800">Ils respirent mieux</h2>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl bg-white border border-stone-100 shadow-sm">
          <div class="flex text-yellow-500 mb-3 text-sm">
            <i class="ph-fill ph-star" /><i class="ph-fill ph-star" /><i
              class="ph-fill ph-star"
            /><i class="ph-fill ph-star" /><i class="ph-fill ph-star" />
          </div>
          <p class="text-stone-600 text-sm mb-4">
            "Enfin un capteur qui n'est pas moche ! Il trône dans mon salon et tout le monde me
            demande ce que c'est."
          </p>
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-500"
            >
              S
            </div>
            <span class="text-xs font-medium text-stone-900">Sophie M.</span>
          </div>
        </div>

        <div class="p-6 rounded-2xl bg-white border border-stone-100 shadow-sm">
          <div class="flex text-yellow-500 mb-3 text-sm">
            <i class="ph-fill ph-star" /><i class="ph-fill ph-star" /><i
              class="ph-fill ph-star"
            /><i class="ph-fill ph-star" /><i class="ph-fill ph-star" />
          </div>
          <p class="text-stone-600 text-sm mb-4">
            "L'intégration HomeAssistant est native, rien à configurer. C'est exactement ce que je
            cherchais."
          </p>
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-500"
            >
              T
            </div>
            <span class="text-xs font-medium text-stone-900">Thomas L.</span>
          </div>
        </div>

        <div class="p-6 rounded-2xl bg-white border border-stone-100 shadow-sm hidden lg:block">
          <div class="flex text-yellow-500 mb-3 text-sm">
            <i class="ph-fill ph-star" /><i class="ph-fill ph-star" /><i
              class="ph-fill ph-star"
            /><i class="ph-fill ph-star" /><i class="ph-fill ph-star" />
          </div>
          <p class="text-stone-600 text-sm mb-4">
            "J'ai réalisé que mon bureau était mal ventilé. Depuis que je l'aère mieux, je suis plus
            concentrée."
          </p>
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-500"
            >
              C
            </div>
            <span class="text-xs font-medium text-stone-900">Camille D.</span>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-2xl mx-auto reveal-on-scroll">
      <h2 class="text-3xl font-light text-stone-800 text-center mb-10">Questions fréquentes</h2>
      <div class="space-y-4">
        <div class="glass-panel p-6 rounded-xl">
          <h3 class="font-medium text-stone-800 mb-2">Est-ce compatible HomeKit ?</h3>
          <p class="text-sm text-stone-500">
            Pas encore nativement, mais via HomeAssistant ou Homebridge, l'intégration est parfaite.
          </p>
        </div>
        <div class="glass-panel p-6 rounded-xl">
          <h3 class="font-medium text-stone-800 mb-2">Quelle est la durée de vie des capteurs ?</h3>
          <p class="text-sm text-stone-500">
            Le capteur CO2 NDIR a une durée de vie estimée à 15 ans. Il est remplaçable facilement.
          </p>
        </div>
        <div class="glass-panel p-6 rounded-xl">
          <h3 class="font-medium text-stone-800 mb-2">Puis-je l'utiliser sans WiFi ?</h3>
          <p class="text-sm text-stone-500">
            Oui, l'appareil indique la qualité de l'air via un anneau lumineux discret
            (configurable) même sans connexion.
          </p>
        </div>
      </div>
    </section>

    <section class="reveal-on-scroll">
      <div class="bg-stone-800 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full opacity-10">
          <div class="absolute top-[-50%] left-[-20%] w-160 h-160 rounded-full bg-white blur-3xl" />
        </div>
        <div class="relative z-10 space-y-6">
          <h2 class="text-3xl md:text-4xl font-light">
            Améliorez votre environnement dès aujourd'hui.
          </h2>
          <p class="text-stone-300 max-w-lg mx-auto">
            Rejoignez les 500+ utilisateurs qui ont choisi la transparence et le design.
          </p>
          <div class="pt-4">
            <NuxtLink
              to="/product"
              class="inline-block px-10 py-4 rounded-xl bg-white text-stone-900 font-bold hover:bg-stone-100 transition-colors shadow-2xl hover-lift"
            >
              Commander Aurora (89€)
            </NuxtLink>
          </div>
          <p class="text-xs text-stone-500 mt-4">
            Expédié sous 48h • Satisfait ou remboursé 30 jours
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
let cleanupParallax: (() => void) | null = null

onMounted(() => {
  initScrollReveal()
  cleanupParallax = initParallax()
})

onBeforeUnmount(() => {
  cleanupParallax?.()
})

/**
 * Attaches an IntersectionObserver that adds the `visible` class to every
 * `.reveal-on-scroll` element as it enters the viewport.
 */
function initScrollReveal(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el))
}

/**
 * Sets up mouse-parallax on the hero glass container.
 * Each `.parallax-item` has a `data-speed` attribute that controls displacement magnitude.
 *
 * @returns A cleanup function that removes all event listeners and cancels animation frames.
 */
function initParallax(): () => void {
  const container = document.getElementById('hero-glass') as HTMLElement
  if (!container) return () => {}

  interface ParallaxItem {
    el: HTMLElement
    speed: number
    cx: number
    cy: number
    baseX: number
    baseY: number
  }

  const items: ParallaxItem[] = Array.from(
    container.querySelectorAll<HTMLElement>('.parallax-item')
  ).map((el) => ({
    el,
    speed: parseFloat(el.dataset['speed'] ?? '0.05'),
    cx: 0,
    cy: 0,
    baseX: 0,
    baseY: 0,
  }))

  let containerWidth = 0
  let containerHeight = 0
  let containerOffsetLeft = 0
  let containerOffsetTop = 0
  let mouseX = 0
  let mouseY = 0
  let isHovering = false
  let animationFrameId: number | null = null
  let time = 0

  /**
   * Recomputes container geometry. Called once and on resize.
   */
  function updateLayout(): void {
    const rect = container.getBoundingClientRect()
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    containerWidth = rect.width
    containerHeight = rect.height
    containerOffsetLeft = rect.left + scrollX
    containerOffsetTop = rect.top + scrollY

    items.forEach((item) => {
      item.baseX = item.el.offsetLeft + item.el.offsetWidth / 2 - containerWidth / 2
      item.baseY = item.el.offsetTop + item.el.offsetHeight / 2 - containerHeight / 2
    })
  }

  setTimeout(updateLayout, 100)
  window.addEventListener('resize', updateLayout)

  /**
   * Linear interpolation helper.
   */
  function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor
  }

  /**
   * Runs one animation frame: applies wave-repulsion and lerp-smoothed translation.
   */
  function animate(): void {
    if (!document.body.contains(container)) {
      animationFrameId = null
      return
    }

    time += 0.05
    let needsUpdate = false

    items.forEach((item) => {
      let targetX = mouseX * item.speed
      let targetY = mouseY * item.speed

      if (isHovering) {
        const dx = mouseX - item.baseX
        const dy = mouseY - item.baseY
        const distSq = dx * dx + dy * dy
        const waveRadius = 300

        if (distSq < waveRadius * waveRadius) {
          const dist = Math.sqrt(distSq)
          const intensity = 1 - dist / waveRadius
          const force = intensity * 30
          const ripple = Math.sin(dist * 0.05 - time) * 5 * intensity

          if (dist > 0.1) {
            targetX -= (dx / dist) * force
            targetY -= (dy / dist) * force
          }
          targetY += ripple
          needsUpdate = true
        }
      }

      item.cx = lerp(item.cx, targetX, 0.08)
      item.cy = lerp(item.cy, targetY, 0.08)

      if (Math.abs(item.cx - targetX) > 0.01 || Math.abs(item.cy - targetY) > 0.01) {
        needsUpdate = true
      }

      item.el.style.transform = `translate3d(${item.cx.toFixed(2)}px, ${item.cy.toFixed(2)}px, 0)`
    })

    if (!needsUpdate && !isHovering) {
      animationFrameId = null
      return
    }

    animationFrameId = requestAnimationFrame(animate)
  }

  function startAnimation(): void {
    if (!animationFrameId) animate()
  }

  container.addEventListener('mousemove', (e: MouseEvent) => {
    isHovering = true
    mouseX = e.pageX - containerOffsetLeft - containerWidth / 2
    mouseY = e.pageY - containerOffsetTop - containerHeight / 2
    startAnimation()
  })

  container.addEventListener('mouseleave', () => {
    isHovering = false
    mouseX = 0
    mouseY = 0
  })

  return () => {
    window.removeEventListener('resize', updateLayout)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  }
}
</script>
