// src/store/modules/ui.ts
import { defineStore } from 'pinia';

interface UiState {
  isSearchVisible: boolean;
  headerHeight: number;
  isSubscriptionModalVisible: boolean; // ✨ 新增状态
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    isSearchVisible: false,
    headerHeight: 60,
    isSubscriptionModalVisible: false, // ✨ 新增状态
  }),
  actions: {
    toggleSearch(visible?: boolean) {
      this.isSearchVisible = visible === undefined ? !this.isSearchVisible : visible;
    },
    setHeaderHeight(height: number) {
      this.headerHeight = height;
    },
    // ✨ 新增 action
    setSubscriptionModalVisible(visible: boolean) {
      this.isSubscriptionModalVisible = visible;
    },
  },
});