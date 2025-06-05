<template>
  <div class="home-page" :style="{ paddingTop: dynamicHeaderHeight + 'px' }">
    <el-row justify="center" class="section banner-outer-section">
      <el-col :xs="24"> <Banner />
      </el-col>
    </el-row>

    <el-row justify="center" class="section product-gallery-section">
      <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
        <ProductGallery :images="productImages" />
      </el-col>
    </el-row>

    <el-row justify="center" class="section features-section">
      <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
        <h2>{{ $t('home.featuresTitle') }}</h2>
        <el-row :gutter="20">
          <el-col :md="8" v-for="n in 3" :key="n">
            <el-card shadow="hover">
              <template #header>
                <div>{{ $t(`home.feature${n}.title`) }}</div>
              </template>
              <div>{{ $t(`home.feature${n}.description`) }}</div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ProductGallery from '@/components/features/ProductGallery.vue';
import Banner from '@/components/features/Banner.vue'; // 1. Import the Banner component
import { useUiStore } from '@/store/modules/ui'; // Assuming uiStore manages header height
// import { fetchProductImages } from '@/services/apiClient'; // Your service for product images

const { t } = useI18n();
const uiStore = useUiStore();

// Initialize productImages as an empty array.
// If ProductGallery.vue has a default for its 'images' prop (e.g., using withDefaults),
// this initialization is good for consistency but the child handles undefined better.
const productImages = ref<any[]>([]); // Replace 'any' with your ProductImage interface if available

const dynamicHeaderHeight = computed(() => uiStore.headerHeight);

onMounted(async () => {
  // The Banner component will fetch its own data in its onMounted hook.
  // No need to call banner fetching logic here unless you want to coordinate.

  // Example for fetching product images (keep your existing logic or implement)
  // try {
  //   productImages.value = await fetchProductImages();
  // } catch (error) {
  //   console.error("Failed to fetch product images:", error);
  //   productImages.value = []; // Fallback on error
  // }
});

// i18n texts (ensure these are in your locale files as commented in your original code)
</script>

<style scoped lang="scss">
.home-page {
  transition: padding-top 0.3s ease-out;
}

.section {
  padding: 20px 0;
  &:not(:last-child) {
    margin-bottom: 30px;
  }
}

.banner-outer-section {
  padding: 0; // Banners often don't need vertical padding from their outer section container
  // The Banner.vue component itself will handle its internal padding and styling.
  // You might want a specific background for this section if the banner isn't full-bleed.
  // background-color: var(--el-color-info-light-9); // Example placeholder
  margin-bottom: 30px; // Spacing after the banner section
}

.product-gallery-section {
  background-color: var(--el-color-white);
}

.features-section {
  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: var(--el-font-size-extra-large);
    color: var(--el-text-color-primary);
  }
}
</style>