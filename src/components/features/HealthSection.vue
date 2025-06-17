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
  
  /* 移除 aspect-ratio */
  
  /* 新增：直接设置一个您想要的高度 */
  height: 1000px; /* 您可以把 500px 修改为任何您想要的像素值 */
  
  /* max-height 可以保留，也可以移除 */
  // max-height: 600px; 
  
  /* ... 其他样式保持不变 ... */
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