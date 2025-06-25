<template>
  <div class="cart-popover-content">
    <div class="popover-header">
      <h4>{{ $t('cart.title') || 'Shopping Cart' }}</h4>
    </div>
    <el-scrollbar max-height="300px" v-if="cartStore.items.length > 0">
      <ul class="cart-item-list">
        <li v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <el-image :src="item.imageUrl" fit="cover" class="item-image" />
          <div class="item-details">
            <p class="item-name">{{ item.name }}</p>
            <div class="item-meta">
              <span class="item-price">¥{{ item.price.toFixed(2) }}</span>
              <el-input-number
                v-model="item.quantity"
                :min="1"
                :max="99"
                size="small"
                controls-position="right"
                @change="(quantity) => cartStore.updateItemQuantity(item.id, quantity)"
                class="item-quantity-input"
              />
            </div>
          </div>
          <el-button
            type="danger"
            :icon="Delete"
            circle
            text
            size="small"
            @click="cartStore.removeFromCart(item.id)"
            class="remove-item-btn"
          />
        </li>
      </ul>
    </el-scrollbar>
    <div v-else class="empty-cart-message">
      <el-icon :size="40"><ShoppingCartFull /></el-icon>
      <p>{{ $t('cart.empty') || 'Your cart is empty' }}</p>
    </div>
    <div class="popover-footer" v-if="cartStore.items.length > 0">
      <div class="total-section">
        <span>{{ $t('cart.total') || 'Total' }}:</span>
        <span class="total-price">¥{{ cartStore.totalAmount.toFixed(2) }}</span>
      </div>
      <el-button type="primary" @click="goToCartPage" class="view-cart-btn">{{ $t('cart.checkout') || 'Checkout' }}</el-button>
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
  // router.push({ name: 'Cart' }); // TODO: Add a cart page route
  console.log('Navigate to cart page or checkout');
};
</script>

<style scoped lang="scss">
/* Styles are correct, no changes needed here */
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
}
.cart-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--el-border-color-lighter);
  }
}
.item-image {
  width: 60px;
  height: 60px;
  border-radius: var(--el-border-radius-small);
  flex-shrink: 0;
}
.item-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.item-name {
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-primary);
  margin: 0;
  font-weight: 500;
  line-height: 1.3;
}
.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-price {
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-primary);
  font-weight: bold;
}
.item-quantity-input {
  width: 90px;
}
.remove-item-btn {
  flex-shrink: 0;
  margin-left: 8px;
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
}
.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: var(--el-font-size-base);
}
.total-price {
  font-weight: bold;
  font-size: var(--el-font-size-medium);
  color: var(--el-color-primary);
}
.view-cart-btn {
  width: 100%;
}
</style>