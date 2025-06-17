dao'hang'zi'xiang
<template>
  <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path || `sub-${item.id}`">
    <template #title><span>{{ t(item.name) }}</span></template>
    <NavItem v-for="child in item.children" :key="child.id" :item="child" />
  </el-sub-menu>

  <el-menu-item v-else :index="item.path" :disabled="!item.path || item.path === '#'">
    <span>{{ t(item.name) }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { ShopCategory } from '@/services/apiClient';

defineProps<{ item: ShopCategory }>();
const { t } = useI18n();
</script>

<script lang="ts">
// 显式定义组件名称，方便在递归和开发者工具中识别
export default {
  name: 'NavItem'
}
</script>