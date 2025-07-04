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

  /* --- 1. 颜色和背景 --- */
  background-color: #ffffff; /* 背景色改为黑色 */
  color: #000000;             /* 文字颜色改为白色 */

  /* --- 2. 尺寸和边框 --- */
  padding: 6px 12px;
  min-width: 60px;
  height: 38px; /* 您可以按需调整高度 */
  box-sizing: border-box;
  border-radius: 19px; /* 高度的一半，使其完全圆润 */
  border: none; /* 移除了边框 */

    /* --- 3. 字体样式 --- */
  font-size: 14px;
  font-weight: 600;
  
  transition: transform 0.2s ease-in-out; /* 新增：平滑过渡动画 */

  &:hover {
    transform: scale(1.1); /* 新增：鼠标悬浮时放大到110% */
  }
}

   /* --- 4. 箭头样式调整 --- */
  .el-icon--right {
    margin-left: 4px; /* 让箭头贴着EN */
    font-size: 10px;  /* 减小箭头大小 */
    

    /* 使用 transform scale 来实现视觉上的加粗效果 */
    transform: scale(1.5, 1.8); 
  }

</style>