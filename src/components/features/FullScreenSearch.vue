<template>
  <transition name="fullscreen-search-fade">
    <div v-if="isVisible" class="fullscreen-search-overlay" @click.self="closeSearch">
      <button class="close-button" @click="closeSearch" aria-label="Close search">
        <el-icon><Close /></el-icon>
      </button>

      <div class="search-content-wrapper">
        <div class="search-input-container">
          <el-form @submit.prevent="performSearchAndNavigate">
            <el-input
              v-model="searchQuery"
              class="search-input-fullscreen"
              :placeholder="t('nav.searchPlaceholder')"
              ref="inputRef"
              @keyup.enter="performSearchAndNavigate"
            >
              <template #suffix>
                <el-icon class="search-icon" @click="performSearchAndNavigate"><Search /></el-icon>
              </template>
            </el-input>
          </el-form>
          <div class="separator-line"></div>
        </div>

        <div v-if="searchQuery" class="search-results-dropdown">
          <div v-if="isLoading" class="results-message">Loading...</div>
          <div v-else-if="results.length === 0 && !isLoading" class="results-message">
            No results for "{{ searchQuery }}"
          </div>
          <ul v-else class="results-list">
            <li v-for="item in results" :key="item.id" class="result-item">
              <router-link :to="`/product/${item.id}`" class="result-link" @click="closeSearch">
                <img :src="item.url" :alt="item.name" class="result-image" />
                <div class="result-info">
                  <span class="result-name">{{ item.name }}</span>
                  <span class="result-price">${{ item.price }}</span>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '@/store/modules/ui';
import { Search, Close } from '@element-plus/icons-vue';
// 需求1: 导入API请求函数
import { fetchSearchResults, type SearchResultItem } from '@/services/apiClient';

const { t } = useI18n(); // 需求3: 获取t函数用于国际化
const router = useRouter();
const uiStore = useUiStore();

const searchQuery = ref('');
const results = ref<SearchResultItem[]>([]);
const isLoading = ref(false);
const inputRef = ref<any>(null);

const isVisible = computed(() => uiStore.isFullScreenSearchVisible);

let debounceTimer: ReturnType<typeof setTimeout>;

// 需求1 & 5: 模糊搜索逻辑
watch(searchQuery, (newQuery) => {
  clearTimeout(debounceTimer);
  if (!newQuery.trim()) {
    results.value = [];
    return;
  }
  // 使用防抖技术，在用户停止输入300毫秒后执行搜索
  debounceTimer = setTimeout(() => {
    performSearch();
  }, 300);
});

// 执行搜索
const performSearch = async () => {
  isLoading.value = true;
  results.value = await fetchSearchResults(searchQuery.value);
  isLoading.value = false;
};

// 当搜索界面可见时，自动聚焦到输入框
watch(isVisible, (newValue) => {
  if (newValue) {
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});

const closeSearch = () => {
  uiStore.setFullScreenSearchVisible(false);
};

const performSearchAndNavigate = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${searchQuery.value.trim()}`);
    closeSearch();
  }
};
</script>

<style scoped lang="scss">
.fullscreen-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20vh;
}

.close-button {
  position: absolute;
  top: 40px;
  right: 60px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  .el-icon {
    font-size: 32px;
    color: #333;
  }
}

.search-content-wrapper {
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.search-input-fullscreen :deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: none !important;
  border: none;
  padding: 0;
  .el-input__inner {
    height: 60px;
    font-size: 32px;
    text-align: center;
    color: #333;
    /* 需求4: 光标颜色 */
    caret-color: #333; 
    &::placeholder {
      color: #ccc;
    }
  }
}

.search-input-fullscreen :deep(.el-input__suffix) {
  font-size: 32px;
  color: #333;
  cursor: pointer;
}

.search-input-fullscreen :deep(.el-input__inner) {
  height: 60px;
  font-size: 32px;
  text-align: center;
  color: #333;

  /* 新增：将光标颜色设置为黑色 */
  caret-color: #333; 

  &::placeholder {
    color: #ccc;
  }
}
    
.separator-line {
  width: 100%;
  height: 2px;
  background-color: #333;
  margin-top: 16px;
}

/* 需求2: 下拉框样式 */
.search-results-dropdown {
  margin-top: 20px;
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1100;
  max-height: 150vh;
  overflow-y: auto;
  text-align: left;
}

.results-list {
  list-style: none;
  padding: 8px;
  margin: 0;
}

.result-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.result-link {
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 35px;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
}

.result-image {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.result-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.result-name {
  /* --- 在这里进行修改 --- */
  font-size: 18px; /* 1. 在这里调整字体大小 */
  font-weight: 600; /* 2. 在这里调整字体粗细 */

  /* 以下是已有样式，保持不变 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 6px; /* 也可以微调与下方价格的间距 */
}

.result-price {
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
}

.results-message {
  padding: 20px;
  text-align: center;
  color: #999;
}

/* 过渡动画 */
.fullscreen-search-fade-enter-active,
.fullscreen-search-fade-leave-active {
  transition: opacity 0.3s ease;
}
.fullscreen-search-fade-enter-from,
.fullscreen-search-fade-leave-to {
  opacity: 0;
}
</style>