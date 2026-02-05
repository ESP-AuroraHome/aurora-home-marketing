<template>
  <div class="pt-8 max-w-6xl mx-auto animate-fade-in px-4">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-stone-800">Admin Dashboard</h1>
      <router-link to="/" class="text-stone-500 hover:text-stone-800 flex items-center gap-2">
        <i class="ph ph-house"></i> Retour Site
      </router-link>
    </div>

    <!-- Analytics Section -->
    <div class="grid md:grid-cols-3 gap-8 mb-12">
        <!-- Chart -->
        <div class="md:col-span-2 glass-panel p-6 rounded-2xl">
            <h2 class="text-xl font-bold mb-4 text-stone-800">Ventes Récentes</h2>
            <div class="h-64 relative w-full">
                <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
                <div v-else class="flex items-center justify-center h-full text-stone-400">
                    Aucune donnée de vente
                </div>
            </div>
        </div>

        <!-- Key Metrics / Recent Orders -->
        <div class="glass-panel p-6 rounded-2xl">
            <h2 class="text-xl font-bold mb-4 text-stone-800 w-full">Dernières Commandes</h2>
            <div class="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                <div v-for="order in recentOrders" :key="order.id" class="p-3 bg-white/50 rounded-lg border border-stone-100">
                    <div class="flex justify-between items-start">
                        <span class="text-xs font-mono text-stone-400">{{ new Date(order.date).toLocaleDateString() }}</span>
                        <span class="font-bold text-green-600">{{ order.total }} €</span>
                    </div>
                    <div class="text-sm text-stone-600 mt-1">
                        {{ order.items.length }} articles ({{ order.deliveryType }})
                    </div>
                </div>
                <div v-if="recentOrders.length === 0" class="text-stone-400 text-sm">
                    Aucune commande récente.
                </div>
            </div>
        </div>
    </div>

    <!-- Stock Management -->
    <section>
        <h2 class="text-2xl font-bold mb-6 text-stone-800">Gestion des Stocks</h2>
        <div class="glass-panel rounded-2xl overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-stone-100 text-stone-600 text-sm uppercase">
                        <th class="p-4">Produit</th>
                        <th class="p-4">Prix</th>
                        <th class="p-4">Stock Actuel</th>
                        <th class="p-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                    <tr v-for="product in products" :key="product.id" class="hover:bg-stone-50/50">
                        <td class="p-4 font-medium text-stone-800">{{ product.name }}</td>
                        <td class="p-4 text-stone-600">{{ product.price }} €</td>
                        <td class="p-4">
                            <span :class="product.stock < 10 ? 'text-red-500 font-bold' : 'text-stone-800'">
                                {{ product.stock }}
                            </span>
                        </td>
                        <td class="p-4 text-right">
                            <div class="flex items-center justify-end gap-2">
                                <input 
                                    type="number" 
                                    v-model.number="product.tempStock" 
                                    class="w-20 p-2 rounded-lg border border-stone-200 text-sm"
                                    :placeholder="product.stock"
                                />
                                <button 
                                    @click="updateStock(product)"
                                    class="p-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
                                    title="Mettre à jour"
                                >
                                    <i class="ph ph-arrows-clockwise"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getProducts, getOrders, updateProductStock } from '../services/PaymentService';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const products = ref([]);
const orders = ref([]);

const loadData = async () => {
    // Load products
    const items = await getProducts();
    products.value = items.map(p => ({...p, tempStock: p.stock}));

    // Load orders
    orders.value = await getOrders();
};

onMounted(loadData);

// Chart Data
const chartData = computed(() => {
    // Aggregate sales by day (last 7 days logic could be added)
    // For simplicity, showing raw order totals per order for now or grouping slightly?
    // Let's group by Date (Day)
    const salesByDate = {};
    orders.value.forEach(order => {
        const date = new Date(order.date).toLocaleDateString('fr-FR');
        salesByDate[date] = (salesByDate[date] || 0) + parseFloat(order.total);
    });

    return {
        labels: Object.keys(salesByDate),
        datasets: [
            {
                label: 'Chiffre d\'affaires (€)',
                backgroundColor: '#292524',
                data: Object.values(salesByDate)
            }
        ]
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    }
};

const recentOrders = computed(() => {
    return [...orders.value].sort((a, b) => b.id - a.id).slice(0, 5);
});

const updateStock = async (product) => {
    if (product.tempStock === undefined || product.tempStock === null) return;
    
    await updateProductStock(product.id, product.tempStock);
    // Refresh
    await loadData();
    alert(`Stock mis à jour pour ${product.name}`);
};
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e7e5e4;
  border-radius: 20px;
}
</style>
