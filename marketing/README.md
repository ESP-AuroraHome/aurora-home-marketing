# AuroraHome - Site Marketing

Site vitrine pour le projet AuroraHome, réalisé avec **Vite**, **Vue.js 3**, et **Tailwind CSS**.
Le projet utilise une architecture de composants modernes et un système de build pour optimiser le développement et la production.

## 🚀 Comment lancer le projet

Le projet utilise désormais **NPM** et **Vite** pour plus de simplicité.

1.  **Installation des dépendances**
    ```bash
    npm install
    ```

2.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```
    Ouvrez ensite [http://localhost:5173](http://localhost:5173).

3.  **Compiler pour la production**
    ```bash
    npm run build
    ```
    Les fichiers optimisés seront dans le dossier `dist/`.

## 📂 Structure du projet

```
marketing/
├── css/
│   └── style.css           # Styles globaux
├── js/
│   ├── components/         # Composants Vue.js (ES Modules)
│   ├── app.js              # Point d'entrée de l'application
│   └── store.js            # Store réactif (Panier)
├── index.html              # Page d'accueil
├── product.html            # Page produit
├── docs.html               # Documentation
├── about.html              # À Propos
├── cart.html               # Panier
├── vite.config.js          # Configuration du bundler Vite
└── package.json            # Dépendances et scripts
```

## 🛠 Technologies

-   **Vite** : Bundler ultra-rapide et serveur de développement.
-   **Vue.js 3** : Framework JavaScript progressif.
-   **Tailwind CSS** : Framework CSS utilitaire.

Cette configuration permet d'utiliser les modules ES modernes, le Hot Module Replacement (HMR) lors du développement, et génère un code optimisé pour le déploiement.
