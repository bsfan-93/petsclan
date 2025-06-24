<template>
  <div class="expanding-search-container" ref="searchContainerRef">
    <el-icon v-if="!isSearchVisible" @click="showSearch" class="search-trigger-icon">
      <Search />
    </el-icon>

    <transition name="search-expand">
      <div v-if="isSearchVisible" class="search-input-wrapper">
        <el-autocomplete
          v-model="searchTerm"
          :fetch-suggestions="querySearchHistory"
          placeholder="搜索..."
          @select="handleSearchSelect"
          @keyup.enter="performSearch"
          ref="searchInputRef"
          :trigger-on-focus="true"
          :debounce="300"
          class="search-autocomplete"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><Search /></el-icon>
          </template>
          
          <template #default="{ item }">
            <div class="search-history-item">
              <el-icon><Clock /></el-icon>
              <span>{{ item.value }}</span>
            </div>
          </template>
        </el-autocomplete>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Search, Clock } from '@element-plus/icons-vue';
import { useSearchHistory } from '@/composables/useSearchHistory';

interface SearchSuggestionItem {
  value: string;
}

const router = useRouter();
const searchInputRef = ref<any>(null);
const searchContainerRef = ref<HTMLElement | null>(null);
const searchTerm = ref('');
const isSearchVisible = ref(false); // 使用组件内部状态来控制显隐

const { loadHistory, filterHistory, addToHistory } = useSearchHistory(5);

const showSearch = async () => {
  isSearchVisible.value = true;
  loadHistory();
  await nextTick();
  searchInputRef.value?.focus();
};

const hideSearch = () => {
  isSearchVisible.value = false;
};

const querySearchHistory = (queryString: string, cb: (suggestions: SearchSuggestionItem[]) => void) => {
  const history = filterHistory(queryString);
  cb(history.map(value => ({ value })));
};

const handleSearchSelect = (item: SearchSuggestionItem) => {
  searchTerm.value = item.value;
  performSearch();
};

const performSearch = () => {
  if (!searchTerm.value.trim()) return;
  addToHistory(searchTerm.value);
  router.push({ name: 'Search', query: { q: searchTerm.value } });
  hideSearch();
};

const handleClickOutside = (event: MouseEvent) => {
  if (searchContainerRef.value && !searchContainerRef.value.contains(event.target as Node)) {
    hideSearch();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.expanding-search-container {
  display: flex;
  align-items: center;
  position: relative;
  height: 40px;
}

.search-trigger-icon {
  font-size: 25px;
  color: #000000;
  cursor: pointer;
  width: 38px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:hover {
    color: var(--el-color-primary);
  }
}

.search-autocomplete {
  /* ✨ 修改点：全新的样式 */
  :deep(.el-input__wrapper) {
    height: 40px;
    padding: 0 15px 0 40px; /* 调整内边距，为内部图标留出空间 */
    font-size: 14px;
    border-radius: 20px; /* 圆角 */
    background-color: #f5f7fa;
    border: 1px solid transparent;
    box-shadow: none;
    transition: all 0.3s ease;

    &:hover,
    &.is-focus {
      border-color: var(--el-color-primary);
      background-color: #ffffff;
    }
  }

  /* ✨ 修改点：去掉清除按钮(X)的样式 */
  :deep(.el-input__suffix) {
    display: none;
  }

  :deep(.el-input__prefix) {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #909399;
  }
  :deep(.el-input__icon) {
    font-size: 18px;
  }
}

/* 横向展开动画 */
.search-expand-enter-active,
.search-expand-leave-active {
  transition: width 1.3s ease-in-out;
  overflow: hidden;
}
.search-expand-enter-from,
.search-expand-leave-to {
  width: 0;
}
.search-expand-enter-to,
.search-expand-leave-from {
  width: 250px; /* 展开后的宽度，你可以根据需要调整 */
}

.search-history-item {
  display: flex;
  align-items: center;
  .el-icon {
    margin-right: 10px;
  }
}
</style>