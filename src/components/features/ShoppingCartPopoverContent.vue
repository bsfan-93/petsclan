<template>
  <div class="cart-popover-content">
    <div class="popover-header">
      <h4>{{ $t('cart.title') }}</h4>
    </div>
    <el-scrollbar max-height="300px" v-if="cartStore.items.length > 0">
      <ul class="cart-item-list">
        <li v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <el-image :src="item.imageUrl" fit="cover" class="item-image" />
          <div class="item-details">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-price-quantity">{{ item.quantity }} x ¥{{ item.price.toFixed(2) }}</p>
          </div>
          <el-button
            type="danger"
            :icon="Delete"
            circle
            plain
            size="small"
            @click="cartStore.removeFromCart(item.id)"
            class="remove-item-btn"
          />
        </li>
      </ul>
    </el-scrollbar>
    <div v-else class="empty-cart-message">
      <el-icon :size="40"><ShoppingCartFull /></el-icon>
      <p>{{ $t('cart.empty') }}</p>
    </div>
    <div class="popover-footer" v-if="cartStore.items.length > 0">
      <div class="total-section">
        <span>{{ $t('cart.total') }}:</span>
        <span class="total-price">¥{{ cartStore.totalAmount.toFixed(2) }}</span>
      </div>
      <el-button type="primary" @click="goToCartPage" class="view-cart-btn">{{ $t('cart.checkout') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/modules/cart';
import { Delete, ShoppingCartFull } from '@element-plus/icons-vue';

const { t } = useI18n();
const router = useRouter();
const cartStore = useCartStore();

const goToCartPage = () => {
  // router.push({ name: 'Cart' }); // 假设有购物车页面路由
  console.log('Navigate to cart page or checkout');
};

// Pinia store (cart.ts) 示例:
// import { defineStore } from 'pinia';
// interface CartItem { id: string; name: string; price: number; quantity: number; imageUrl: string; }
// export const useCartStore = defineStore('cart', {
//   state: () => ({
//     items: as CartItem,
//   }),
//   getters: {
//     itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
//     totalAmount: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
//   },
//   actions: {
//     addToCart(product: Omit<CartItem, 'quantity'>) { /*... */ },
//     removeFromCart(productId: string) { this.items = this.items.filter(item => item.id!== productId); },
//     updateQuantity(productId: string, quantity: number) { /*... */ },
//   },
// });
</script>

<style scoped lang="scss">
.cart-popover-content {
display: flex;
flex-direction: column;
}
.popover-header {
padding: 12px 16px;
border-bottom: 1px solid var(--el-border-color-lighter);
h4 {
margin: 0;
font-size: var(--el-font-size-medium);
font-weight: 600;
}
}
.cart-item-list {
list-style: none;
padding: 0;
margin: 0;
.cart-item {
display: flex;
align-items: center;
padding: 12px 16px;
&:not(:last-child) {
border-bottom: 1px solid var(--el-border-color-lighter);
}
.item-image {
width: 50px;
height: 50px;
margin-right: 12px;
border-radius: var(--el-border-radius-small);
flex-shrink: 0;
}
.item-details {
flex-grow: 1;
.item-name {
font-size: var(--el-font-size-base);
color: var(--el-text-color-primary);
margin: 0 0 4px 0;
// 省略号处理
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
max-width: 150px; // 根据宽度调整
}
.item-price-quantity {
font-size: var(--el-font-size-small);
color: var(--el-text-color-secondary);
margin: 0;
}
}
.remove-item-btn {
margin-left: auto;
flex-shrink: 0;
}
}
}
.empty-cart-message {
padding: 30px 16px;
text-align: center;
color: var(--el-text-color-secondary);
.el-icon {
color: var(--el-text-color-placeholder);
margin-bottom: 10px;
}
p {
margin: 0;
font-size: var(--el-font-size-base);
}
}
.popover-footer {
padding: 12px 16px;
border-top: 1px solid var(--el-border-color-lighter);
.total-section {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 12px;
font-size: var(--el-font-size-base);
.total-price {
font-weight: bold;
font-size: var(--el-font-size-medium);
color: var(--el-color-primary);
}
}
.view-cart-btn {
width: 100%;
}
}
</style>