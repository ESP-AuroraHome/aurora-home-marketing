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
              <div class="flex items-center mt-2 space-x-2">
                 <button 
                  @click.stop="store.decreaseQuantity(index)"
                  class="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
                 > - </button>
                 <span class="text-xs font-semibold w-4 text-center">{{ item.quantity }}</span>
                 <button 
                  @click.stop="checkStockAndAdd(item)"
                  :disabled="isOutOfStock(item)"
                  class="w-6 h-6 rounded bg-stone-100 flex items-center justify-center text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{'hover:bg-stone-200': !isOutOfStock(item)}"
                 > + </button>
              </div>
              <p v-if="getProductStock(item.id) !== null" class="text-xs text-stone-400 mt-1">
                  Stock: {{ getProductStock(item.id) }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="font-medium">{{ (item.price * item.quantity).toFixed(2) }} €</div>
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
          @click="view = 'delivery'"
          class="w-full py-4 rounded-xl bg-stone-800 text-white font-bold hover:bg-stone-700 shadow-lg"
        >
          Passer la commande
        </button>
      </div>
    </section>

    <!-- DELIVERY VIEW -->
    <section v-else-if="view === 'delivery'">
        <button
            @click="view = 'cart'"
            class="text-stone-500 text-sm mb-6 flex items-center gap-1 hover:text-stone-800"
        >
            <i class="ph ph-arrow-left"></i> Retour au panier
        </button>

        <h2 class="text-2xl font-bold mb-8">Mode de Livraison</h2>

        <div class="space-y-4">
            <div 
                @click="deliveryType = 'standard'"
                class="glass-panel p-6 rounded-xl cursor-pointer transition-all border-2 flex justify-between items-center group"
                :class="deliveryType === 'standard' ? 'border-stone-800 bg-stone-50 shadow-md' : 'border-transparent hover:bg-white/60'"
            >
                <div class="flex items-center gap-4">
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                         :class="deliveryType === 'standard' ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-300 group-hover:border-stone-400'">
                        <i v-if="deliveryType === 'standard'" class="ph-bold ph-check text-xs"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-stone-800">Livraison Standard</h3>
                        <p class="text-sm text-stone-500">3-5 jours ouvrés</p>
                    </div>
                </div>
                <div class="font-bold text-stone-800">Gratuit</div>
            </div>

            <div 
                @click="deliveryType = 'express'"
                class="glass-panel p-6 rounded-xl cursor-pointer transition-all border-2 flex justify-between items-center group"
                :class="deliveryType === 'express' ? 'border-stone-800 bg-stone-50 shadow-md' : 'border-transparent hover:bg-white/60'"
            >
                <div class="flex items-center gap-4">
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                         :class="deliveryType === 'express' ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-300 group-hover:border-stone-400'">
                        <i v-if="deliveryType === 'express'" class="ph-bold ph-check text-xs"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-stone-800">Livraison Express</h3>
                        <p class="text-sm text-stone-500">24h-48h</p>
                    </div>
                </div>
                <div class="font-bold text-stone-800">10,00 €</div>
            </div>
        </div>

        <button
            @click="view = 'checkout'"
            class="w-full py-4 rounded-xl bg-stone-800 text-white font-bold hover:bg-stone-700 shadow-lg mt-8"
        >
            Continuer vers l'adresse
        </button>
    </section>

    <!-- CHECKOUT (ADDRESS) VIEW -->
    <section v-else-if="view === 'checkout'">
      <button
        @click="view = 'delivery'"
        class="text-stone-500 text-sm mb-6 flex items-center gap-1 hover:text-stone-800"
      >
        <i class="ph ph-arrow-left"></i> Retour livraison
      </button>

      <h2 class="text-2xl font-bold mb-8">Adresse</h2>

      <form @submit.prevent="proceedToPayment" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-stone-500 uppercase ml-1"
              >Prénom</label
            >
            <input
              v-model="formData.firstName"
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
              v-model="formData.lastName"
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
            v-model="formData.address"
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
              v-model="formData.zipCode"
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
              v-model="formData.city"
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
            v-model="formData.email"
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
        <i class="ph ph-arrow-left"></i> Retour adresse
      </button>

      <h2 class="text-2xl font-bold mb-8">Paiement Sécurisé</h2>

      <div class="glass-panel p-8 rounded-2xl space-y-6">
        <div
          class="flex justify-between items-center text-sm text-stone-500 pb-4 border-b border-stone-200"
        >
          <span>Sous-total</span>
          <span class="font-medium text-stone-800">{{ cartTotal }} €</span>
        </div>
        <div
          class="flex justify-between items-center text-sm text-stone-500 pb-4 border-b border-stone-200"
        >
          <span>Livraison ({{ deliveryType === 'express' ? 'Express' : 'Standard' }})</span>
          <span class="font-medium text-stone-800">{{ deliveryCost }} €</span>
        </div>
         <div
          class="flex justify-between items-center text-lg text-stone-800 pb-4 font-bold"
        >
          <span>Total à payer</span>
          <span>{{ finalTotal }} €</span>
        </div>

        <!-- Stripe Element Container -->
        <div id="payment-element" class="min-h-[200px]">
          <!-- Stripe will inject the UI here -->
          <div v-if="loadingStripe" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
          </div>
        </div>
        
        <div v-if="errorMessage" class="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100">
           {{ errorMessage }}
        </div>

        <button
          @click="processPayment"
          :disabled="isProcessing || !stripeLoaded"
          :class="{'opacity-50 cursor-not-allowed': isProcessing || !stripeLoaded}"
          class="w-full py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg flex justify-center items-center gap-2 transition-all"
        >
          <span v-if="!isProcessing">Payer {{ finalTotal }} €</span>
          <span v-else class="flex items-center gap-2">
             <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
             Traitement...
          </span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted } from "vue";
import { store } from "../stores/cart.js";
import { useRouter } from "vue-router";
import { initializeStripe, createPaymentIntent, confirmOrder, getProducts } from "../services/PaymentService";

const router = useRouter();
const view = ref("cart"); // 'cart', 'delivery', 'checkout', 'payment'
const isProcessing = ref(false);
const loadingStripe = ref(false);
const stripeLoaded = ref(false);
const errorMessage = ref("");
const deliveryType = ref('standard');
const productsStock = ref([]);

const formData = ref({
    firstName: '',
    lastName: '',
    address: '',
    zipCode: '',
    city: '',
    email: ''
});

// Load persistent data & Products
onMounted(async () => {
    const savedData = localStorage.getItem('checkout-form');
    if (savedData) {
        formData.value = JSON.parse(savedData);
    }
    // Fetch real-time stock
    productsStock.value = await getProducts();
});

// Watch and save persistent data
watch(formData, (newVal) => {
    localStorage.setItem('checkout-form', JSON.stringify(newVal));
}, { deep: true });

const getProductStock = (id) => {
    const product = productsStock.value.find(p => p.id === id);
    return product ? product.stock : null;
};

const isOutOfStock = (item) => {
    const stock = getProductStock(item.id);
    if (stock === null) return false;
    return item.quantity >= stock;
};

const checkStockAndAdd = (item) => {
    if (!isOutOfStock(item)) {
        store.addToCart(item);
    }
};

const cartTotal = computed(() => store.cartTotal);
const deliveryCost = computed(() => deliveryType.value === 'express' ? 10.00 : 0);
const finalTotal = computed(() => (parseFloat(cartTotal.value) + deliveryCost.value).toFixed(2));

let stripe = null;
let elements = null;

const proceedToPayment = async () => {
    view.value = 'payment';
    loadingStripe.value = true;
    errorMessage.value = "";
    stripeLoaded.value = false;
    
    try {
        // Initialize Stripe
        stripe = await initializeStripe();
        
        if (!stripe) {
            throw new Error("Stripe failed to initialize.");
        }

        // Create PaymentIntent on the backend
        const clientSecret = await createPaymentIntent(store.cart, deliveryType.value);
        
        const appearance = {
            theme: 'stripe',
            variables: {
                colorPrimary: '#292524',
            },
        };
        
        elements = stripe.elements({ appearance, clientSecret });
        const paymentElement = elements.create("payment");
        
        // Wait for DOM update so #payment-element exists
        await nextTick();
        paymentElement.mount("#payment-element");
        
        stripeLoaded.value = true;
    } catch (error) {
        console.error("Payment initialization error:", error);
        errorMessage.value = error.message || "Impossible d'initialiser le paiement.";
    } finally {
        loadingStripe.value = false;
    }
};

const processPayment = async () => {
  if (!stripe || !elements) return;
  
  isProcessing.value = true;
  errorMessage.value = "";

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: window.location.origin + "/confirmation", // We will handle manual redirect if successful
      payment_method_data: {
          billing_details: {
              name: `${formData.value.firstName} ${formData.value.lastName}`,
              email: formData.value.email,
              address: {
                  line1: formData.value.address,
                  city: formData.value.city,
                  postal_code: formData.value.zipCode,
                  country: 'FR' // Defaulting to France for this demo
              }
          }
      }
    },
    redirect: 'if_required' 
  });

  if (error) {
    errorMessage.value = error.message;
    isProcessing.value = false;
  } else {
    // Payment succeeded - Update Backend Stock
    try {
        await confirmOrder(store.cart, finalTotal.value, deliveryType.value);
        store.clearCart();
        // Clear form data on success
        localStorage.removeItem('checkout-form');
        router.push("/confirmation");
    } catch (e) {
        console.error("Error updating stock:", e);
        // Even if stock update fails, payment succeeded, so we redirect
        store.clearCart();
        router.push("/confirmation");
    }
  }
};
</script>
