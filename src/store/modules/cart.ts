// src/store/modules/cart.ts
import { defineStore } from 'pinia';

// Define your CartItem interface (or import it if defined elsewhere)
export interface CartItem {
  id: string | number; // Or just string if IDs are always strings
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [], // Initialize as an empty array of CartItem
  }),
  getters: {
    itemCount: (state): number => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: (state): number => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    // You can also add a getter for items if you want to expose it differently
    // cartItems: (state): CartItem[] => state.items,
  },
  actions: {
    // Example: Ensure product added also conforms to CartItem or part of it
    addToCart(product: Omit<CartItem, 'quantity'> & { quantity?: number }) {
      const existingItem = this.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += (product.quantity || 1);
      } else {
        this.items.push({ ...product, quantity: product.quantity || 1 });
      }
    },
    removeFromCart(productId: string | number) {
      this.items = this.items.filter(item => item.id !== productId);
    },
    updateItemQuantity(productId: string | number, quantity: number) {
      const item = this.items.find(i => i.id === productId);
      if (item) {
        if (quantity > 0) {
          item.quantity = quantity;
        } else {
          this.removeFromCart(productId); // Remove if quantity is 0 or less
        }
      }
    },
    clearCart() {
      this.items = [];
    }
  },
});