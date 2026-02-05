<template>
  <div class="pt-8 animate-fade-in">
    <div class="flex gap-8">
      <!-- Sidebar -->
      <div class="w-64 hidden md:block space-y-2">
        <h3 class="font-bold text-stone-800 mb-4 px-2">Documentation</h3>
        <a
          href="#"
          class="block px-3 py-2 rounded-lg bg-stone-200/50 font-medium text-stone-800"
          >Démarrage rapide</a
        >
        <a
          href="#"
          class="block px-3 py-2 rounded-lg text-stone-500 hover:bg-white/30"
          >Configuration WiFi</a
        >
        <a
          href="#"
          class="block px-3 py-2 rounded-lg text-stone-500 hover:bg-white/30"
          >API Locale</a
        >
        <a
          href="#"
          class="block px-3 py-2 rounded-lg text-stone-500 hover:bg-white/30"
          >Flasher l'ESP32</a
        >
      </div>

      <!-- Content -->
      <div class="flex-1 glass-panel p-8 rounded-3xl min-h-[500px]">
        <h2 class="text-2xl font-bold mb-6">Démarrage rapide</h2>
        <div class="space-y-4 text-stone-600">
          <p>
            Merci d'avoir choisi Aurora. Voici comment configurer votre boîtier
            en moins de 2 minutes.
          </p>

          <div class="bg-white/50 p-4 rounded-xl border border-white">
            <h4 class="font-semibold mb-2">1. Branchez le boîtier</h4>
            <p class="text-sm">
              Utilisez le câble USB-C fourni. La LED devrait clignoter en blanc
              doucement.
            </p>
          </div>

          <div class="bg-white/50 p-4 rounded-xl border border-white">
            <h4 class="font-semibold mb-2">
              2. Connectez-vous au WiFi "Aurora-Setup"
            </h4>
            <p class="text-sm">
              Depuis votre téléphone, rejoignez ce réseau. Une page de
              configuration s'ouvrira automatiquement.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
