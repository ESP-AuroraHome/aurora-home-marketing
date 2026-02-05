<template>
  <footer class="border-t border-stone-200 liquid-glass mt-auto">
    <div
      class="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <div class="text-stone-500 text-sm">
        &copy; 2024 AuroraHome. Open Hardware & Open Source.
      </div>
      <div class="flex gap-6 text-sm font-medium text-stone-600">
        <router-link to="/about" class="hover:text-stone-900"
          >Mentions Légales</router-link
        >
        <router-link to="/docs" class="hover:text-stone-900"
          >Support</router-link
        >
        <a
          href="https://github.com/EpitechMscProPromo2026/T-ESP-901-81613-REN_AuroraHome"
          target="_blank"
          class="hover:text-stone-900"
          >GitHub</a
        >
      </div>
    </div>
  </footer>
</template>
