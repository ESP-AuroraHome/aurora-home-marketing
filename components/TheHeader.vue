<template>
  <nav class="sticky top-4 z-50 px-4 md:w-[645px] md:px-[22px] md:mx-auto">
    <ClientOnly>
      <svg color-interpolation-filters="sRGB" style="display: none">
        <defs>
          <filter id="header-bar-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blurred_source" />
            <feImage
              :href="'/images/liquid-glass/header_bar_displacement.png'"
              x="-285"
              y="0"
              width="1000"
              height="48"
              result="displacement_map"
            />
            <feDisplacementMap
              in="blurred_source"
              in2="displacement_map"
              scale="54.97305784439829"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feColorMatrix in="displaced" type="saturate" result="displaced_saturated" values="4" />
            <feImage
              :href="'/images/liquid-glass/header_bar_specular.png'"
              x="-285"
              y="0"
              width="1000"
              height="48"
              result="specular_layer"
            />
            <feComposite
              in="displaced_saturated"
              in2="specular_layer"
              operator="in"
              result="specular_saturated"
            />
            <feComponentTransfer in="specular_layer" result="specular_faded">
              <feFuncA type="linear" slope="1" />
            </feComponentTransfer>
            <feBlend in="specular_saturated" in2="displaced" mode="normal" result="withSaturation" />
            <feBlend in="specular_faded" in2="withSaturation" mode="normal" />
          </filter>
        </defs>
      </svg>
    </ClientOnly>

    <div class="relative h-12 mb-2 md:mb-6">
      <div
        class="hidden md:block rounded-3xl h-full shadow-sm"
        style="
          backdrop-filter: url(#header-bar-filter);
          aspect-ratio: 1000 / 48;
          width: 430px;
          transform: scale(1.5);
          margin-inline: auto;
        "
      />

      <div
        class="md:hidden absolute inset-0 rounded-2xl backdrop-blur-md bg-white/60 shadow-sm border border-white/40"
      />

      <div
        class="absolute top-0 left-0 right-0 flex justify-between items-center px-1"
        style="height: 100%"
      >
        <NuxtLink to="/" class="flex items-center gap-2 cursor-pointer group">
          <div class="w-8 h-8 rounded-xl bg-stone-800 flex items-center justify-center p-1.5">
            <img :src="'/logo.png'" alt="AuroraHome" class="w-full h-full object-contain" >
          </div>
          <span class="font-medium text-lg tracking-tight text-stone-800">AuroraHome</span>
        </NuxtLink>

        <div class="hidden md:flex gap-6 text-sm font-medium text-stone-500">
          <NuxtLink to="/product" active-class="text-stone-900" class="hover:text-stone-900 transition-colors">
            Le Boîtier
          </NuxtLink>
          <a
            href="https://aurora-home-documentation.vercel.app/fr/docs"
            target="_blank"
            class="hover:text-stone-900 transition-colors"
          >
            Documentation
          </a>
          <NuxtLink to="/about" active-class="text-stone-900" class="hover:text-stone-900 transition-colors">
            À Propos
          </NuxtLink>
        </div>

        <div class="flex items-center gap-1">
          <NuxtLink
            to="/cart"
            class="relative w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors text-stone-900"
          >
            <i class="ph ph-shopping-bag text-xl" />
            <span
              v-if="cartCount > 0"
              class="absolute top-1 right-1 w-4 h-4 bg-stone-800 text-white text-[10px] flex items-center justify-center rounded-full"
            >
              {{ cartCount }}
            </span>
          </NuxtLink>

          <button
            class="hidden md:block px-5 py-2 rounded-3xl bg-stone-800 text-white text-sm font-medium hover:bg-stone-700 transition-all shadow-lg shadow-stone-200"
            @click="buyNow"
          >
            Acheter
          </button>

          <button
            class="md:hidden w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors text-stone-900"
            @click="menuOpen = !menuOpen"
          >
            <i :class="menuOpen ? 'ph ph-x' : 'ph ph-list'" class="text-xl" />
          </button>
        </div>
      </div>
    </div>

    <Transition name="menu">
      <div
        v-if="menuOpen"
        class="md:hidden rounded-2xl backdrop-blur-md bg-white/70 border border-white/40 shadow-sm px-4 py-3 flex flex-col gap-1"
      >
        <NuxtLink
          to="/product"
          active-class="text-stone-900 bg-white/60"
          class="text-sm font-medium text-stone-500 hover:text-stone-900 hover:bg-white/60 px-3 py-2.5 rounded-xl transition-all"
          @click="menuOpen = false"
        >
          Le Boîtier
        </NuxtLink>
        <a
          href="https://aurora-home-documentation.vercel.app/fr/docs"
          target="_blank"
          class="text-sm font-medium text-stone-500 hover:text-stone-900 hover:bg-white/60 px-3 py-2.5 rounded-xl transition-all"
          @click="menuOpen = false"
        >
          Documentation
        </a>
        <NuxtLink
          to="/about"
          active-class="text-stone-900 bg-white/60"
          class="text-sm font-medium text-stone-500 hover:text-stone-900 hover:bg-white/60 px-3 py-2.5 rounded-xl transition-all"
          @click="menuOpen = false"
        >
          À Propos
        </NuxtLink>
        <div class="border-t border-stone-200/60 mt-1 pt-2">
          <button
            class="w-full py-2.5 rounded-xl bg-stone-800 text-white text-sm font-medium hover:bg-stone-700 transition-all"
            @click="buyNowMobile"
          >
            Acheter
          </button>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()
const router = useRouter()
const menuOpen = ref(false)

const cartCount = computed(() => cart.count)

/**
 * Adds the default Aurora One product to the cart and navigates to the cart page.
 */
function buyNow(): void {
  cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
  router.push('/cart')
}

/**
 * Mobile variant of buyNow — closes the menu before navigating.
 */
function buyNowMobile(): void {
  menuOpen.value = false
  buyNow()
}
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
