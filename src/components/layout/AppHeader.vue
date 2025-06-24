<!-- 页眉 -->
<template>
  <el-config-provider :locale="currentElementPlusLocale">
    <div id="app-container">
      <TopNotification />
      <NavigationBar />

      <main class="app-main-content" :style="{ paddingTop: `${uiStore.headerHeight}px` }">
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
import { useUiStore } from '@/store/modules/ui'; // 1. Import the store

const { locale } = useI18n();
const uiStore = useUiStore(); // 2. Get an instance of the store

const currentElementPlusLocale = computed(() => (locale.value === 'zh' ? zhCn : en));
</script>


<style scoped lang="scss">
.app-header {
  position: relative; // 为 el-affix 提供一个定位上下文，如果其 target 是 appHeaderRef
  // 背景色等应在子组件 (TopNotification, NavigationBar) 中定义
}

.app-main-content {
  transition: padding-top 0.3s ease;
}
</style>