<template>
  <div id="app" class="relative min-h-screen flex flex-col">
    <!-- Background Elements -->
    <div class="aurora-bg">
      <div
        class="aurora-blob bg-orange-100 w-[40rem] h-[40rem] top-[-10%] left-[-10%] rounded-full mix-blend-multiply"
      ></div>
      <div
        class="aurora-blob bg-blue-50 w-[35rem] h-[35rem] bottom-[-10%] right-[-5%] rounded-full mix-blend-multiply delay-1000"
      ></div>
      <div
        class="aurora-blob bg-pink-50 w-[30rem] h-[30rem] top-[40%] left-[30%] rounded-full mix-blend-multiply delay-2000"
      ></div>
    </div>

    <TheHeader />

    <!-- Main Content Area -->
    <main class="flex-grow max-w-6xl mx-auto px-4 w-full pb-20">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import TheHeader from "./components/TheHeader.vue";
import TheFooter from "./components/TheFooter.vue";

onMounted(() => {
  // Global Scroll Reveal Logic
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // No init needed
});
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
