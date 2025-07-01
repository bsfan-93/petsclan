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
      :offset="0"
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
  height: 100%;
  padding: 0 10px;
  cursor: pointer;

  .cart-icon {
    color: var(--el-text-color-regular);
    &:hover {
      color: var(--el-color-primary);
    }
  }

  :deep(.el-badge__content.is-fixed) {
    top: 8px;
    right: 18px;
  }
}
</style>

<style lang="scss">
/*
  这个不带 scoped 的 style 块里的样式是全局性的，
  可以修改由 Element Plus 渲染到 body 下的弹窗面板。
*/
.el-popover.el-popper.cart-popover {
  /* 强制将由JS计算的顶部外边距设为0，解决间距问题 */
  margin-top: 0px !important;

  /* 在这里统一设置其他样式，确保生效 */
  border-radius: 12px !important;
  border: 1px solid #E4E7ED !important;
  box-shadow: var(--el-box-shadow-light) !important;
}
</style>