<template>
  <div class="top-notification-bar" ref="topBarRef" role="region" aria-label="Site-wide notification">
    <p>{{ $t('topBar.promo.newUserDiscount20') }}</p> 
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const topBarRef = ref<HTMLElement | null>(null);
const emit = defineEmits(['height-change']);

// 这个组件会在加载后，通过 'height-change' 事件告诉父组件自己的实际高度
onMounted(async () => {
  await nextTick();
  if (topBarRef.value) {
    emit('height-change', topBarRef.value.offsetHeight);
  } else {
    emit('height-change', 0);
  }
});
</script>

<style scoped lang="scss">
.top-notification-bar {
  background-color: #000000;
  color: #ffffff;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  transition: padding 0.3s ease, font-size 0.3s ease;
  padding: 14px 14px;
  
  /* 重置可能存在的外部边距 */
  margin-block-start: 0;
  margin-block-end: 0;

  p {
    margin: 0;
    font-size: 24px;
    line-height: 1.4;
  }
}
</style>