<!-- PETS CLAN, EFFORTLESS PET CARE -->
<template>
  <div v-if="sectionData" class="health-section-wrapper">
    <el-image :src="sectionData.imageUrl" class="background-image" fit="cover" lazy />

    <div class="text-overlay">
      <h2>{{ sectionData.title }}</h2>
    </div>
  </div>
  <div v-else class="placeholder">
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchHealthSectionData, type HealthSectionData } from '@/services/apiClient';

const sectionData = ref<HealthSectionData | null>(null);

onMounted(async () => {
  try {
    sectionData.value = await fetchHealthSectionData();
  } catch (error) {
    console.error("Failed to load health section data:", error);
  }
});
</script>

<style scoped lang="scss">
.health-section-wrapper {
  position: relative;
  width: 100%;
  
  /* Option 1: Use aspect-ratio (e.g., 16:9) */
  aspect-ratio: 16 / 9;
  
  /* Option 2: Use viewport height (e.g., 80% of the screen height) */
  height: 95vh;

  /* Set a max-height to prevent it from being too tall on large screens */
  
  background-color: #f0f2f5;
  overflow: hidden;
}

.background-image {
  width: 100%;
  height: 100%;
}

.text-overlay {
  position: absolute;
  bottom: 10%;
  left: 5%;
  z-index: 10;
  
  h2 {
    font-size: 3em;
    color: white;
    font-weight: 700;
    // 添加文字阴影使其更清晰
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  }
}

.placeholder {
  width: 100%;
  height: 400px; // 与 banner 最小高度保持一致或自定义
  background-color: #f5f7fa;
}
</style>