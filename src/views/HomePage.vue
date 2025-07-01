<template>
  <div class="home-page">
    <div class="banner-section">
      <Banner />
    </div>

    <div class="content-section">
      <el-row justify="center">
        <el-col :xs="24" :sm="22" :md="20" :lg="20" :xl="18">
          <h2 class="main-title">
            <span>Intelligent Exploration and</span>
            <span>Classification</span>
          </h2>
          <div class="product-grid">
            <div class="grid-item leash-item">
              <ProductCard v-if="products[0]" :product="products[0]" />
            </div>
            <div class="grid-item fountain-item">
              <ProductCard v-if="products[1]" :product="products[1]" />
            </div>
            <div class="grid-item feeder-item">
              <ProductCard v-if="products[2]" :product="products[2]" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="follow-section">
      <h2 class="follow-title">{{ $t('Follow along for more') }}</h2>
      <Carousel v-bind="carouselSettings" class="follow-carousel">
        <Slide v-for="image in followImages" :key="image.id">
          <div class="carousel__item">
            <img :src="image.src" class="follow-image" alt="Follow along image">
          </div>
        </Slide>
        <template #addons>
          <Navigation />
        </template>
      </Carousel>
    </div>

    <HealthSection />
    
    <SubscriptionModal />
  </div>
</template>

<script setup lang="ts">
// 1. 所有的 import 语句放在最前面，用于引入外部模块和组件

// 从 'vue' 中导入核心功能：ref用于创建响应式变量，onMounted是生命周期钩子，computed是计算属性，watchEffect用于响应式地执行副作用
import { ref, onMounted, computed, watchEffect } from 'vue';
// 从 'vue3-carousel' 库中导入轮播图相关的组件
import { Carousel, Navigation, Slide } from 'vue3-carousel';
// 导入轮播图库所需的基础CSS样式
import 'vue3-carousel/dist/carousel.css';
// 导入用于管理UI状态的Pinia store
import { useUiStore } from '@/store/modules/ui';
// 导入我们为轮播图缓存创建的Pinia store
import { useContentStore } from '@/store/modules/content';
// 导入所有API请求函数
import * as apiClient from '@/services/apiClient';
// 导入API相关的数据类型定义
import type { ProductCardData, FollowImageData } from '@/services/apiClient';
// 导入子组件
import Banner from '@/components/features/Banner.vue';
import ProductCard from '@/components/features/ProductCard.vue';
import HealthSection from '@/components/features/HealthSection.vue';
import SubscriptionModal from '@/components/features/SubscriptionModal.vue';

// 2. 图片预加载的辅助函数
/**
 * 预加载一组图片到浏览器缓存中
 * @param urls - 包含图片链接的字符串数组
 */
function preloadImages(urls: string[]) {
  // 遍历URL数组
  urls.forEach(url => {
    // 创建一个新的Image对象（它存在于内存中，但不会显示在页面上）
    const img = new Image();
    // 将Image对象的src设置为目标URL，这个操作会触发浏览器在后台下载该图片
    img.src = url;
  });
}

// 3. 声明组件所需的状态
// 创建一个名为 'products' 的响应式数组，用于存储产品卡片的数据
const products = ref<ProductCardData[]>([]);
// 获取UI store的实例，用于控制弹窗等
const uiStore = useUiStore();
// 获取内容缓存store的实例
const contentStore = useContentStore();
// 创建一个计算属性 'followImages'，它的值会自动从 contentStore.images 中获取
const followImages = computed(() => contentStore.images);
// 定义一个对象，存储轮播图的所有配置参数
const carouselSettings = {
  itemsToShow: 3, // 同时显示2.5个项目
  snapAlign: 'center', // 对齐方式为居中
  wrapAround: true, // 开启无限循环滚动
  autoplay: 5000, // 每5秒自动播放
  transition: 500, // 过渡动画时间为500毫秒
};

// 4. 使用 watchEffect 自动预加载图片
// watchEffect 会自动追踪其内部依赖的数据（这里是 followImages）
watchEffect(() => {
  // 当 followImages 数组有值并且长度不为0时，执行以下代码
  if (followImages.value && followImages.value.length > 0) {
    // 使用 .map 从对象数组中提取出所有图片的 src 链接，形成一个新数组
    const imageUrls = followImages.value.map(image => image.src);
    // 调用预加载函数，开始在后台下载所有图片
    preloadImages(imageUrls);
  }
});

// 5. onMounted 生命周期钩子，在组件被挂载到页面后执行
onMounted(async () => {
  // 使用 try...catch 来捕获异步操作中可能发生的错误
  try {
    // a. 调用缓存模块的方法来获取轮播图数据（此方法内部有缓存逻辑，确保API只请求一次）
    await contentStore.ensureImagesFetched();

    // b. 主页只获取自己需要的产品卡片数据
    const productData = await apiClient.fetchProductCards();
    // 如果成功获取到产品数据
    if (productData) {
      // 从所有产品中只截取前3个用于在首页显示
      products.value = productData.slice(0, 3);
    }
    
    // c. 处理订阅弹窗逻辑
    // 从 sessionStorage 中检查用户之前是否关闭过弹窗
    const hasSeenModal = sessionStorage.getItem('subscriptionModalClosed');
    // 如果用户没关闭过
    if (!hasSeenModal) {
      // 设置一个定时器，在3秒后执行
      setTimeout(() => {
        // 调用UI store中的方法，将弹窗设置为可见状态
        uiStore.setSubscriptionModalVisible(true);
      }, 3000);
    }
  } catch (error) { 
    // 如果 try 代码块中发生任何错误，在这里捕获并打印到控制台
    console.error("Failed to load home page data:", error);
  }
});
</script>

<style scoped lang="scss">
.home-page {
  width: 100%;
}
.banner-section {
  line-height: 0;
}
.content-section {
  padding: 80px 20px;
  position: relative;
}
.main-title {
  position: absolute;
  top: -20px;
  left: 130px;
  font-size: 2.8em;
  font-weight: 600;
  line-height: 1.2;
  > span {
    display: block;
  }
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  align-items: start;
  margin-top: 200px;
}
.fountain-item {
  position: relative;
  margin-top: 180px;
}

/* "Follow along for more" 区域的样式 */
.follow-section {
  padding: 60px 0 80px 0;
  text-align: center;
  background-color: #f9f9f9;
  overflow: hidden;
}

.follow-title {
  font-size: 2.5em;
  font-weight: 500;
  margin-bottom: 50px;
}

.follow-carousel {
  .carousel__item {
    padding: 0 8px;
  }

  /* 1. 为当前激活的卡片定义一个CSS变量，并设置放大效果 */
  .carousel__slide--active {
    --image-fit: cover; /* 定义一个名为 --image-fit 的变量，并将其值设为 cover (铺满) */
    transform: scale(1.05);
    z-index: 10;
    opacity: 1;
    filter: none;
  }

  /* 2. 为非激活的卡片设置缩小和模糊效果 */
  .carousel__slide:not(.carousel__slide--active) {
    filter: blur(2px);
    opacity: 0.6;
    transform: scale(0.9);
  }

  /* 3. 让所有图片的 object-fit 样式都使用这个变量 */
  .follow-image {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    /* 关键：使用 var() 函数来读取 --image-fit 变量的值 */
    /* 如果变量不存在（即在非激活卡片中），则使用默认值 contain (完整显示) */
    object-fit: var(--image-fit, contain);
    background-color: #f0f0f0; /* 为可能出现的留白区域添加背景色 */
    transition: all 0.4s ease; /* 添加平滑的过渡动画 */
  }

  /* --- 整理合并后的箭头样式 --- */
  /* 1. 在这里控制箭头的“整体大小”和“可点击区域” */
  :deep(.carousel__prev),
  :deep(.carousel__next) {
    /* ↓↓↓ 调整这里的 width 和 height 来改变大小 ↓↓↓ */
    width: 110px;
    height: 110px;

    /* 其他基础样式 */
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    cursor: pointer;
    margin: 0;
    padding: 0;
  }

  /* 2. 在这里控制箭头图标的“外观”（颜色和粗细） */
  :deep(.carousel__prev .carousel__icon),
  :deep(.carousel__next .carousel__icon) {
    /* 图标大小会自动充满上面的容器 */
    width: 100%;
    height: 100%;

    /* ↓↓↓ 调整这里的 stroke-width 来改变粗细 ↓↓↓ */
    stroke-width: 0; /* 示例值。数值越大，线条越粗。*/

    /* ↓↓↓ 调整这里的 fill 和 stroke 来改变颜色 ↓↓↓ */
    fill: #00000000; /* 图标的填充色 */
    stroke: #00000000; /* 图标的描边色，通常和填充色一致 */
    transition: all 0.5s ease;
  }

  /* 3. 控制鼠标悬停时的图标颜色 */
  :deep(.carousel__prev:hover .carousel__icon),
  :deep(.carousel__next:hover .carousel__icon) {
    fill: #000000;
    stroke: #000000;
  }

  /* 4. 控制箭头的位置 */
  :deep(.carousel__prev) {
    left: 2%;
  }
  :deep(.carousel__next) {
    right: 2%;
  }
}
</style>