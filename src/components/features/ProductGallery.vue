// src/components/features/ProductGallery.vue
<template>
  <div class="product-gallery">
    <Carousel id="gallery" :items-to-show="1" :wrap-around="false" v-model="currentSlide">
      <Slide v-for="(image, index) in images" :key="`gallery-${index}`">
        <div class="carousel__item">
          <img :src="image.full" :alt="image.alt || 'Product Image'" class="main-image" />
        </div>
      </Slide>
    </Carousel>

    <Carousel
      id="thumbnails"
      :items-to-show="thumbnailCount"
      :wrap-around="true"
      v-model="currentSlide"
      ref="carousel"
      class="thumbnails-carousel"
    >
      <Slide v-for="(image, index) in images" :key="`thumb-${index}`">
        <div class="carousel__item thumbnail-item" @click="slideTo(index)">
          <img :src="image.thumb" :alt="image.alt || `Product Thumbnail ${index + 1}`" class="thumbnail-image" :class="{ 'active-thumbnail': index === currentSlide }" />
        </div>
      </Slide>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css'; // 引入 vue3-carousel 的 CSS

interface ProductImage {
  id: string | number;
  full: string; // 大图 URL
  thumb: string; // 缩略图 URL
  alt?: string;
}

interface Props {
  images: ProductImage[];
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [] // Default to an empty array
});


const currentSlide = ref(0);
const carousel = ref<any>(null); // 用于直接控制缩略图轮播

// 动态计算缩略图数量，例如最多显示4个，可根据实际UI调整
const thumbnailCount = computed(() => Math.min(props.images.length, 4));

function slideTo(index: number) {
  currentSlide.value = index;
}

// 如果需要在大图切换时，确保缩略图轮播也滚动到对应位置 (如果缩略图很多且会滚动)
watch(currentSlide, (newVal) => {
  if (carousel.value) {
    // vue3-carousel 的 slideTo 方法可能需要通过其实例调用
    // 这里仅为示例，具体API请查阅 vue3-carousel 文档
    // carousel.value.slideTo(newVal);
  }
});

onMounted(() => {
  // 初始加载时可以做一些事情，如果需要的话
  if (props.images.length === 0) {
    console.warn('ProductGallery: No images provided.');
  }
});

</script>

<style scoped lang="scss">
.product-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px; // 或者根据您的布局调整
  margin: auto;
}

#gallery {
  width: 100%;
  margin-bottom: 10px;

  .carousel__item {
    width: 100%;
    height: auto; // 根据图片比例调整或固定
    max-height: 400px; // 示例最大高度
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: var(--el-border-radius-base);
  }

  .main-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain; // 或 'cover' 根据需求
  }
}

#thumbnails {
  width: 100%; // 确保缩略图容器宽度足够

  .carousel__item.thumbnail-item {
    padding: 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    height: 80px; // 调整缩略图项的高度
  }

  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 2px solid transparent;
    border-radius: var(--el-border-radius-small);
    transition: border-color 0.3s;

    &:hover {
      border-color: var(--el-color-primary-light-3);
    }

    &.active-thumbnail {
      border-color: var(--el-color-primary);
    }
  }
}

// Element Plus CSS 变量 (示例，确保在全局或此组件中可访问)
// :root { // 如果是在全局CSS中定义
//   --el-border-color-lighter: #EBEEF5;
//   --el-border-radius-base: 4px;
//   --el-border-radius-small: 2px;
//   --el-color-primary: #409EFF;
//   --el-color-primary-light-3: #79bbff;
// }
</style>