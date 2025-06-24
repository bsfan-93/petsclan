// src/i18n.ts

import { createI18n } from 'vue-i18n';

// 导入所有语言文件
import en from './locales/en.json';
import zh from './locales/zh.json';
import zh_Hant from './locales/zh_Hant.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import th from './locales/th.json';
import es from './locales/es.json';
import ms from './locales/ms.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import ko from './locales/ko.json';
import ja from './locales/ja.json';

// 定义支持的语言列表
const supportedLocales = ['en', 'zh', 'zh-TW', 'zh-HK', 'it', 'pt', 'th', 'es', 'ms', 'de', 'fr', 'ko', 'ja'];

// 自动检测浏览器语言或从本地存储中获取
const getInitialLocale = (): string => {
  const savedLocale = localStorage.getItem('user-locale');
  if (savedLocale && supportedLocales.includes(savedLocale)) {
    return savedLocale;
  }

  const browserLanguage = navigator.language;
  if (browserLanguage.startsWith('zh')) {
    if (browserLanguage === 'zh-TW' || browserLanguage === 'zh-HK') {
      return 'zh_Hant';
    }
    return 'zh';
  }
  
  const baseLanguage = browserLanguage.split('-')[0];
  if (supportedLocales.includes(baseLanguage)) {
    return baseLanguage;
  }
  
  return 'en'; // 默认语言
};


const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: getInitialLocale(), // 设置初始语言
  fallbackLocale: 'en', // 设置回退语言
  messages: {
    // 注册所有语言
    en,
    zh,
    zh_Hant,
    it,
    pt,
    th,
    es,
    ms,
    de,
    fr,
    ko,
    ja,
  },
});

export default i18n;