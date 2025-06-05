// src/components/layout/AppFooter.vue
<template>
  <footer class="app-footer">
    <el-row justify="center">
      <el-col :span="20">
        <p>&copy; {{ new Date().getFullYear() }} {{ $t('appName') }}. {{ $t('footer.allRightsReserved') }}</p>
        <p>
          <a href="#">{{ $t('footer.privacyPolicy') }}</a> |
          <a href="#">{{ $t('footer.termsOfService') }}</a>
        </p>
      </el-col>
    </el-row>
  </footer>
</template>

<script setup lang="ts">
// import { useI18n } from 'vue-i18n'; // Auto-imported
// const { t } = useI18n();
// 添加 i18n 文本
// en.json: "footer": { "allRightsReserved": "All Rights Reserved.", "privacyPolicy": "Privacy Policy", "termsOfService": "Terms of Service" }
// zh.json: "footer": { "allRightsReserved": "版权所有。", "privacyPolicy": "隐私政策", "termsOfService": "服务条款" }
</script>

<style scoped lang="scss">
.app-footer {
  background-color: var(--el-bg-color);
  color: var(--el-text-color-secondary);
  padding: 20px 0;
  text-align: center;
  font-size: var(--el-font-size-small);
  border-top: 1px solid var(--el-border-color-lighter);

  p {
    margin: 5px 0;
  }

  a {
    color: var(--el-text-color-secondary);
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>