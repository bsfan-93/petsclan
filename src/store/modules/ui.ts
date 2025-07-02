// src/store/modules/ui.ts
import { defineStore } from 'pinia';

interface UiState {
  isSearchVisible: boolean;
  headerHeight: number;
  isSubscriptionModalVisible: boolean;
  isFullScreenSearchVisible: boolean; // <--- 新增：控制全屏搜索的可见性
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    isSearchVisible: false,
    headerHeight: 60,
    isSubscriptionModalVisible: false,
    isFullScreenSearchVisible: false, // <--- 新增
  }),
  actions: {
    toggleSearch(visible?: boolean) {
      this.isSearchVisible = visible === undefined ? !this.isSearchVisible : visible;
    },
    setHeaderHeight(height: number) {
      this.headerHeight = height;
    },
    setSubscriptionModalVisible(visible: boolean) {
      this.isSubscriptionModalVisible = visible;
    },
    // <--- 新增 Action ---
    setFullScreenSearchVisible(visible: boolean) {
      this.isFullScreenSearchVisible = visible;
    },
  },
});