// src/components/features/LanguageSwitcher.vue
<template>
  <el-dropdown @command="handleLanguageChange" trigger="hover" class="language-switcher">
    <span class="el-dropdown-link">
      <el-icon :size="18"><Switch /></el-icon> <span class="current-lang-text">{{ currentLanguageDisplayName }}</span>
      <el-icon class="el-icon--right"><ArrowDown /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in availableLocales"
          :key="lang.code"
          :command="lang.code"
          :disabled="locale === lang.code"
        >
          {{ lang.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { ArrowDown, Switch } from '@element-plus/icons-vue'; // 假设 Switch 是一个合适的图标

const { locale, availableLocales: i18nAvailableLocales } = useI18n();

// 定义支持的语言及其显示名称
const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '简体中文' },
  { code: 'zh-Hant', name: '繁體中文' } 
  // 可以添加更多支持的语言
];

// 从 vue-i18n 的可用语言中筛选出我们明确支持的语言
const availableLocales = computed(() => {
  // Access the actual array using .value
  return supportedLanguages.filter(lang => 
  i18nAvailableLocales.value.includes(lang.code));
});

const currentLanguageDisplayName = computed(() => {
  const current = supportedLanguages.find(lang => lang.code === locale.value);
  return current? current.name : locale.value.toUpperCase();
});

const handleLanguageChange = (langCode: string | number | object) => {
  if (typeof langCode === 'string') {
    locale.value = langCode;
    // 持久化用户选择到 localStorage
    localStorage.setItem('user-locale', langCode);
  }
};
</script>

<style scoped lang="scss">
.language-switcher {
cursor: pointer;
// margin-left: 15px; // 根据导航栏布局调整
.el-dropdown-link {
display: flex;
align-items: center;
color: var(--el-text-color-regular); // 或导航栏文字颜色
&:hover {
color: var(--el-color-primary);
}
.el-icon {
margin-right: 5px;
}
.current-lang-text {
font-size: var(--el-font-size-base);
}
}
}
</style>