<template>
  <div class="banner-wrapper">
    <el-carousel
      v-if="bannerListItems && bannerListItems.length > 0"
      :interval="5000"
      arrow="never"
      class="banner-carousel"
      height="85vh"
    >
      <el-carousel-item v-for="item in bannerListItems" :key="item.id || item.imageUrl">
        <div class="carousel-item-container">
          <img :src="item.imageUrl" :alt="item.altText" class="banner-image">

          <div class="banner-content-overlay">
            <div class="banner-text-content">
              <h1>PETS CLAN</h1>
              <h2>EFFORTLESS</h2>
              <h3>PET CARE.</h3>
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
// 从 'vue' 中导入核心功能：ref用于创建响应式变量，onMounted是生命周期钩子
import { ref, onMounted } from 'vue';
// 导入API客户端中获取Banner详情的函数和相关的数据类型定义
import { fetchBannerDetails, type ApiBannerData } from '@/services/apiClient';

// 创建一个名为 'bannerListItems' 的响应式数组，用于存储从API获取的Banner数据
const bannerListItems = ref<ApiBannerData[]>([]);

// onMounted 是一个生命周期钩子，它会在组件被挂载到页面后执行一次
onMounted(async () => {
  // 使用 try...catch 来捕获异步API请求中可能发生的错误
  try {
    // 调用API函数异步获取Banner数据
    const data = await fetchBannerDetails();
    // 创建一个空数组用于存放处理后的数据
    let dataArray: ApiBannerData[] = [];
    // 检查返回的data是否是一个数组
    if (Array.isArray(data)) {
      // 如果是数组，直接赋值
      dataArray = data;
    // 检查返回的data是否存在（处理返回单个对象的情况）
    } else if (data) {
      // 如果是单个对象，将其放入数组中
      dataArray = [data];
    }
    // 将处理好的数据赋值给响应式变量 bannerListItems，这将触发模板的更新
    bannerListItems.value = dataArray;
  // 如果在 try 代码块中发生错误
  } catch (error) {
    // 在浏览器的控制台中打印错误信息，方便调试
    console.error("Failed to load banner details:", error);
    // 在出错时将列表设置为空数组，可以防止页面因数据格式不正确而崩溃
    bannerListItems.value = [];
  }
});
</script>

<style scoped lang="scss">
/* Banner根容器的样式 */
.banner-wrapper {
  height: 90vh;
  min-height: 400px;
  max-height: 970px;
  line-height: 1;
  background-color: #f0f2f5;
}

/* 轮播卡片内部容器的样式 */
.carousel-item-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* Banner图片的样式 */
.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 轮播组件本身的样式 */
.banner-carousel {
  height: 100%;

  /* --- 最终修正：使用 !important 强制覆盖指示器样式 --- */

  /* 默认状态（未激活）的指示器按钮 */
  :deep(.el-carousel__indicator .el-carousel__button) {
    width: 60px !important;
    height: 12px !important;
    background-color: white !important;
    border-radius: 12px !important;
    opacity: 0.5 !important;
    transition: all 0.3s ease !important;
  }

  /* 当前激活的指示器按钮 */
  :deep(.el-carousel__indicator.is-active .el-carousel__button) {
    width: 90px !important;
    opacity: 1 !important;
  }
  /* --- 新增：控制指示器整体位置 --- */
  :deep(.el-carousel__indicators) {
    /* 使用绝对定位，让它脱离文档流，可以在容器内自由移动 */
    position: absolute;

    /* --- 您可以在这里自由调整位置 --- */
    bottom: 110px; /* 控制指示器距离 Banner 底部的距离 */
    right: 110px; /* 控制指示器距离 Banner 右侧的距离 */

    /* --- 以下是辅助样式，通常无需修改 --- */
    left: auto; /* 取消左侧的自动定位，确保以右侧为基准 */
    transform: translateX(0); /* 取消Element Plus默认的水平居中(translateX(-50%)) */
  }
}

/* 图片上层覆盖内容的容器样式 */
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

/* 文字内容的容器样式 */
.banner-text-content {
  color: #ffffff;
  
  h1,h2,h3 {
    margin: 5px;
    padding: 0;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
  }
  h1 {
    font-size: 3.5em;
    font-weight: 700;
  }
  h2 {
    font-size: 3.5em;
    font-weight: 700;
  }
  h3 {
    font-size: 3.5em;
    font-weight: 700;
  }
  // h2 {
  //   font-size: 3em;
  //   font-weight: 400;
  //   margin-top: 0.2em;
  // }
  
}

/* "SHOP NOW" 按钮的样式 */
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

/* 数据加载时占位符的样式 */
.banner-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #999;
}

</style>