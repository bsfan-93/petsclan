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
      <h2 class="follow-title">{{ $t('home.follow.title') }}</h2>
      <Carousel v-bind="carouselSettings" class="follow-carousel">
        <Slide v-for="image in followImages" :key="image.id">
          <div class="carousel__item">
            <img :src="image.src" class="follow-image">
          </div>
        </Slide>
        <template #addons>
          <Navigation />
        </template>
      </Carousel>
    </div>

    <HealthSection />

  </div>
</template>

<script setup lang="ts">
// 脚本部分保持您现有的设置
import { ref, onMounted } from 'vue';
import Banner from '@/components/features/Banner.vue';
import ProductCard from '@/components/features/ProductCard.vue';
import { fetchProductCards, type ProductCardData, fetchFollowImages, type FollowImageData } from '@/services/apiClient';
import { Carousel, Navigation, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import HealthSection from '@/components/features/HealthSection.vue';

const products = ref<ProductCardData[]>([]);
const followImages = ref<FollowImageData[]>([]);

const carouselSettings = {
  itemsToShow: 2.5,
  snapAlign: 'center',
  wrapAround: true,
  // ↓↓↓ 在这里修改数值来调整轮播时间 ↓↓↓
  autoplay: 5000,
  transition: 500,
};

onMounted(async () => {
  try {
    const [productData, followImageData] = await Promise.all([
      fetchProductCards(),
      fetchFollowImages()
    ]);
    products.value = productData.slice(0, 3);
    followImages.value = followImageData;
  } catch (error) { console.error(error); }
});
</script>

<style scoped lang="scss">
/* 您原有的样式保持不变 */
.home-page { width: 100%; }
.banner-section { line-height: 0; }
.content-section { padding: 80px 20px; position: relative; }
.main-title {
  position: absolute;
  top: -20px; 
  left: 130px; 
  font-size: 2.8em;
  font-weight: 600;
  line-height: 1.2;
  > span { display: block; }
}
.product-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 30px; align-items: start; 
  margin-top: 200px;
}
.fountain-item { position: relative; margin-top: 180px; }

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
  
  .follow-image {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .carousel__slide:not(.carousel__slide--active) {
    filter: blur(2px);
    opacity: 0.6;
    transform: scale(0.9);
  }
  .carousel__slide--active {
    transform: scale(1.05);
    z-index: 10;
  }
  
  /* --- START: 整理合并后的箭头样式 --- */
  
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
  fill: #00000000;   /* 图标的填充色 */
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