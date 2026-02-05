import { reactive, watch } from 'vue';

export const store = reactive({
    cart: [],

    // Initialize store
    init() {
        const savedCart = localStorage.getItem('aurora-cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }

        // Watch for changes
        watch(() => this.cart, (newCart) => {
            localStorage.setItem('aurora-cart', JSON.stringify(newCart));
        }, { deep: true });
    },

    addToCart(product = null) {
        // Default product if none provided (for simplicity based on current app)
        const itemToAdd = product || {
            id: 1,
            name: 'Aurora One',
            price: 89.00
        };

        this.cart.push(itemToAdd);
    },

    removeFromCart(index) {
        this.cart.splice(index, 1);
    },

    get cartTotal() {
        return this.cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
    },

    get cartCount() {
        return this.cart.length;
    },

    clearCart() {
        this.cart = [];
    }
});

// Auto-init
store.init();
