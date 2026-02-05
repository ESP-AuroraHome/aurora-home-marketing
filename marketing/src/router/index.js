import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProductView from '../views/ProductView.vue';
import AboutView from '../views/AboutView.vue';
import DocsView from '../views/DocsView.vue';
import CartView from '../views/CartView.vue';

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
      name: 'docs',
      component: DocsView
    },
    {
        path: '/pages/docs.html',
        redirect: '/docs'
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
        path: '/pages/cart.html',
        redirect: '/cart'
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
