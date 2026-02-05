<template>
  <div class="pt-24 max-w-2xl mx-auto text-center animate-fade-in">
    <div class="glass-panel p-12 rounded-3xl space-y-6">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="ph ph-check text-4xl text-green-600"></i>
      </div>
      
      <h1 class="text-3xl font-bold text-stone-800">Commande Confirmée !</h1>
      
      <p class="text-stone-600 text-lg">
        Merci pour votre achat. Une confirmation a été envoyée à votre adresse email.
      </p>

      <div class="bg-stone-50 p-6 rounded-xl border border-stone-200 mt-8 text-left max-w-md mx-auto">
        <h3 class="font-semibold text-stone-800 mb-2">Prochaines étapes :</h3>
        <ul class="space-y-3 text-sm text-stone-600">
           <li class="flex items-start gap-2">
             <i class="ph ph-envelope-simple-open mt-0.5 text-stone-400"></i>
             <span>Vous allez recevoir un email récapitulatif avec votre facture.</span>
           </li>
           <li class="flex items-start gap-2">
             <i class="ph ph-package mt-0.5 text-stone-400"></i>
             <span>Nous préparons votre colis. Vous recevrez un lien de suivi dès l'expédition.</span>
           </li>
        </ul>
      </div>

      <div class="pt-8">
        <router-link 
          to="/" 
          class="inline-block px-8 py-3 rounded-xl bg-stone-800 text-white font-medium hover:bg-stone-700 hover-lift shadow-lg"
        >
          Retour à l'accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
