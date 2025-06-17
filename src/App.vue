<template>
  <el-config-provider :locale="currentElementPlusLocale">
    <div id="app-container">
      <TopNotification />
      <NavigationBar />

      <main class="app-main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in"><component :is="Component" /></transition>
        </router-view>
      </main>
      
      <AppFooter />
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElConfigProvider } from 'element-plus';
import en from 'element-plus/es/locale/lang/en';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import TopNotification from '@/components/layout/TopNotification.vue';
import NavigationBar from '@/components/layout/NavigationBar.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

const { locale } = useI18n();
const currentElementPlusLocale = computed(() => (locale.value === 'zh' ? zhCn : en));
</script>

<style lang="scss">
/* 全局样式 */

/* 1. 基础重置，消除所有意外的边距 */
html, body, .app-main-content {
  margin: 0 !important;
  padding: 0 !important;
}

/* 2. 关键修复：确保 #app 和 #app-container 不会干扰 sticky 定位 */
#app, #app-container {
  overflow: visible !important;
}

/* 3. 保留您的页面过渡动画样式 */
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.2s ease; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}
</style>