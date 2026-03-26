import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProductView from '../views/ProductView.vue';
import AboutView from '../views/AboutView.vue';
import CartView from '../views/CartView.vue';
import ConfirmationView from '../views/ConfirmationView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
        path: '/index.html',
        redirect: '/'
    },
    {
      path: '/product',
      name: 'product',
      component: ProductView
    },
    {
        path: '/pages/product.html',
        redirect: '/product'
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
        path: '/pages/about.html',
        redirect: '/about'
    },
    {
        path: '/docs',
        beforeEnter() { window.location.href = 'https://aurora-home-documentation.vercel.app/fr/docs'; }
    },
    {
        path: '/pages/docs.html',
        beforeEnter() { window.location.href = 'https://aurora-home-documentation.vercel.app/fr/docs'; }
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
        path: '/pages/cart.html',
        redirect: '/cart'
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: ConfirmationView
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;
