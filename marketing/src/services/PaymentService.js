import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Publishable Key from Stripe Dashboard
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SeIBbGhTLkgwFISrlSSej67l25hPnLIklvCzmOY1BNUEdnCLt33nmtRB2Y1QkVZqTgnteecusrpkhgcYW8HRS7e0094Z3AC2n';

let stripePromise;

export const initializeStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
};

export const createPaymentIntent = async (items, deliveryType) => {
    try {
        const response = await fetch('http://localhost:3000/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items, deliveryType }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create payment intent');
        }

        const data = await response.json();
        return data.clientSecret;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
};

export const confirmOrder = async (items, total, deliveryType) => {
    try {
        const response = await fetch('http://localhost:3000/order/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items, total, deliveryType }),
        });
        if (!response.ok) throw new Error('Failed to confirm order');
        return await response.json();
    } catch (error) {
        console.error('Error confirming order:', error);
    }
};

export const getProducts = async () => {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export const getOrders = async () => {
    try {
        const response = await fetch('http://localhost:3000/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

export const updateProductStock = async (id, stock) => {
    try {
        const response = await fetch(`http://localhost:3000/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock }),
        });
        if (!response.ok) throw new Error('Failed to update stock');
        return await response.json();
    } catch (error) {
        console.error('Error updating stock:', error);
    }
};
