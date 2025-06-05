<template>
  <div class="banner-component-wrapper">
    <div v-if="loading" class="banner-loading">
      Loading banners...
    </div>
    <div v-else-if="errorMessage" class="banner-error">
      <p>Error loading banners: {{ errorMessage }}</p>
      </div>
    <el-carousel
      v-else-if="bannerListItems && bannerListItems.length > 0"
      :interval="3000" arrow="hover" indicator-position="outside" class="banner-carousel custom-indicator-placement"
      height="610px" motion-blur >
      <el-carousel-item v-for="(item, index) in bannerListItems" :key="item.originalUrl || item.imageUrl || index">
        <div class="carousel-item-content">
          <a v-if="item.linkUrl" :href="item.linkUrl" target="_blank" rel="noopener noreferrer" class="banner-link">
            <img :src="item.imageUrl" :alt="item.altText || `Banner ${index + 1}`" class="banner-image-carousel" />
          </a>
          <img v-else :src="item.imageUrl" :alt="item.altText || `Banner ${index + 1}`" class="banner-image-carousel" />
        </div>
      </el-carousel-item>
    </el-carousel>
    <div v-else class="banner-empty">
      <p>No banners to display at the moment.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// Assuming fetchBannerDetails and ApiBannerData are correctly imported from your service
import { fetchBannerDetails, type ApiBannerData } from '@/services/apiClient';

const bannerListItems = ref<ApiBannerData[] | null>(null);
const loading = ref(true);
const errorMessage = ref<string | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    errorMessage.value = null;
    const dataArray = await fetchBannerDetails();

    if (dataArray && dataArray.length > 0) {
      bannerListItems.value = dataArray;
    } else {
      bannerListItems.value = []; // Set to empty array if no data, to distinguish from null/loading
      console.warn('No banner items were received or processed.');
    }
  } catch (e: any) {
    console.error('Failed to load banner items in Banner.vue:', e);
    errorMessage.value = e.message || 'An unknown error occurred while fetching banners.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped lang="scss">
.banner-component-wrapper {
  // If the banner is placed in a section that has padding,
  // you might want to ensure this wrapper doesn't add extra.
  // Or, it could define a specific background for the banner area.
  width: 100%;
}

.banner-carousel {
  // The height is set via the `height` prop on el-carousel.
  // You can add other styling like borders or shadows here if needed.
  border-radius: var(--el-border-radius-base); // Optional: match your theme
  overflow: hidden; // Good practice for carousels
}

.carousel-item-content {
  width: 100%;
  height: 100%;
  display: flex;       // To center image if it's smaller or control its position
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5; // Placeholder background for slides, visible if image is smaller or transparent
}

.banner-link {
  display: block; // Make the link take up space
  width: 100%;
  height: 100%;
}

.banner-image-carousel {
  width: 100%;
  height: 100%;
  object-fit: cover; // Crucial for making images fill the carousel item space well.
                     // Use 'contain' if you need to see the whole image without cropping,
                     // but then ensure .carousel-item-content background is appropriate.
  display: block;    // Removes extra space below inline images
}

.banner-loading,
.banner-error,
.banner-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px; // Give some space for these messages
  padding: 20px;
  text-align: center;
  background-color: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
  color: var(--el-text-color-secondary);
}

.banner-error p {
  color: var(--el-color-danger);
}


// Inside <style scoped lang="scss"> in Banner.vue

.banner-carousel {
  &.custom-indicator-placement {
    position: relative;

    :deep(.el-carousel__indicators--outside) {
      position: absolute;
      bottom: 15px;
      right: 100px;  // CHANGED: Increased from 20px to 50px as an example
      left: auto;
      transform: none;
      text-align: right;
      margin: 0;
      padding: 0;
      z-index: 2;
    }

    // ... your existing styles for making indicators bolder ...
    :deep(.el-carousel__indicator .el-carousel__button) {
      height: 8px;
      width: 60px;   // ADDED/MODIFIED: Set the desired width
      background-color: rgba(255, 255, 255, 0.5);
      opacity: 0.8;
      border-radius: 2px;
      transition: all 0.5s ease;
    }

    :deep(.el-carousel__indicator.is-active .el-carousel__button) {
      height: 10px;
      width: 80px;
      background-color: #FFFFFF;
      opacity: 1;
    }

    :deep(.el-carousel__indicator:not(.is-active):hover .el-carousel__button) {
      background-color: rgba(255, 255, 255, 0.8);
      opacity: 0.9;
    }
  }
}
</style>