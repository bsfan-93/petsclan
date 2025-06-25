<template>
  <el-config-provider :locale="currentElementPlusLocale">
    <div id="app-container">
      <TopNotification />
      <NavigationBar />
      <main class="app-main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
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
import SubscriptionModal from '@/components/features/SubscriptionModal.vue'; // ✨ 导入订阅弹窗组件

const { locale } = useI18n();
const currentElementPlusLocale = computed(() => (locale.value === 'zh' ? zhCn : en));
</script>

<style lang="scss">
/* 全局样式 */
html, body, .app-main-content {
  margin: 0 !important;
  padding: 0 !important;
}
#app, #app-container {
  overflow: visible !important;
}
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.2s ease; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}
</style>