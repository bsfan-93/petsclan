<template>
  <div class="expanding-search-bar" :class="{ 'is-active': isSearchVisible }">
    <el-icon v-if="!isSearchVisible" @click="showSearch" class="search-icon-trigger" :size="20">
      <Search />
    </el-icon>
    <transition name="search-expand">
      <div v-if="isSearchVisible" class="search-input-wrapper">
        <el-autocomplete
          v-model="searchTerm"
          :fetch-suggestions="querySearchHistory"
          :placeholder="$t('nav.searchPlaceholder')"
          @select="handleSearchSelect"
          @keyup.enter="performSearch"
          ref="searchInputRef"
          :trigger-on-focus="true" 
          :debounce="300"
          clearable
          @clear="onSearchClear"
          class="search-autocomplete"
        >
          <template #prepend>
            <el-icon @click="performSearch" style="cursor:pointer;"><Search /></el-icon>
          </template>
          <template #append>
             <el-button :icon="Close" @click="hideSearch" text style="padding:0 8px; height:100%; border-radius:0;"/>
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
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Search, Close, Clock } from '@element-plus/icons-vue';
import { useSearchHistory } from '@/composables/useSearchHistory';
import { useUiStore } from '@/store/modules/ui';
import { computed } from 'vue'; // Make sure computed is imported

interface SearchSuggestionItem { // Define this interface
  value: string;
  // you can add other properties if your suggestions are more complex
}

const { t } = useI18n();
const router = useRouter();
const uiStore = useUiStore(); // 使用 Pinia store 管理搜索框显隐状态

const searchTerm = ref('');
const searchInputRef = ref<any>(null); // 用于聚焦输入框

const { searchHistory, addToHistory, filterHistory, clearHistory } = useSearchHistory(5); // 最多保存5条

const isSearchVisible = computed(() => uiStore.isSearchVisible);

const showSearch = async () => {
  uiStore.toggleSearch(true);
  await nextTick();
  searchInputRef.value?.focus();
};

const hideSearch = () => {
  uiStore.toggleSearch(false);
  // searchTerm.value = ''; // 可选：隐藏时清空搜索词
};

const onSearchClear = () => {
    // searchTerm.value = ''; // el-autocomplete clearable 会自动清空
    searchInputRef.value?.focus(); // 清空后重新聚焦，方便再次输入
};

const querySearchHistory = (queryString: string, cb: (suggestions: SearchSuggestionItem[]) => void) => {
  const history = filterHistory(queryString); // filterHistory should return string[]
  cb(history.map(itemText => ({ value: itemText }))); // Corrected: use itemText
};

const handleSearchSelect = (item: SearchSuggestionItem) => { // Corrected: item IS a SearchSuggestionItem
  searchTerm.value = item.value; // Now item.value is correctly accessed
  performSearch();
};

const performSearch = () => {
  if (!searchTerm.value.trim()) return;
  addToHistory(searchTerm.value);
  router.push({ name: 'Search', query: { q: searchTerm.value } }); // 跳转到搜索结果页
  // hideSearch(); // 可选：搜索后自动收起
};

// 点击外部区域关闭搜索框
const handleClickOutside = (event: MouseEvent) => {
  const searchBarElement = document.querySelector('.expanding-search-bar');
  if (isSearchVisible.value && searchBarElement &&!searchBarElement.contains(event.target as Node)) {
    hideSearch();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true); // 使用捕获阶段确保先执行
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true);
});

// useSearchHistory Composable 示例
// src/composables/useSearchHistory.ts
// import { ref, readonly } from 'vue';
// const HISTORY_KEY = 'pet-tech-search-history';
// export function useSearchHistory(maxLength = 10) {
//   const history = ref<string>(JSON.parse(localStorage.getItem(HISTORY_KEY) || ''));
//   const addToHistory = (term: string) => {
//     const lowerTerm = term.toLowerCase().trim();
//     if (!lowerTerm) return;
//     history.value =.slice(0, maxLength);
//     localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value));
//   };
//   const filterHistory = (query: string) => {
//     const lowerQuery = query.toLowerCase().trim();
//     if (!lowerQuery) return readonly(history.value);
//     return history.value.filter(term => term.includes(lowerQuery));
//   };
//   const clearHistory = () => {
//     history.value =;
//     localStorage.removeItem(HISTORY_KEY);
//   };
//   return { searchHistory: readonly(history), addToHistory, filterHistory, clearHistory };
// }
</script>

<style scoped lang="scss">

.expanding-search-bar {
display: flex;
align-items: center;
position: relative; // 为了动画定位
margin-left: auto; // 尝试推到右边，具体布局看NavigationBar
height: 40px; // 与输入框高度匹配
}

.search-icon-trigger {
cursor: pointer;
color: var(--el-text-color-regular);
transition: color 0.2s;
&:hover {
color: var(--el-color-primary);
}
}

.search-input-wrapper {
// 初始状态由 transition 控制
}

.search-autocomplete {
// :deep() 用于穿透修改 Element Plus 组件内部样式
:deep(.el-input__wrapper) {
border-radius: 20px; // 圆角搜索框
box-shadow: none; // 去除默认阴影，如果需要
}
:deep(.el-input-group__prepend.el-icon),
:deep(.el-input-group__append.el-button.el-icon) {
font-size: 16px;
}
:deep(.el-input-group__append.el-button) {
background-color: transparent;
border: none;
box-shadow: none;
color: var(--el-text-color-secondary);
&:hover {
color: var(--el-color-primary);
}
}
}

// 横向展开动画
.search-expand-enter-active,
.search-expand-leave-active {
transition: width 0.3s ease-in-out, opacity 0.3s ease-in-out;
overflow: hidden; // 防止内容在动画过程中溢出
}
.search-expand-enter-from,
.search-expand-leave-to {
width: 0;
opacity: 0;
}
.search-expand-enter-to,
.search-expand-leave-from {
width: 220px; // 展开后的宽度，根据设计调整
opacity: 1;
}

// 搜索历史项样式 (在 el-autocomplete 的 slot 中使用)
.search-history-item {
display: flex;
align-items: center;
.el-icon {
margin-right: 8px;
color: var(--el-text-color-secondary);
}
span {
font-size: var(--el-font-size-base);
}
}
// 这里编写只属于 ExpandingSearchBar.vue 的样式
.my-search-input {
 border: 1px solid blue; 
} 
</style>