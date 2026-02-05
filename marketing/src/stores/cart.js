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
        // Default product if none provided
        const template = product || {
            id: 1,
            name: 'Aurora One',
            price: 89.00
        };

        const existingItem = this.cart.find(item => item.id === template.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...template, quantity: 1 });
        }
    },

    decreaseQuantity(index) {
        const item = this.cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            this.cart.splice(index, 1);
        }
    },

    removeFromCart(index) {
        this.cart.splice(index, 1);
    },

    get cartTotal() {
        return this.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
    },

    get cartCount() {
        return this.cart.reduce((acc, item) => acc + item.quantity, 0);
    },

    clearCart() {
        this.cart = [];
    }
});

// Auto-init
store.init();
