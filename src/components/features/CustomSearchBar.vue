<template>
  <div class="custom-search-container" ref="searchContainerRef">
    <el-icon v-if="!isSearchVisible" @click="showSearch" class="search-trigger-icon">
      <Search />
    </el-icon>

    <transition name="width-expand">
      <div v-if="isSearchVisible" class="search-bar">
        <el-icon class="search-icon-inside"><Search /></el-icon>
        <input
          v-model="searchTerm"
          type="text"
          class="search-input"
          placeholder="搜索..."
          @keyup.enter="performSearch"
          ref="searchInputRef"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';

const router = useRouter();
const searchTerm = ref('');
const isSearchVisible = ref(false);
const searchInputRef = ref<HTMLInputElement | null>(null);
const searchContainerRef = ref<HTMLElement | null>(null);

// 展开搜索框
const showSearch = () => {
  isSearchVisible.value = true;
  // 等待 DOM 更新后，自动聚焦到输入框
  nextTick(() => {
    searchInputRef.value?.focus();
  });
};

// 收起搜索框
const hideSearch = () => {
  isSearchVisible.value = false;
};

// 按回车键执行搜索
const performSearch = () => {
  if (!searchTerm.value.trim()) return;
  // 注意：这里需要你的路由配置里有一个 name 为 'Search' 的路由
  router.push({ name: 'Search', query: { q: searchTerm.value } });
  hideSearch(); // 搜索后收起
};

// ✨ 核心功能：点击组件外部区域，自动收起搜索框
const handleClickOutside = (event: MouseEvent) => {
  if (searchContainerRef.value && !searchContainerRef.value.contains(event.target as Node)) {
    hideSearch();
  }
};

// 在组件挂载时，监听整个页面的点击事件
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

// 在组件卸载时，移除监听，防止内存泄漏
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped lang="scss">
.custom-search-container {
  display: flex;
  align-items: center;
  height: 40px;
}

.search-trigger-icon {
  font-size: 25px;
  color: #000;
  cursor: pointer;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    color: var(--el-color-primary);
  }
}

/* 这是我们自定义的搜索框容器 */
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  background-color: #f5f7fa;
  border-radius: 20px; /* 圆角 */
  border: 1px solid #dcdfe6;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #c0c4cc;
  }
}

/* 放大镜图标，绝对定位于容器内部左侧 */
.search-icon-inside {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #909399;
}

/* 真正的 input 输入框，我们把它设置为透明无边框 */
.search-input {
  width: 100%;
  height: 100%;
  padding-left: 45px; /* 为左侧的图标留出空间 */
  padding-right: 15px;
  border: none;
  background-color: transparent;
  outline: none; /* 去掉聚焦时的蓝色边框 */
  font-size: 14px;
  color: #606266;
  box-sizing: border-box;
}

/* 横向展开动画 */
.width-expand-enter-active,
.width-expand-leave-active {
  transition: width 0.3s ease-in-out;
  overflow: hidden;
}
.width-expand-enter-from,
.width-expand-leave-to {
  width: 0;
}
.width-expand-enter-to,
.width-expand-leave-from {
  width: 250px; /* 展开后的宽度 */
}
</style>