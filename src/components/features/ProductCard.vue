<template>
  <router-link v-if="product.link" :to="product.link" class="card-link">
    <el-card shadow="never" class="product-card" :body-style="{ padding: '0' }">
      <div class="card-content-wrapper">
        <el-image :src="product.imageUrl" class="product-image" fit="cover" lazy>
          <template #placeholder>
            <div class="image-placeholder"><span>加载中...</span></div>
          </template>
          <template #error>
            <div class="image-placeholder"><span>图片加载失败</span></div>
          </template>
        </el-image>

        <div class="info-overlay">
          <h3 class="product-name">{{ product.name }}</h3>
          <el-button v-if="product.tag" type="primary" size="small" round class="check-button">
            {{ product.tag }}
          </el-button>
        </div>
      </div>
    </el-card>
  </router-link>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import type { ProductCardData } from '@/services/apiClient';

defineProps({
  product: {
    type: Object as PropType<ProductCardData>,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.card-link {
  text-decoration: none;
}

.product-card {
  border: none;
  border-radius: 30px;
  overflow: hidden;
  text-align: center;
  transition: all 0.3s ease;

  /*
    ↓↓↓ 在这里设置卡片的底色 ↓↓↓
    #f5f7fa 是 Element Plus 常用的一个非常柔和的浅灰色
    您可以替换成任何您想要的灰色，例如 #e9eef3
  */
  background-color: #f5f7fa;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
}

.image-container {
  // 图片区域的背景色，可以和卡片底色不同，也可以设为透明
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
}
.card-content-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  display: block;
}

.product-image {
  width: 100%;
  height: 100%;
  /* 关键：确保图片铺满容器，同时保持自身比例不失真 */
  object-fit: cover; 
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #c0c4cc;
}

.info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  padding: 25px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.product-name {
  margin: 0 0 15px 0;
  font-size: 1.8em;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.check-button {
  background-color: #4a90e2;
  border-color: #4a90e2;
  color: white;
  font-weight: bold;
  padding: 8px 25px;
  height: auto;
  flex-shrink: 0;
  &:hover {
    background-color: #357ABD;
    border-color: #357ABD;
  }
}
</style>