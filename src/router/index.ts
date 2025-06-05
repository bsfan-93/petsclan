// // src/router/index.ts
// import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// import HomePage from '@/views/HomePage.vue';
// import i18n from '../i18n'; // <--- 添加这行导入 (或者 import i18n from '@/i18n';)
// import { useCartStore } from '@/store/modules/cart'; // 直接从 store 的位置导入

// const routes: Array<RouteRecordRaw> = [
//   {
//     path: '/',
//     name: 'Home',
//     component: HomePage,
//     meta: { titleKey: 'pageTitles.home' } // 示例：使用 i18n 的键作为标题
//   },
//   // 您可以在这里添加其他路由，例如搜索结果页
//   // {
//   //   path: '/search',
//   //   name: 'Search',
//   //   component: () => import('@/views/SearchResultsPage.vue'), // 路由懒加载示例
//   //   meta: { titleKey: 'pageTitles.search' }
//   // }
// ];

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL), // 使用 HTML5 History 模式
//   routes,
//   scrollBehavior(to, from, savedPosition) {
//     // 页面切换时滚动到顶部
//     if (savedPosition) {
//       return savedPosition;
//     } else {
//       return { top: 0 };
//     }
//   }
// });

// const cartStore = useCartStore();

// // 全局前置守卫示例：更新页面标题
// router.beforeEach((to, from, next) => {
//   const titleKey = to.meta.titleKey as string;
//   if (titleKey) {
//     document.title = i18n.global.t(titleKey) as string;
//   } else if (to.meta.title && typeof to.meta.title === 'string') {
//     document.title = to.meta.title;
//   } else {
//     document.title = i18n.global.t('appName') as string; // 默认标题
//   }
//   next();
// });

// // Pinia 实例在 main.ts 中创建并 use()，此处仅用于导出模块 store
// // 如果有 Pinia 插件等全局配置，可以放在这里
// // export * from './modules/cart';
// // export * from './modules/ui';
// // export * from './modules/user';

// export default router;

// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import i18n from '../i18n'; // 确保这个路径指向您 src/i18n.ts 文件

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { titleKey: 'pageTitles.home' } // 假设您在 i18n 文件中有 pageTitles.home
  },
  // {
  //   path: '/search-results', // 示例：搜索结果页
  //   name: 'SearchResults',
  //   component: () => import('@/views/SearchResultsPage.vue'), // 路由懒加载
  //   meta: { titleKey: 'pageTitles.searchResults' }
  // }
  // 添加其他路由...
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' }; // 添加平滑滚动效果
    }
  }
});

router.beforeEach((to, from, next) => {
  const titleKey = to.meta.titleKey as string;
  if (titleKey && i18n.global.te(titleKey)) { // te 方法检查 key 是否存在
    document.title = i18n.global.t(titleKey);
  } else if (to.meta.title && typeof to.meta.title === 'string') {
    document.title = to.meta.title;
  } else {
    document.title = i18n.global.te('appName') ? i18n.global.t('appName') : 'Pet Tech Store'; // 默认应用名称
  }
  next();
});

export default router;