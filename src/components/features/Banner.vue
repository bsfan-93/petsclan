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
import { ref, onMounted } from 'vue';
// ✨ 修正：使用了正确的函数名 fetchBannerDetails
import { fetchBannerDetails, type ApiBannerData } from '@/services/apiClient';

const bannerListItems = ref<ApiBannerData[]>([]);

// onMounted 钩子确保 API 请求只在组件首次加载时执行一次
onMounted(async () => {
  try {
    // ✨ 修正：调用了正确的 API 函数
    const data = await fetchBannerDetails();
    let dataArray: ApiBannerData[] = [];
    if (Array.isArray(data)) {
      dataArray = data;
    } else if (data) {
      dataArray = [data];
    }
    bannerListItems.value = dataArray;
  } catch (error) {
    console.error("Failed to load banner details:", error);
    bannerListItems.value = []; // 出错时设置为空数组，防止页面崩溃
  }
});
</script>

<style scoped lang="scss">
.banner-wrapper {
  height: 83vh;
  min-height: 400px;
  max-height: 900px;
  line-height: 1;
  background-color: #f0f2f5;
}

.carousel-item-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-carousel {
  height: 100%;
  :deep(.el-carousel__container) {
    height: 100% !important;
  }
  :deep(.el-carousel__indicators) {
    position: absolute;
    bottom: 70px;
    right: 100px;
    left: auto;
    transform: none;
    flex-direction: row;
  }
  :deep(.el-carousel__indicator .el-carousel__button) {
    width: 60px;
    height: 10px;
    border-radius: 12px;
    background-color: #ffffff;
    opacity: 0.4;
    transition: all 0.3s ease-in-out;  
  }
  :deep(.el-carousel__indicator.is-active .el-carousel__button) {
    width: 60px;
    opacity: 1;
  }
}

.banner-content-overlay {
  position: absolute;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  bottom: 12%;
  left: 10%;
}

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

.shop-now-button {
  margin-top: 30px;
  background-color: #757575;
  color: #ffffff;
  border-color: #757575;
  border-radius: 50px;
  padding: 25px 25px;
  font-weight: bold;
  font-size: 14px;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  &:hover {
    background-color: #333333;
    border-color: #333333;
    transform: scale(1.05);
  }
}

.banner-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #999;
}
</style>