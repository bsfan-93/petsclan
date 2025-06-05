// src/App.vue
<template>
  <el-config-provider :locale="currentElementPlusLocale" :message="configProviderMessageConfig">
    <div class="app-container">
      <AppHeader />
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <AppFooter v-if="shouldShowFooter" />
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import { ElConfigProvider } from 'element-plus';

// 导入 Element Plus 语言包
import en from 'element-plus/es/locale/lang/en'; // No .js extension, points to TS-aware module
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // No .js extension

const { locale } = useI18n(); // 获取 vue-i18n 的当前语言
const route = useRoute();

// 动态计算 Element Plus 使用的语言包
const currentElementPlusLocale = computed(() => {
  return locale.value === 'zh'? zhCn : en;
});

// Element Plus 全局消息配置 (例如 ElMessage 的最大显示数量)
const configProviderMessageConfig = reactive({
  max: 3,
});

// 根据路由元信息判断是否显示页脚 (示例)
const shouldShowFooter = computed(() => route.meta.showFooter!== false);

</script>

<style lang="scss">
// 全局过渡动画示例
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--el-bg-color-page); // 使用 Element Plus 的页面背景色变量
}

.main-content {
  flex: 1;
  // padding-top 将由 AppHeader 内部的固定/粘性元素高度决定，此处不设置
  // 而是由 AppHeader 通过 store 或 props 通知 HomePage 等页面组件调整其内部padding
}
</style>