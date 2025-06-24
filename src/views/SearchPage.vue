<template>
  <div class="search-page-container">
    <h1>{{ $t('search.title') }}</h1>
    <p v-if="searchQuery">
      {{ $t('search.resultsFor') }}: <strong>{{ searchQuery }}</strong>
    </p>
    <p v-else>
      {{ $t('search.noQuery') }}
    </p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const searchQuery = computed(() => route.query.q as string || '');
</script>

<style scoped>
.search-page-container {
  padding: 20px;
  text-align: center;
}
</style>