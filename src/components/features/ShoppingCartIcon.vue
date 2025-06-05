// src/components/features/ShoppingCartIcon.vue
<template>
  <div class="shopping-cart-icon-wrapper">
    <el-popover
      placement="bottom-end"
      :width="320"
      trigger="hover"
      popper-class="cart-popover"
      :hide-after="100"
      :show-after="200"
    >
      <template #reference>
        <el-badge :value="cartStore.itemCount" class="cart-badge" :hidden="cartStore.itemCount === 0" :max="99">
          <el-icon :size="24" class="cart-icon"><ShoppingCart /></el-icon>
        </el-badge>
      </template>
      <template #default>
        <ShoppingCartPopoverContent />
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ShoppingCart } from '@element-plus/icons-vue';
import ShoppingCartPopoverContent from './ShoppingCartPopoverContent.vue';
import { useCartStore } from '@/store/modules/cart'; // 引入购物车Store

const cartStore = useCartStore();
</script>

<style scoped lang="scss">
.shopping-cart-icon-wrapper {
display: flex;
align-items: center;
height: 100%; // 确保在导航栏中垂直居中
padding: 0 10px; // 给予一些点击空间
cursor: pointer;

 .cart-icon {
    color: var(--el-text-color-regular); // 或导航栏文字颜色
    &:hover {
      color: var(--el-color-primary);
    }
  }
  
  // 调整徽标位置
  :deep(.el-badge__content.is-fixed) {
    top: 8px;
    right: 18px; 
  }
}
</style>