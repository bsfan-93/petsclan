// src/i18n.ts
import { createI18n } from 'vue-i18n';
import enMessages from './locales/en.json';
import zhMessages from './locales/zh.json';
import zhHantMessages from './locales/zh_Hant.json'; // 保持您原来的导入名称，或者改为 zhTwMessages 如果您喜欢

// 定义支持的语言列表和其在 navigator.language 中的可能前缀
const supportedLocales = [
  { code: 'en', browserPrefixes: ['en'] },
  { code: 'zh', browserPrefixes: ['zh-CN', 'zh-SG', 'zh'] }, // 简体中文，zh-CN 通常是简体
  { code: 'zh-Hant', browserPrefixes: ['zh-TW', 'zh-HK', 'zh-MO', 'zh-Hant'] } // 繁体中文
];
const defaultLocale = 'en';

const getInitialLocale = (): string => {
  const persistedLocale = localStorage.getItem('user-locale');
  if (persistedLocale && supportedLocales.some(l => l.code === persistedLocale)) {
    return persistedLocale;
  }

  const browserLanguage = navigator.language; // 例如 'en-US', 'zh-CN', 'zh-TW'
  for (const supported of supportedLocales) {
    if (supported.browserPrefixes.some(prefix => browserLanguage.startsWith(prefix))) {
      return supported.code;
    }
  }
  
  // 如果浏览器主语言（例如 'zh' 来自 'zh-TW'）也想匹配
  const primaryBrowserLanguage = browserLanguage.split('-')[0];
  for (const supported of supportedLocales) {
      // 特殊处理 'zh' 可能同时代表简体或作为繁体的父级
      if (supported.code === primaryBrowserLanguage && supported.code !== 'zh-Hant') { // 避免 'zh' 错误匹配到 'zh-Hant'
          return supported.code;
      }
  }

  return defaultLocale;
};

const i18n = createI18n({
  legacy: false, 
  locale: getInitialLocale(), 
  fallbackLocale: defaultLocale, // 回退语言
  messages: {
    'en': enMessages,
    'zh': zhMessages,
    'zh-Hant': zhHantMessages // 👈 **添加繁体中文消息**
                           // 使用 'zh-Hant' 作为键名，与您的文件名和导入对应
                           // 并确保您的 LanguageSwitcher 组件切换到此 locale 时也使用 'zh-Hant'
  },
  globalInjection: true,
});

export default i18n;