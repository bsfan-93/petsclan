// src/components/features/ProductCard.vue (示例)
<template>
  <el-card shadow="hover" class="product-card">
    <div v-if="loading" class="image-loading-placeholder">
      <el-skeleton-item variant="image" style="width: 100%; height: 180px;" />
    </div>
    <el-image
      v-else-if="product && product.imageUrl"
      :src="product.imageUrl"
      fit="cover"
      lazy
      class="product-image"
      :alt="product.name"
    >
      <template #placeholder>
        <div class="image-slot image-placeholder">
          <el-icon :size="30"><Loading /></el-icon>
        </div>
      </template>
      <template #error>
        <div class="image-slot image-error">
          <el-icon :size="30"><Picture /></el-icon>
          <span>{{ $t('image.loadError') }}</span>
        </div>
      </template>
    </el-image>
    <div v-else-if="error" class="image-error-message">
      {{ $t('image.fetchError') }}
    </div>
    <div style="padding: 14px;">
      <h3>{{ product?.name || $t('product.loadingName') }}</h3>
<div class="bottom">
<span class="price">¥{{ product?.price || 'N/A' }}</span>
<el-button type="primary" plain size="small">{{ $t('product.viewDetails') }}</el-button>
</div>
</div>
</el-card>
</template>
<script setup lang="ts">
import { ref, onMounted, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { Loading, Picture } from '@element-plus/icons-vue';
// import { useFetchData } from '@/composables/useFetchData'; // 实际项目中会使用

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

const props = defineProps({
  productId: {
    type: String as PropType<string>,
    required: true,
  }
});

const { t } = useI18n();
const product = ref<Product | null>(null);
const loading = ref(true); // 初始为true，模拟加载
const error = ref<Error | null>(null);
// const { data: productData, loading, error, fetchData } = useFetchData<Product>();

onMounted(async () => {
  // await fetchData(`/api/products/${props.productId}`);
  // product.value = productData.value;
  // 模拟数据获取
  setTimeout(() => {
    if (props.productId === 'error-id') {
      error.value = new Error('Failed to load product');
    } else {
      product.value = {
        id: props.productId,
        name: `宠物智能玩具 ${props.productId}`,
        imageUrl: `https://via.placeholder.com/300x180/4CAF50/FFFFFF?text=PetToy+${props.productId}`,
        price: Math.floor(Math.random() * 100) + 50,
      };
    }
    loading.value = false;
  }, 1500);
});

// 添加 i18n 文本
// en.json: "image": { "loadError": "Load failed", "fetchError": "Error fetching image." }, "product": { "loadingName": "Loading product...", "viewDetails": "View Details" }
// zh.json: "image": { "loadError": "加载失败", "fetchError": "图片加载出错。" }, "product": { "loadingName": "商品加载中...", "viewDetails": "查看详情" }
</script>

<style scoped lang="scss">
.product-card {
cursor: pointer;
transition: transform 0.2s ease-in-out;
&:hover {
transform: translateY(-5px);
}
}
.product-image,.image-loading-placeholder {
width: 100%;
height: 180px; // 固定高度，或根据设计调整
display: block;
}
.image-slot {
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
width: 100%;
height: 100%;
background-color: var(--el-fill-color-lighter);
color: var(--el-text-color-secondary);
font-size: 14px;
.el-icon {
margin-bottom: 8px;
}
}
.image-error-message {
height: 180px;
display: flex;
justify-content: center;
align-items: center;
color: var(--el-color-danger);
}
.bottom {
margin-top: 13px;
line-height: 12px;
display: flex;
justify-content: space-between;
align-items: center;
}
.price {
font-size: var(--el-font-size-large);
color: var(--el-color-primary);
font-weight: bold;
}
</style>