// src/composables/useSearchHistory.ts
import { ref, readonly, Ref, onMounted } from 'vue'; // Added onMounted for client-side check

const HISTORY_KEY = 'pet-tech-search-history';

// Define the structure for the return type of the composable
interface UseSearchHistoryReturn {
  searchHistory: Readonly<Ref<string[]>>; // It's an array of strings
  addToHistory: (term: string) => void;
  filterHistory: (query: string) => string[]; // Returns an array of strings
  clearHistory: () => void;
}

export function useSearchHistory(maxLength: number = 5): UseSearchHistoryReturn {
  // Initialize with an empty array, will be populated on client-side mount
  const historyState = ref<string[]>([]);

  // Function to load history from localStorage (client-side only)
  const loadHistory = () => {
    if (typeof window !== 'undefined') {
      try {
        const storedHistory = localStorage.getItem(HISTORY_KEY);
        historyState.value = storedHistory ? JSON.parse(storedHistory) : [];
      } catch (e) {
        console.error("Failed to parse search history from localStorage", e);
        historyState.value = []; // Fallback to empty array on error
      }
    }
  };

  // Function to save history to localStorage (client-side only)
  const saveHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(historyState.value));
    }
  };

  // Load history when the composable is used on the client-side
  // This is important if the composable is instantiated during SSR
  if (typeof window !== 'undefined') {
    loadHistory();
  } else {
    // For SSR, you might still want to call loadHistory in onMounted within the component
    // or ensure this composable is only called client-side.
    // For simplicity here, we assume client-side or onMounted call will handle it.
  }


  const addToHistory = (term: string) => {
    const lowerTerm = term.toLowerCase().trim();
    if (!lowerTerm) return;

    // Remove existing entry to move it to the front
    const newHistory = historyState.value.filter(t => t.toLowerCase() !== lowerTerm);
    newHistory.unshift(lowerTerm); // Add to the beginning

    historyState.value = newHistory.slice(0, maxLength);
    saveHistory();
  };

  const filterHistory = (query: string): string[] => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) {
      return [...historyState.value]; // Return a copy of the full history
    }
    return historyState.value.filter(term => term.toLowerCase().includes(lowerQuery));
  };

  const clearHistory = () => {
    historyState.value = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(HISTORY_KEY);
    }
  };

  return {
    searchHistory: readonly(historyState),
    addToHistory,
    filterHistory,
    clearHistory,
  };
}