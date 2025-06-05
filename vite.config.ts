// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
// import ElementPlus from 'unplugin-element-plus/vite';
import path from 'path';

export default defineConfig({
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'src'),
  //   },
  // },
   plugins: [
    vue(),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue', 'vue-router', 'pinia', { 'vue-i18n': ['useI18n'] }], // 自动导入 useI18n
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... ( LCCN 注意: 此选项不推荐用于 ElMessage 等，建议这类组件还是手动引入)
      //resolvers: [ElementPlusResolver()], // 如果您希望这样导入，需要确保配置正确
      dts: 'src/auto-imports.d.ts', // 指定自动导入的 TypeScript 类型声明文件路径
      eslintrc: { // 生成 ESLint 配置文件，避免 no-undef 错误
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    Components({
      // 配置需要自动注册的组件路径，默认值为 'src/components'
      dirs: ['src/components', 'src/views'], // 可以根据实际情况添加或修改
      // 配置需要自动导入的组件库解析器
      resolvers: [
        ElementPlusResolver(), // 自动导入 Element Plus 组件
      ],
      dts: 'src/components.d.ts',// 指定自动导入的 TypeScript 类型声明文件路径
      // extensions: ['vue'], // 组件的有效文件扩展名。
      // deep: true, // 搜索子目录
    }),
    // 如果您选择按需导入 Element Plus 的样式 (不推荐与全局引入样式混用)
    // ElementPlus({
    //   useSource: true, // 从源文件导入，这样可以利用 SCSS 变量
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 设置路径别名
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables.scss" as *;`,
      },
    },
  },
  server: {
    port: 3000, // 开发服务器端口
    open: true, // 自动打开浏览器
    // 如果需要代理API请求，可以在这里配置
    // proxy: {
    //   '/api': {
    //     target: 'http://your-backend-api.com',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  },
});