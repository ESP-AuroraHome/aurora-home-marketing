<template>
  <div id="app" class="relative min-h-screen flex flex-col">
    <div class="aurora-bg">
      <div class="aurora-blob bg-orange-100 w-160 h-160 top-[-10%] left-[-10%] rounded-full mix-blend-multiply"/>
      <div class="aurora-blob bg-blue-50 w-140 h-140 bottom-[-10%] right-[-5%] rounded-full mix-blend-multiply delay-1000"/>
      <div class="aurora-blob bg-pink-50 w-120 h-120 top-[40%] left-[30%] rounded-full mix-blend-multiply delay-2000"/>
    </div>

    <TheHeader />

    <main class="flex-grow max-w-6xl mx-auto px-4 w-full pb-20">
      <NuxtPage />
    </main>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()

onMounted(() => {
  cart.hydrate()
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
