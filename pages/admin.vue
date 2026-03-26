<template>
  <div class="pt-8 max-w-6xl mx-auto animate-fade-in px-4">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-stone-800">Admin Dashboard</h1>
      <NuxtLink to="/" class="text-stone-500 hover:text-stone-800 flex items-center gap-2">
        <i class="ph ph-house"/> Retour Site
      </NuxtLink>
    </div>

    <div class="grid md:grid-cols-3 gap-8 mb-12">
      <div class="md:col-span-2 glass-panel p-6 rounded-2xl">
        <h2 class="text-xl font-bold mb-4 text-stone-800">Ventes Récentes</h2>
        <div class="h-64 relative w-full">
          <ClientOnly>
            <Bar v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
            <div v-else class="flex items-center justify-center h-full text-stone-400">
              Aucune donnée de vente
            </div>
          </ClientOnly>
        </div>
      </div>

      <div class="glass-panel p-6 rounded-2xl">
        <h2 class="text-xl font-bold mb-4 text-stone-800">Dernières Commandes</h2>
        <div class="space-y-4 max-h-64 overflow-y-auto pr-2">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="p-3 bg-white/50 rounded-lg border border-stone-100"
          >
            <div class="flex justify-between items-start">
              <span class="text-xs font-mono text-stone-400">
                {{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}
              </span>
              <span class="font-bold text-green-600">{{ order.total }} €</span>
            </div>
            <div class="text-sm text-stone-600 mt-1">
              {{ order.items.length }} article(s) ({{ order.deliveryType }})
            </div>
          </div>
          <div v-if="recentOrders.length === 0" class="text-stone-400 text-sm">
            Aucune commande récente.
          </div>
        </div>
      </div>
    </div>

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
            <tr v-for="row in productRows" :key="row.id" class="hover:bg-stone-50/50">
              <td class="p-4 font-medium text-stone-800">{{ row.name }}</td>
              <td class="p-4 text-stone-600">{{ row.price }} €</td>
              <td class="p-4">
                <span :class="row.stock < 10 ? 'text-red-500 font-bold' : 'text-stone-800'">
                  {{ row.stock }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <input
                    v-model.number="row.pendingStock"
                    type="number"
                    min="0"
                    class="w-20 p-2 rounded-lg border border-stone-200 text-sm"
                    :placeholder="String(row.stock)"
                  >
                  <button
                    class="p-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
                    title="Mettre à jour"
                    @click="updateStock(row)"
                  >
                    <i class="ph ph-arrows-clockwise"/>
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

<script setup lang="ts">
import type { Component } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'
import type { Order, Product } from '~/shared/types/index'

interface ProductRow extends Product {
  pendingStock: number
}

const orders = ref<Order[]>([])
const productRows = ref<ProductRow[]>([])

let Bar: Component | null = null

/**
 * Dynamically imports Chart.js and vue-chartjs (client-side only) and registers
 * the required plugins. Returns the `Bar` component for use in the template.
 */
async function loadChart(): Promise<void> {
  if (!import.meta.client) return

  const { Bar: BarComponent } = await import('vue-chartjs')
  const { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } = await import('chart.js')

  Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  Bar = BarComponent
}

/**
 * Fetches products and orders from the API and populates the reactive state.
 */
async function loadData(): Promise<void> {
  const [fetchedProducts, fetchedOrders] = await Promise.all([
    $fetch<Product[]>('/api/products'),
    $fetch<Order[]>('/api/orders'),
  ])

  productRows.value = fetchedProducts.map((p) => ({ ...p, pendingStock: p.stock }))
  orders.value = fetchedOrders
}

const recentOrders = computed(() =>
  [...orders.value].sort((a, b) => b.id - a.id).slice(0, 5),
)

const chartData = computed((): ChartData<'bar'> => {
  const salesByDate: Record<string, number> = {}

  orders.value.forEach((order) => {
    const date = new Date(order.createdAt).toLocaleDateString('fr-FR')
    salesByDate[date] = (salesByDate[date] ?? 0) + parseFloat(order.total)
  })

  return {
    labels: Object.keys(salesByDate),
    datasets: [
      {
        label: "Chiffre d'affaires (€)",
        backgroundColor: '#292524',
        data: Object.values(salesByDate),
      },
    ],
  }
})

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
}

/**
 * Sends an updated stock value to the API and refreshes the product list.
 *
 * @param row - The product row containing the `pendingStock` value to persist.
 */
async function updateStock(row: ProductRow): Promise<void> {
  if (row.pendingStock === undefined || row.pendingStock < 0) return

  await $fetch(`/api/products/${row.id}`, {
    method: 'PUT',
    body: { stock: row.pendingStock },
  })

  await loadData()
}

onMounted(async () => {
  await Promise.all([loadChart(), loadData()])
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #e7e5e4;
  border-radius: 20px;
}
</style>
