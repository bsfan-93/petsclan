<template>
  <div class="top-notification-bar" ref="topBarRef" role="region" aria-label="Site-wide notification">
    <p>{{ $t('topBar.promo.newUserDiscount20') }}</p> 
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { useI18n } from 'vue-i18n'; // If you use $t in the template

// import { computed } from 'vue';
// const notificationMessage = computed(() => t('newUserNotification'));
// watch(notificationMessage, async () => {
//   await nextTick();
//   if (topBarRef.value) {
//     emit('height-change', topBarRef.value.offsetHeight);
//   }
// });

const { t } = useI18n(); // If using $t for the message
const topBarRef = ref<HTMLElement | null>(null);
const emit = defineEmits(['height-change']);

// We still need to emit the height so AppHeader can adjust its affix offset
onMounted(async () => {
  // Wait for the DOM to be fully rendered and styles applied
  await nextTick();
  if (topBarRef.value) {
    emit('height-change', topBarRef.value.offsetHeight);
  } else {
    // Fallback, though topBarRef should ideally always be available here
    emit('height-change', 0);
  }
});

// Optional: If the content of the notification (and thus height)
// could change dynamically later (e.g., different promo messages),
// you might need a ResizeObserver or watch a prop that changes the text.
// For a static text bar, onMounted is usually sufficient.

</script>

<style scoped lang="scss">
.top-notification-bar {
  background-color: #000000;
  color: #ffffff;
  text-align: center;
  width: 100%;
  // position: fixed;
  // top: 0;
  // left: 0;
  // z-index: 2000; // High z-index
  box-sizing: border-box;
  transition: padding 0.3s ease, font-size 0.3s ease;

/* === Size Adjustments === */
padding: 14px 14px; // Reduced padding (e.g., from 8px or 10px)
/* Or, if you want it taller:
padding: 12px 15px;
*/

p {
  margin: 0;
  font-size: 24px; // Slightly smaller font size (e.g., from 14px)
  line-height: 1.4; // Adjust if text wraps or for vertical centering
  /* Or, for larger text:
  font-size: 16px;
  */
}
}

</style>