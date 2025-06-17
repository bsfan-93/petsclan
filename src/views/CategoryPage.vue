<template>
  <div class="category-page">
    <h1>分类页面</h1>
    <p v-if="categoryId">
      您正在浏览的分类 ID 是: <strong>{{ categoryId }}</strong>
    </p>
    <p>
      接下来，您可以在这个页面中根据分类ID (categoryId) 从后端获取并展示该分类下的所有商品。
    </p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
// 因为我们在 router/index.ts 中设置了 props: true，
// 所以 Vue Router 会自动将路由参数 categoryId 作为 prop 传递给这个组件。
const props = defineProps({
  categoryId: {
    type: String,
    required: true,
  },
});

// 您可以在这里使用 props.categoryId 来调用API获取分类详情或商品列表
console.log('成功导航到分类页面，ID为:', props.categoryId);
</script>

<style scoped>
.category-page {
  padding: 40px;
  text-align: center;
}
h1 {
  margin-bottom: 20px;
}
strong {
  color: #c0392b;
  font-size: 1.2em;
}
</style>