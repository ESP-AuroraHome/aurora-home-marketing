<template>
  <div class="pt-8 max-w-2xl mx-auto animate-fade-in">
    <!-- CART VIEW -->
    <section v-if="view === 'cart'">
      <h2 class="text-2xl font-bold mb-8">Votre Panier</h2>

      <div
        v-if="store.cart.length === 0"
        class="text-center py-12 glass-panel rounded-2xl"
      >
        <i class="ph ph-shopping-bag-open text-4xl text-stone-300 mb-4"></i>
        <p class="text-stone-500 mb-4">Votre panier est vide.</p>
        <router-link to="/product" class="text-stone-800 font-medium underline"
          >Retourner à la boutique</router-link
        >
      </div>

      <div v-else class="space-y-6">
        <!-- Cart Items -->
        <div
          v-for="(item, index) in store.cart"
          :key="index"
          class="glass-panel p-4 rounded-xl flex justify-between items-center"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 bg-white/50 rounded-lg flex items-center justify-center text-stone-300"
            >
              <i class="ph ph-cube text-2xl"></i>
            </div>
            <div>
              <h3 class="font-semibold text-stone-800">{{ item.name }}</h3>
              <p class="text-sm text-stone-500">Édition Blanc Polaire</p>
            </div>
          </div>
          <div class="text-right">
            <div class="font-medium">{{ item.price }} €</div>
            <button
              @click="store.removeFromCart(index)"
              class="text-xs text-red-400 hover:text-red-600 underline mt-1"
            >
              Supprimer
            </button>
          </div>
        </div>

        <!-- Total -->
        <div class="flex justify-between items-center py-4 text-xl font-bold">
          <span>Total</span>
          <span>{{ cartTotal }} €</span>
        </div>

        <button
          @click="view = 'checkout'"
          class="w-full py-4 rounded-xl bg-stone-800 text-white font-bold hover:bg-stone-700 shadow-lg"
        >
          Passer la commande
        </button>
      </div>
    </section>

    <!-- CHECKOUT VIEW -->
    <section v-else-if="view === 'checkout'">
      <button
        @click="view = 'cart'"
        class="text-stone-500 text-sm mb-6 flex items-center gap-1 hover:text-stone-800"
      >
        <i class="ph ph-arrow-left"></i> Retour au panier
      </button>

      <h2 class="text-2xl font-bold mb-8">Livraison</h2>

      <form @submit.prevent="view = 'payment'" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-stone-500 uppercase ml-1"
              >Prénom</label
            >
            <input
              type="text"
              required
              class="glass-input w-full"
              placeholder="Antoine"
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-stone-500 uppercase ml-1"
              >Nom</label
            >
            <input
              type="text"
              required
              class="glass-input w-full"
              placeholder="Dupont"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-semibold text-stone-500 uppercase ml-1"
            >Adresse</label
          >
          <input
            type="text"
            required
            class="glass-input w-full"
            placeholder="12 rue de la Paix"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-stone-500 uppercase ml-1"
              >Code Postal</label
            >
            <input
              type="text"
              required
              class="glass-input w-full"
              placeholder="75000"
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-stone-500 uppercase ml-1"
              >Ville</label
            >
            <input
              type="text"
              required
              class="glass-input w-full"
              placeholder="Paris"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-semibold text-stone-500 uppercase ml-1"
            >Email</label
          >
          <input
            type="email"
            required
            class="glass-input w-full"
            placeholder="antoine@example.com"
          />
        </div>

        <button
          type="submit"
          class="w-full py-4 rounded-xl bg-stone-800 text-white font-bold hover:bg-stone-700 shadow-lg mt-8"
        >
          Continuer vers le paiement
        </button>
      </form>
    </section>

    <!-- PAYMENT VIEW -->
    <section v-else-if="view === 'payment'">
      <button
        @click="view = 'checkout'"
        class="text-stone-500 text-sm mb-6 flex items-center gap-1 hover:text-stone-800"
      >
        <i class="ph ph-arrow-left"></i> Retour livraison
      </button>

      <h2 class="text-2xl font-bold mb-8">Paiement Sécurisé</h2>

      <div class="glass-panel p-8 rounded-2xl space-y-6">
        <div
          class="flex justify-between items-center text-sm text-stone-500 pb-4 border-b border-stone-200"
        >
          <span>Montant à payer</span>
          <span class="text-xl font-bold text-stone-800"
            >{{ cartTotal }} €</span
          >
        </div>

        <!-- Mock Card Element -->
        <div class="space-y-4">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-stone-500 uppercase ml-1"
              >Numéro de carte</label
            >
            <div class="glass-input flex items-center gap-2 bg-white/70">
              <i class="ph ph-credit-card text-stone-400"></i>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                class="bg-transparent w-full outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-stone-500 uppercase ml-1"
                >Expiration</label
              >
              <input
                type="text"
                placeholder="MM/AA"
                class="glass-input w-full bg-white/70"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-stone-500 uppercase ml-1"
                >CVC</label
              >
              <input
                type="text"
                placeholder="123"
                class="glass-input w-full bg-white/70"
              />
            </div>
          </div>
        </div>

        <button
          @click="processPayment"
          class="w-full py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg flex justify-center items-center gap-2"
        >
          <span v-if="!isProcessing">Payer {{ cartTotal }} €</span>
          <span v-else class="animate-pulse">Traitement...</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { store } from "../stores/cart.js";
import { useRouter } from "vue-router";

const router = useRouter();
const view = ref("cart");
const isProcessing = ref(false);

const cartTotal = computed(() => store.cartTotal);

const processPayment = () => {
  isProcessing.value = true;
  setTimeout(() => {
    alert("Paiement validé ! Merci pour votre commande (Simulation).");
    store.clearCart();
    isProcessing.value = false;
    router.push("/");
  }, 2000);
};
</script>
