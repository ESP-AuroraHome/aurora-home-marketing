<template>
  <nav
  class="sticky top-4 z-50"
  style="
    width: 645px;
    margin-inline: auto;
    padding-inline: 22px;"
  >
    <svg color-interpolation-filters="sRGB" style="display: none;">
      <defs>
        <filter id="header-bar-filter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blurred_source"></feGaussianBlur>
          <feImage href="/images/liquid-glass/header_bar_displacement.png" x="-285" y="0" width="1000" height="48" result="displacement_map"></feImage>
          <feDisplacementMap in="blurred_source" in2="displacement_map" scale="54.97305784439829" xChannelSelector="R" yChannelSelector="G" result="displaced"></feDisplacementMap>
          <feColorMatrix in="displaced" type="saturate" result="displaced_saturated" values="4"></feColorMatrix>
          <feImage href="/images/liquid-glass/header_bar_specular.png" x="-285" y="0" width="1000" height="48" result="specular_layer"></feImage>
          <feComposite in="displaced_saturated" in2="specular_layer" operator="in" result="specular_saturated"></feComposite>
          <feComponentTransfer in="specular_layer" result="specular_faded"><feFuncA type="linear" slope="1"></feFuncA>
          </feComponentTransfer><feBlend in="specular_saturated" in2="displaced" mode="normal" result="withSaturation"></feBlend>
          <feBlend in="specular_faded" in2="withSaturation" mode="normal"></feBlend>
        </filter>
      </defs>
    </svg>
    <div class="relative max-w-6xl h-12 mx-auto mb-6">
      <div
        class="rounded-3xl h-full shadow-sm"
        style="backdrop-filter: url(#header-bar-filter);
        aspect-ratio: 1000 / 48;
        width: 430px;
        transform: scale(1.5);
        margin-inline: auto;"
      ></div>

      <div class="absolute top-0 left-0 right-0 flex justify-between items-center" style="
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: space-between;
        height: 100%;
      ">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 cursor-pointer group">
          <div
            class="w-8 h-8 rounded-3xl bg-stone-800 text-white flex items-center justify-center"
          >
            <i class="ph-fill ph-house text-xl"></i>
          </div>
          <span class="font-medium text-lg tracking-tight text-stone-800"
            >AuroraHome</span
          >
        </router-link>

        <!-- Desktop Menu -->
        <div class="hidden md:flex gap-2 text-sm font-medium text-stone-500">
          <router-link
            to="/product"
            active-class="text-stone-900"
            class="hover:text-stone-900 transition-colors"
            >Le Boîtier</router-link
          >

          <router-link
            to="/docs"
            active-class="text-stone-900"
            class="hover:text-stone-900 transition-colors"
            >Documentation</router-link
          >

          <router-link
            to="/about"
            active-class="text-stone-900"
            class="hover:text-stone-900 transition-colors"
            >À Propos</router-link
          >
        </div>

        <!-- Cart/Actions -->
        <div class="flex items-center gap-4">
          <router-link
            to="/cart"
            class="relative w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors text-stone-900"
          >
              <i class="ph ph-shopping-bag text-xl"></i>
              <span
                v-if="cartCount > 0"
                class="absolute top-1 right-1 w-4 h-4 bg-stone-800 text-white text-[10px] flex items-center justify-center rounded-full"
              >
                {{ cartCount }}
              </span>
          </router-link>
          <button
            @click="buyAction"
            class="hidden md:block px-5 py-2 rounded-3xl bg-stone-800 text-white text-sm font-medium hover:bg-stone-700 transition-all shadow-lg shadow-stone-200"
          >
            Acheter
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { store } from "../stores/cart.js";
import { useRouter } from "vue-router";
import LiquidGlass from "../components/LiquidGlass.vue";

const router = useRouter();
const cartCount = computed(() => store.cartCount);

const buyAction = () => {
  store.addToCart();
  router.push("/cart");
};
</script>
