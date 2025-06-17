// src/router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// 导入您的 HomePage 组件，确保路径正确
import HomePage from '@/views/HomePage.vue';
import i18n from '../i18n';

const routes: Array<RouteRecordRaw> = [
  // --- START: 这是必须被恢复的首页路由 ---
  {
    path: '/',
    name: 'Home',
    component: HomePage, // 指向您的首页组件
    meta: { titleKey: 'pageTitles.home' } // 使用您原有的 meta 信息
  },
  // --- END: 首页路由 ---

  // --- START: 这是为商店相关页面新添加的路由 ---
  {
    // 对应“所有商品”链接
    path: '/shop/all',
    name: 'ShopAll',
    // 使用路由懒加载，您需要创建 ShopAllPage.vue 文件
    component: () => import('@/views/ShopAllPage.vue'), 
    meta: { titleKey: 'pageTitles.shopAll' } // 假设您有这个i18n键
  },
  {
    // 对应动态生成的分类链接，例如 /shop/category/4
    path: '/shop/category/:categoryId', // :categoryId 是一个动态参数
    name: 'ShopCategoryPage',
    // 使用路由懒加载，您需要创建 CategoryPage.vue 文件
    component: () => import('@/views/CategoryPage.vue'), 
    props: true, // 允许将路由参数 (categoryId) 作为 prop 传递给页面组件
    meta: { titleKey: 'pageTitles.categoryPage' } // 用于设置页面标题
  },
   // --- END: 商店相关路由 ---
  
  // --- 您可能有的其他路由，例如 About Us, App Download 等 ---
  {
    path: '/about',
    name: 'AboutUs',
    // 假设您的组件路径，如果文件不存在，您也需要创建它们
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

// 您的 beforeEach 守卫保持不变
router.beforeEach((to, from, next) => {
  const titleKey = to.meta.titleKey as string;
  if (titleKey && i18n.global.te(titleKey)) {
    document.title = i18n.global.t(titleKey);
  } else if (to.meta.title && typeof to.meta.title === 'string') {
    document.title = to.meta.title;
  } else {
    document.title = i18n.global.te('appName') ? i18n.global.t('appName') : 'Pet Tech Store';
  }
  next();
});

export default router;