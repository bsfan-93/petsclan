// src/store/modules/ui.ts
import { defineStore } from 'pinia';

interface UiState {
  isSearchVisible: boolean;
  headerHeight: number;
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    isSearchVisible: false, // Ensure this is present
    headerHeight: 60,
  }),
  actions: {
    toggleSearch(visible?: boolean) { // Ensure this action is present and named correctly
      this.isSearchVisible = visible === undefined ? !this.isSearchVisible : visible;
    },
    setHeaderHeight(height: number) {
      this.headerHeight = height;
    },
  },
});