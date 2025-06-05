// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
// import i18n from './i18n'; // OLD PATH
import i18n from './i18n'; // CORRECTED PATH if file is in src/plugins/
import './assets/styles/index.scss';
import 'element-plus/theme-chalk/display.css';

import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(createPinia());
app.use(router);
app.use(i18n); // This should now correctly use the instance from src/plugins/i18n.ts

app.mount('#app');