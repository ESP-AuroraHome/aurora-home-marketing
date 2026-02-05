<template>
  <div class="pt-8 animate-fade-in">
    <div class="grid lg:grid-cols-2 gap-12 items-start">
      <!-- Visuals -->
      <div class="space-y-4">
        <!-- Product Visualization -->
        <div>
          <Product3DViewer />
        </div>
      </div>

      <!-- Product Details -->
      <div class="space-y-8">
        <div>
          <h1 class="text-4xl font-bold text-stone-800 mb-2">Aurora One</h1>
          <p class="text-xl text-stone-500">
            Station de surveillance climatique
          </p>
        </div>

        <div class="text-3xl font-light">89,00 €</div>

        <p class="text-stone-600 leading-relaxed">
          Le boîtier Aurora One regroupe les meilleurs capteurs du marché dans
          un écrin minimaliste. Il vous avertit quand aérer, surveille
          l'humidité pour protéger vos murs, et optimise votre éclairage.
        </p>

        <!-- Tech Specs -->
        <div class="space-y-3">
          <div
            class="flex items-center justify-between border-b border-stone-200 py-2"
          >
            <span class="text-stone-500">Capteur CO2</span>
            <span class="font-medium">Sensirion SCD30 (NDIR)</span>
          </div>
          <div
            class="flex items-center justify-between border-b border-stone-200 py-2"
          >
            <span class="text-stone-500">Temp/Humidité/Pression</span>
            <span class="font-medium">Bosch BME280</span>
          </div>
          <div
            class="flex items-center justify-between border-b border-stone-200 py-2"
          >
            <span class="text-stone-500">Luminosité</span>
            <span class="font-medium">BH1750 (Lux)</span>
          </div>
          <div
            class="flex items-center justify-between border-b border-stone-200 py-2"
          >
            <span class="text-stone-500">Connectivité</span>
            <span class="font-medium">WiFi 2.4Ghz (ESP32)</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-6">
          <button
            @click="addToCartAndGo"
            class="w-full py-4 rounded-xl bg-stone-800 text-white font-bold hover:bg-stone-700 transition-all flex justify-center items-center gap-2"
          >
            <i class="ph ph-plus"></i> Ajouter au panier
          </button>
          <p class="text-center text-xs text-stone-400 mt-3">
            <i class="ph ph-check-circle"></i> Garantie 2 ans &middot; 30 jours
            pour changer d'avis
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { store } from "../stores/cart.js";
import { useRouter } from "vue-router";
import Product3DViewer from "../components/Product3DViewer.vue";

const router = useRouter();

const addToCartAndGo = () => {
  store.addToCart();
  router.push("/cart");
};
</script>
