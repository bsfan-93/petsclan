<template>
  <div class="language-switcher">
    <el-dropdown @command="handleLanguageChange">
      <span class="el-dropdown-link">
        {{ currentLanguageAbbr }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            v-for="lang in languages" 
            :key="lang.code" 
            :command="lang.code"
            :disabled="locale === lang.code"
          >
            {{ lang.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';

const { locale } = useI18n();

// 需求1: 在语言列表中增加一个 'abbr' 属性，用于存储简写
const languages = [
  { code: 'en', name: 'English', abbr: 'EN' },
  { code: 'zh', name: '简体中文', abbr: 'ZH' },      // '简' -> 'ZH'
  { code: 'zh_Hant', name: '繁體中文', abbr: 'TC' }, // '繁' -> 'TC' (Traditional Chinese)
  { code: 'ja', name: '日本語', abbr: 'JA' },      // '日' -> 'JA'
  { code: 'ko', name: '한국어', abbr: 'KO' },      // '한' -> 'KO'
  { code: 'es', name: 'Español', abbr: 'ES' },
  { code: 'fr', name: 'Français', abbr: 'FR' },
  { code: 'de', name: 'Deutsch', abbr: 'DE' },
  { code: 'it', name: 'Italiano', abbr: 'IT' },
  { code: 'pt', name: 'Português', abbr: 'PT' },
  { code: 'th', name: 'ไทย', abbr: 'TH' },      // 'ไทย' -> 'TH'
  { code: 'ms', name: 'Bahasa Melayu', abbr: 'MS' }
];

// 需求1: 创建一个新的计算属性，专门用来获取当前语言的简写
const currentLanguageAbbr = computed(() => {
  const current = languages.find(lang => lang.code === locale.value);
  return current ? current.abbr : 'EN'; // 如果找不到，默认显示 'EN'
});

// 切换语言的函数 (无需修改)
const handleLanguageChange = (langCode: string | number | object) => {
  if (typeof langCode === 'string') {
    locale.value = langCode;
    localStorage.setItem('user-locale', langCode);
  }
};
</script>

<style scoped lang="scss">
.language-switcher {
  display: inline-flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center; /* 确保简写文本水平居中 */

  /* 需求2: 调整样式大小 */
  padding: 4px 14px;      /* 增加了内边距，让按钮更大 (原: 4px 10px) */
  font-size: 16px;        /* 增大了字体大小 (原: 11px) */
  font-weight: 600;       /* 让字体稍微加粗，更有质感 */
  min-width: 55px;        /* 设置一个最小宽度，防止按钮因内容少而变得过窄 */
  box-sizing: border-box; /* 确保 padding 不会影响总宽度计算 */

  /* 以下为原有样式，保持不变 */
  border-radius: 18px;    /* 稍微增大了圆角以匹配更大的尺寸 */
  border: 1px solid #e0e0e0;
  background-color: #f5f7fa;
  color: #5a5a5a;
  
  &:hover {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
  }

  .el-icon--right {
    margin-left: 5px; /* 调整箭头与文字的距离 */
  }
}
</style>