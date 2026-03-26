<template>
  <div class="pt-8 animate-fade-in">
    <div class="grid lg:grid-cols-2 gap-12 items-start">
      <div class="space-y-4">
        <ClientOnly>
          <Product3DViewer />
          <template #fallback>
            <div class="w-full h-96 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
              <i class="ph ph-cube text-4xl"/>
            </div>
          </template>
        </ClientOnly>
      </div>

      <div class="space-y-8">
        <div>
          <h1 class="text-4xl font-bold text-stone-800 mb-2">Aurora One</h1>
          <p class="text-xl text-stone-500">Station de surveillance climatique</p>
        </div>

        <div class="text-3xl font-light">89,00 €</div>

        <p class="text-stone-600 leading-relaxed">
          Le boîtier Aurora One regroupe les meilleurs capteurs du marché dans un écrin minimaliste.
          Il vous avertit quand aérer, surveille l'humidité pour protéger vos murs, et optimise
          votre éclairage.
        </p>

        <div class="space-y-3">
          <div class="flex items-center justify-between border-b border-stone-200 py-2">
            <span class="text-stone-500">Capteur CO2</span>
            <span class="font-medium">Sensirion SCD30 (NDIR)</span>
          </div>
          <div class="flex items-center justify-between border-b border-stone-200 py-2">
            <span class="text-stone-500">Temp/Humidité/Pression</span>
            <span class="font-medium">Bosch BME280</span>
          </div>
          <div class="flex items-center justify-between border-b border-stone-200 py-2">
            <span class="text-stone-500">Luminosité</span>
            <span class="font-medium">BH1750 (Lux)</span>
          </div>
          <div class="flex items-center justify-between border-b border-stone-200 py-2">
            <span class="text-stone-500">Connectivité</span>
            <span class="font-medium">WiFi 2.4Ghz (ESP32)</span>
          </div>
        </div>

        <div class="pt-6">
          <button
            class="w-full py-4 rounded-xl bg-stone-800 text-white font-bold hover:bg-stone-700 transition-all flex justify-center items-center gap-2"
            @click="addToCartAndGo"
          >
            <i class="ph ph-plus"/> Ajouter au panier
          </button>
          <p class="text-center text-xs text-stone-400 mt-3">
            <i class="ph ph-check-circle"/> Garantie 2 ans &middot; 30 jours pour changer d'avis
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()
const router = useRouter()

/**
 * Adds the Aurora One product to the cart and navigates to the cart page.
 */
function addToCartAndGo(): void {
  cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
  router.push('/cart')
}
</script>
