<!-- 页眉 -->
<template>
  <header class="app-header" ref="appHeaderRef" id="appHeaderScrollContainer"> 
    <TopNotification @height-change="updateNotificationHeight" />
    <el-affix :offset="0" @change="handleAffixChange">
      <NavigationBar ref="navigationBarRefInstance" /> 
    </el-affix>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import TopNotification from './TopNotification.vue';
import NavigationBar from './NavigationBar.vue';
import { useUiStore } from '@/store/modules/ui';

const appHeaderRef = ref<HTMLElement | null>(null);
const notificationHeight = ref(0); // 广告栏的实际高度
const menuBarHeight = ref(60); // 菜单栏的实际高度（假设固定, e.g., 60px） - RENAMED VARIABLE
const isMenuAffixed = ref(false); // To track if menu is sticky
const uiStore = useUiStore();

const updateNotificationHeight = (height: number) => {
  notificationHeight.value = height;
  updateTotalHeaderHeight();
};

const updateTotalHeaderHeight = () => {
  let heightForPagePadding = 0;
  if (isMenuAffixed.value) {
    // NavigationBar 吸顶了 (通常在 offset="0"), TopNotification 已滚走
    // 页面内容需要为 NavigationBar 的高度腾出空间
    heightForPagePadding = menuBarHeight.value;
  } else {
    // NavigationBar 还未吸顶, TopNotification 和 NavigationBar 都在文档流顶部
    // 页面内容需要为两者的高度总和腾出空间
    heightForPagePadding = notificationHeight.value + menuBarHeight.value;
  }
  uiStore.setHeaderHeight(heightForPagePadding);
};

const handleAffixChange = (fixed: boolean) => {
  isMenuAffixed.value = fixed;
  updateTotalHeaderHeight();
};


// 模拟获取菜单栏高度
onMounted(() => {
  // 假设 NavigationBar 高度固定为60px
  // 实际项目中，可以在 NavigationBar 组件内部 emit 高度，或者 AppHeader 获取其 DOM 高度
  menuBarHeight.value = 60; // 示例值
  
  // 初始计算头部高度
  // TopNotification 会在 mounted 后通过 emit('height-change') 传递其实际高度
  // 这里延迟一下确保 TopNotification 渲染完成
  nextTick(() => {
    const topNotifEl = appHeaderRef.value?.querySelector('.top-notification-bar');
    if (topNotifEl) {
      notificationHeight.value = (topNotifEl as HTMLElement).offsetHeight;
    } else {
      notificationHeight.value = 0;
    }
    updateTotalHeaderHeight();
  });
});

// 确保在 TopNotification 组件中，当其显示/隐藏或高度变化时，会 emit 一个 'height-change' 事件
// 例如，在 TopNotification.vue 的 dismiss 方法和 onMounted 中：
// const topNotificationBarRef = ref<HTMLElement | null>(null);
// const emit = defineEmits(['height-change']);
// onMounted(() => { if (visible.value) emit('height-change', topNotificationBarRef.value?.offsetHeight?? 0); else emit('height-change', 0); });
// const dismiss = () => { visible.value = false; emit('height-change', 0); };
</script>

<style scoped lang="scss">
.app-header {
  position: relative; // 为 el-affix 提供一个定位上下文，如果其 target 是 appHeaderRef
  // 背景色等应在子组件 (TopNotification, NavigationBar) 中定义
}
</style>