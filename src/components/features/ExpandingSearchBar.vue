<template>
  <div class="expanding-search-container" ref="searchContainerRef">
    <el-icon v-if="!isExpanded" @click="expand" class="search-trigger-icon">
      <Search />
    </el-icon>

    <transition name="search-expand">
      <div v-if="isExpanded" class="search-input-wrapper">
        <el-input
          v-model="searchQuery"
          placeholder="Search..."
          :prefix-icon="Search"
          @keyup.enter="performSearchAndNavigate"
          ref="searchInputRef"
          clearable
        />
        <div v-if="isDropdownVisible" class="search-results-dropdown">
          <div v-if="isLoading" class="results-message">Loading...</div>
          <div v-else-if="results.length === 0 && searchQuery" class="results-message">
            No results for "{{ searchQuery }}"
          </div>
          <ul v-else-if="results.length > 0" class="results-list">
            <li v-for="item in results" :key="item.id" class="result-item">
              <router-link :to="`/product/${item.id}`" class="result-link" @click="collapse">
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
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import { fetchSearchResults, type SearchResultItem } from '@/services/apiClient';
import { onClickOutside } from '@vueuse/core';

const router = useRouter();

const isExpanded = ref(false);
const searchQuery = ref('');
const results = ref<SearchResultItem[]>([]);
const isLoading = ref(false);
const isDropdownVisible = ref(false);
const searchContainerRef = ref(null);
const searchInputRef = ref<any>(null);

let debounceTimer: number;

// 监听搜索词的变化，实现模糊搜索
watch(searchQuery, (newQuery) => {
  clearTimeout(debounceTimer);
  if (!newQuery.trim()) {
    results.value = [];
    isDropdownVisible.value = false;
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
  isDropdownVisible.value = true;
  results.value = await fetchSearchResults(searchQuery.value);
  isLoading.value = false;
};

// 展开搜索框
const expand = async () => {
  isExpanded.value = true;
  await nextTick();
  searchInputRef.value?.focus();
};

// 收起搜索框
const collapse = () => {
  isExpanded.value = false;
  isDropdownVisible.value = false;
  searchQuery.value = '';
};

// 按回车键，直接跳转到完整的搜索结果页
const performSearchAndNavigate = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${searchQuery.value.trim()}`);
    collapse();
  }
};

// 点击组件外部区域时，收起搜索框
onClickOutside(searchContainerRef, collapse);
</script>

<style scoped lang="scss">
.expanding-search-container {
  position: relative;
  display: flex;
  align-items: center;
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
  &:hover { color: var(--el-color-primary); }
}

.search-input-wrapper {
  position: relative;
}

.search-expand-enter-active,
.search-expand-leave-active {
  transition: width 0.3s ease-in-out;
  overflow: hidden;
}
.search-expand-enter-from,
.search-expand-leave-to {
  width: 0;
}
.search-expand-enter-to,
.search-expand-leave-from {
  width: 250px;
}

.search-results-dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  width: 300px; /* 您可以按需加宽 */
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1100;
  max-height: 400px;
  overflow-y: auto;
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.result-link {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  gap: 15px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
}

.result-image {
  width: 50px;
  height: 50px;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  margin-bottom: 4px;
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
</style>