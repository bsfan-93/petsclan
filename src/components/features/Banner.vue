<template>
  <div class="banner-wrapper">
    <el-carousel
      v-if="bannerListItems && bannerListItems.length > 0"
      :interval="5000"
      arrow="hover"
      class="banner-carousel"
      height="85vh"
    >
      <el-carousel-item v-for="item in bannerListItems" :key="item.id || item.imageUrl">
        <div class="carousel-item-container">
          <img :src="item.imageUrl" :alt="item.altText" class="banner-image">

          <div class="banner-content-overlay">
            <div class="banner-text-content">
              <h1>Scientific & Healthy</h1>
              <h2>For Pets</h2>
            </div>
            
            <router-link to="/shop/all" custom v-slot="{ navigate }">
              <el-button
                class="shop-now-button"
                @click="navigate"
              >
                SHOP NOW
              </el-button>
            </router-link>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div v-else class="banner-placeholder">
      <p>Banner is loading or not available.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Script 部分无需改动
import { ref, onMounted } from 'vue';
import { fetchBannerDetails, type ApiBannerData } from '@/services/apiClient';

const bannerListItems = ref<ApiBannerData[]>([]);

onMounted(async () => {
  const data = await fetchBannerDetails();
  let dataArray: ApiBannerData[] = [];
  if (Array.isArray(data)) { dataArray = data; }
  else if (data) { dataArray = [data]; }
  bannerListItems.value = dataArray;
});
</script>

<!-- banner图尺寸调整 -->
<style scoped lang="scss">
.banner-wrapper {
  height: 83vh;
  min-height: 400px;
  max-height: 900px;
  line-height: 1;
  background-color: #f0f2f5;
}

// 轮播项的容器，作为定位的基准
.carousel-item-container {
  width: 100%;
  height: 100%;
  position: relative; // 关键：为绝对定位的子元素提供锚点
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover; // 确保图片铺满背景
}

// 轮播图组件的整体样式
.banner-carousel {
  height: 100%;

  :deep(.el-carousel__container) {
    height: 100% !important;
  }

  // --- START: 指示器样式 (您期望的长条形、右下角样式) ---
  :deep(.el-carousel__indicators) {
    position: absolute;
    bottom: 70px; // 指示器组距离底部的距离
    right: 100px;  // 指示器组距离右侧的距离
    left: auto;     // 重置 left 属性
    transform: none;  // 重置 transform 属性
    flex-direction: row;   // 如果指示器默认是垂直排列的，确保它们水平排列
  }

   // 目标：每个指示器的按钮部分 (li > div)
  :deep(.el-carousel__indicator .el-carousel__button) {
    width: 60px;    // 未激活状态下的宽度
    height: 10px;   // 高度
    border-radius: 12px;    // 轻微的圆角
    background-color: #ffffff;    // 设置未激活状态下的背景色和透明度
    opacity: 0.4;   // 半透明效果
    transition: all 0.3s ease-in-out;  
  }
  // 目标：当前激活的那个指示器
  :deep(.el-carousel__indicator.is-active .el-carousel__button) {
    width: 60px;    // 激活时变得更长，并且完全不透明
    opacity: 1;
  }
  
}


// --- START: 内容覆盖层样式 (控制文字和按钮的整体位置) ---
.banner-content-overlay {
  position: absolute;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  
  // 在这里调整文字和按钮这个“整体”的位置
  bottom: 12%; // 距离底部的距离
  left: 10%;   // 距离左侧的距离
}
// --- END: 内容覆盖层样式 ---

.banner-text-content {
  color: #ffffff;
  h1, h2 {
    margin: 0;
    padding: 0;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
  }
  h1 { font-size: 3.5em; font-weight: 700; }
  h2 { font-size: 3em; font-weight: 400; margin-top: 0.2em; }
}

// --- START: “SHOP NOW” 按钮样式与微调 ---
.shop-now-button {
  // 这是按钮与上方文字的间距
  margin-top: 30px; 
  
  // 在这里微调按钮的左右位置
  // 使用负值向左移动，正值向右移动
  // margin-left: -15px; // 示例：向左移动15px

  // 您也可以通过 margin-top 来微调上下位置
  // margin-top: 40px; // 示例：向下移动

  background-color: #757575;
  color: #ffffff;
  border-color: #757575;
  border-radius: 50px;    // 圆角，使其成为椭圆形
  padding: 25px 25px;      // 内边距，控制按钮大小
  font-weight: bold;
  font-size: 14px;
  letter-spacing: 1px;    // 字符间距
  transition: all 0.3s ease;

  &:hover {
    background-color: #333333;
    border-color: #333333;
    transform: scale(1.05);
  }
}
// --- END: “SHOP NOW” 按钮样式与微调 ---


.banner-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #999;
}
</style>