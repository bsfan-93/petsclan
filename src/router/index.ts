import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import i18n from '../i18n';
import HomePage from '@/views/HomePage.vue';

const routes: Array<RouteRecordRaw> = [
  // --- Core Routes ---
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { titleKey: 'pageTitles.home' }
  },
  {
    path: '/search',
    name: 'Search', // This name is used by the search bar components
    component: () => import('@/views/SearchPage.vue'),
    meta: { titleKey: 'pageTitles.search' }
  },

  // --- Shop Routes ---
  {
    path: '/shop/all',
    name: 'ShopAll',
    component: () => import('@/views/ShopAllPage.vue'), 
    meta: { titleKey: 'pageTitles.shopAll' }
  },
  {
    path: '/shop/category/:categoryId',
    name: 'ShopCategoryPage',
    component: () => import('@/views/CategoryPage.vue'), 
    props: true, // Passes :categoryId as a prop to the component
    meta: { titleKey: 'pageTitles.categoryPage' }
  },

  // --- About & App Routes ---
  {
    path: '/about',
    name: 'AboutUs',
    component: () => import('@/views/AboutPage.vue'), 
  },
  {
    path: '/about/story',
    name: 'OurStory',
    component: () => import('@/views/OurStoryPage.vue'),
  },
  {
    path: '/app-download',
    name: 'AppDownload',
    component: () => import('@/views/AppDownloadPage.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: { titleKey: 'pageTitles.profile' } // Optional: for document title
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/CartPage.vue'),
    meta: { titleKey: 'pageTitles.cart' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

// Navigation guard to set document title from i18n
router.beforeEach((to, from, next) => {
  const titleKey = to.meta.titleKey as string;
  if (titleKey && i18n.global.te(titleKey)) {
    document.title = i18n.global.t(titleKey);
  } else if (to.meta.title && typeof to.meta.title === 'string') {
    document.title = to.meta.title;
  } else {
    document.title = i18n.global.te('appName') ? i18n.global.t('appName') : 'Pets Clan';
  }
  next();
});

export default router;