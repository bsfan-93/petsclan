// src/main.ts

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import i18n from './i18n';

// ✨ 这就是最关键的一行代码，确保它存在且没有被注释
import './assets/styles/index.scss';

// 这一行是 Element Plus 的辅助样式，用于响应式布局
import 'element-plus/theme-chalk/display.css';

// 导入 Element Plus 图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 创建 Vue 应用实例
const app = createApp(App);

// 全局注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 依次使用 Pinia, Vue Router 和 i18n
app.use(createPinia());
app.use(router);
app.use(i18n);

// 挂载应用
app.mount('#app');
