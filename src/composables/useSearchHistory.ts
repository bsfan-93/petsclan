// src/composables/useSearchHistory.ts

import { ref, readonly } from 'vue';

const HISTORY_KEY = 'pet-tech-search-history';
const MAX_LENGTH = 5; // 你可以把最大长度定义在这里

export function useSearchHistory(maxLength: number = MAX_LENGTH) {
  const historyState = ref<string[]>([]);

  // 1. 从 localStorage 加载历史记录
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      // 修复了 bug: 确保解析的是一个有效的 JSON 数组字符串
      historyState.value = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load or parse search history:", e);
      historyState.value = []; // 出错时重置为空数组
    }
  };

  // 2. 保存历史记录到 localStorage
  const saveHistory = () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyState.value));
  };

  // 3. 添加新记录
  const addToHistory = (term: string) => {
    const lowerTerm = term.toLowerCase().trim();
    if (!lowerTerm) return;

    // 移除已存在的相同记录，确保新的排在最前面
    const newHistory = historyState.value.filter(t => t.toLowerCase() !== lowerTerm);
    newHistory.unshift(lowerTerm); // 添加到最前面

    historyState.value = newHistory.slice(0, maxLength); // 裁剪到最大长度
    saveHistory();
  };

  // 4. 过滤历史记录以供建议列表使用
  const filterHistory = (query: string): string[] => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) {
      return [...historyState.value]; // 没有输入时返回全部历史
    }
    return historyState.value.filter(term => term.toLowerCase().includes(lowerQuery));
  };

  // 5. 清空历史记录
  const clearHistory = () => {
    historyState.value = [];
    localStorage.removeItem(HISTORY_KEY);
  };

  return {
    searchHistory: readonly(historyState),
    loadHistory, // 暴露出 loadHistory 方法
    addToHistory,
    filterHistory,
    clearHistory,
  };
}