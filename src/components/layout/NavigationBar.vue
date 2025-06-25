<template>
  <div class="navigation-bar-container">
    <div class="logo-container">
      <router-link to="/">
        <img src="@/assets/images/logo.png" alt="Pets Clan Logo" class="logo-image" />
      </router-link>
    </div>
    
    <el-menu 
      :default-active="activeMenuIndex" 
      mode="horizontal" 
      :ellipsis="false" 
      class="main-navigation-menu" 
      router
    >
      <el-menu-item index="/">{{ $t('nav.home') }}</el-menu-item>
      
      <el-sub-menu index="/shop" key="shop-main-submenu" popper-class="shop-mega-menu" :teleported="false">
        <template #title>Shop</template>
        <div class="mega-menu-content">
          <div class="mega-menu-nav">
            <h3 class="mega-menu-title">Categories</h3>
            <ul>
              <li v-for="category in shopCategories" :key="category.id">
                <router-link :to="`/category/${category.id}`" class="mega-menu-link">
                  {{ category.name }}
                </router-link>
              </li>
            </ul>
            <router-link to="/shop/all" class="mega-menu-link all-items-link">
              Shop All Items
            </router-link>
          </div>
          <div class="mega-menu-previews">
            <router-link
              v-for="item in featuredCategories"
              :key="item.id"
              :to="`/product/${item.id}`"
              class="mega-menu-preview-card"
            >
              <img :src="item.imageUrl" :alt="item.name" class="preview-image" />
              <span class="preview-name">{{ item.name }}</span>
            </router-link>
          </div>
        </div>
      </el-sub-menu>
      
      <el-sub-menu index="/about">
        <template #title>{{ $t('nav.aboutUs') }}</template>
        <el-menu-item index="/about/story">{{ $t('nav.aboutUs_story') }}</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/app-download">{{ $t('nav.app') }}</el-menu-item>
    </el-menu>

    <div class="right-menu-items"> 
      <CustomSearchBar />
      <el-icon class="menu-action-icon user-icon" @click="goToProfile"><User /></el-icon> 
      <ShoppingCartIcon />
      <LanguageSwitcher />
    </div>
  </div>
</template>

<script setup lang="ts">
// 从 'vue' 导入核心功能：ref 用于创建响应式变量，computed 用于创建计算属性，onMounted 是生命周期钩子
import { ref, computed, onMounted } from 'vue';
// 从 Element Plus 图标库导入图标组件
import { User } from '@element-plus/icons-vue';
// 从 vue-router 导入路由功能
import { useRoute, useRouter } from 'vue-router';
// 从 vue-i18n 导入国际化功能
import { useI18n } from 'vue-i18n';
// 导入我们自己封装的组件
import ShoppingCartIcon from '@/components/features/ShoppingCartIcon.vue';
import LanguageSwitcher from '@/components/features/LanguageSwitcher.vue';
import CustomSearchBar from '@/components/features/CustomSearchBar.vue';
// 导入 API 请求函数和数据类型定义
import { fetchShopCategories, type ShopCategory } from '@/services/apiClient';
import ExpandingSearchBar from '@/components/features/ExpandingSearchBar.vue';

// 获取 t 函数，用于在脚本中进行翻译
const { t } = useI18n();
// 获取当前路由信息，比如路径、参数等
const route = useRoute();
// 获取路由实例，用于页面跳转
const router = useRouter();

// 创建一个计算属性，它会动态地获取当前页面的路径，用于高亮对应的菜单项
const activeMenuIndex = computed(() => route.path);
// 创建响应式变量，用于存储从 API 获取的商店分类列表
const shopCategories = ref<ShopCategory[]>([]);
// 创建响应式变量，用于控制是否显示“加载中”的状态
const isLoadingShopCategories = ref(false);

// onMounted 是一个生命周期钩子，它会在组件被挂载到页面上之后执行一次
onMounted(async () => {
  // 开始请求前，显示加载状态
  isLoadingShopCategories.value = true;
  try {
    // 调用 API 函数，并等待它返回结果
    shopCategories.value = await fetchShopCategories();
  } catch (e) {
    // 如果请求过程中出现错误，在控制台打印错误信息
    console.error("Failed to fetch shop categories:", e);
  } finally { 
    // 不论成功或失败，最后都隐藏加载状态
    isLoadingShopCategories.value = false;
  }
});

// 定义一个跳转到个人资料页的函数
const goToProfile = () => router.push('/profile');

// 创建一个计算属性，用于生成右侧的特色分类预览数据
const featuredCategories = computed(() => {
  // 从环境变量中获取 API 的基础 URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // 如果没有在 .env 文件中定义，打印错误并返回空数组
  if (!API_BASE_URL) {
    console.error("VITE_API_BASE_URL is not defined in your .env file!");
    return [];
  }
  
  // 从获取到的所有分类中，截取前3个
  return shopCategories.value.slice(0, 3).map(category => {
    // 对这3个分类进行处理，为每个分类添加一个完整的 imageUrl 属性
    return {
      ...category, // 复制 category 的所有原有属性 (id, name, path 等)
      imageUrl: `${API_BASE_URL}/standalones/photo/details?type=0&id=${category.id}` // 拼接出完整的图片 URL
    };
  });
});
</script>

<style scoped lang="scss">
// 导航栏最外层容器的样式
.navigation-bar-container {
  position: relative; // 设为相对定位，作为内部绝对定位元素的父容器
  height: 110px; // 固定高度
  background-color: #ffffff; // 背景色
  border-bottom: 1px solid #e0e0e0; // 底部边框
  width: 100%; // 宽度占满
  box-sizing: border-box;
  position: sticky; // 粘性定位，实现吸顶效果
  top: 0; // 滚动到顶部时固定
  z-index: 1000; // 确保在页面其他内容之上
}

// Logo 容器的样式
.logo-container {
  position: absolute; // 绝对定位，脱离文档流
  left: 100px; // 距离左侧 100px
  top: 50%; // 先向下移动父容器高度的50%
  transform: translateY(-50%); // 再向上移动自身高度的50%，实现完美的垂直居中
  z-index: 2; // 层级更高，确保在菜单项之上
  
  .logo-image {
    height: 118px;
    display: block;
  }
}

// 右侧图标容器的样式
.right-menu-items {
  position: absolute; // 绝对定位
  right: 100px; // 距离右侧 100px
  top: 50%;
  transform: translateY(-50%); // 垂直居中
  z-index: 2;
  display: flex; // 使用 flex 布局让内部图标水平排列
  align-items: center; // 垂直居中对齐
  gap: 12px; // 图标之间的间距
}

// 中间主导航菜单的样式
.main-navigation-menu {
  position: absolute; // 绝对定位
  left: 50%; // 先向右移动父容器宽度的50%
  top: 50%;
  transform: translate(-50%, -50%); // 再向左、向上移动自身宽高的一半，实现完美的水平垂直居中
  height: 100%;
  border-bottom: none !important; // 覆盖 Element Plus 的默认下边框
  background-color: transparent; // 背景透明

  // :deep() 是一个深度选择器，可以穿透到子组件内部，修改其样式
  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    padding: 0 35px !important;
    font-size: 26px;
    font-weight: 700;
    color: #000000 !important; // 文字颜色
    // 鼠标悬浮时的样式
    &:hover {
      color: var(--el-color-primary) !important; // 文字变为主题色
    }
  }

  // 子菜单的下拉箭头图标样式
  :deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
    margin-left: 8px !important;
    vertical-align: middle;
    position: static !important;
  }

  // 菜单项被激活（选中）时的样式
  .el-menu-item.is-active,
  :deep(.el-sub-menu.is-active .el-sub-menu__title) {
    color: #000000 !important; // 保持黑色
  }
}

// 右侧普通图标的通用样式
.menu-action-icon {
  font-size: 25px;
  color: #000000;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}

// 针对购物车图标的特殊微调
:deep(.shopping-cart-icon-wrapper) {
  width: 38px;
  height: 38px;
  margin-left: -10px;
  margin-right: -5px;

  // 购物车徽章样式
  .el-badge.cart-badge {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100%;
    height: 100%;
    padding: 0 !important;
  }
  // 购物车图标本身的样式
  i.el-icon.cart-icon {
    color: #000000 !important;
    font-size: 25px !important;
    line-height: 1;
  }
}
</style>

<style lang="scss">
.el-popper.is-light.shop-mega-menu {
  /* Positioning */
  top: 110px !important; /* Position right below the navbar */
  left: 50% !important;
  transform: translateX(-50%) !important;
  z-index: 999 !important; /* Ensure it's below the navbar (z-index: 1000) */
  
  /* Sizing & Appearance */
  width: 90vw;
  max-width: 1200px; /* Set a max-width for very large screens */
  height: auto;
  padding: 0 !important;
  
  /* Borders & Shadows */
  border-radius: 0 0 20px 20px !important; /* Rounded corners only on the bottom */
  border: 1px solid #e0e0e0;
  border-top: none !important;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

/* This targets the inner wrapper that Element Plus creates, removing default padding */
.el-popper.shop-mega-menu .el-menu--popup {
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
}

.shop-mega-menu .mega-menu-content {
  display: flex;
  padding: 40px 50px;
  gap: 60px;
}

/* Left Column: Navigation Links */
.shop-mega-menu .mega-menu-nav {
  flex-shrink: 0;
  border-right: 1px solid #f0f0f0;
  padding-right: 50px;

  .mega-menu-title {
    font-size: 16px;
    font-weight: 600;
    color: #909399;
    margin: 0 0 25px 0;
    text-transform: uppercase;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      margin-bottom: 20px;
    }
  }

  .mega-menu-link {
    font-size: 22px;
    font-weight: 700;
    color: #303133;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: var(--el-color-primary);
    }

    &.all-items-link {
      margin-top: 25px;
      display: inline-block;
      font-size: 18px;
      color: var(--el-color-primary);
    }
  }
}

/* Right Column: Product Previews */
.shop-mega-menu .mega-menu-previews {
  display: flex;
  flex-grow: 1;
  gap: 25px;
  justify-content: flex-start;
}

.mega-menu-preview-card {
  display: block;
  text-decoration: none;
  width: 220px;
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }

  .preview-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
    background-color: #f5f7fa;
  }

  .preview-name {
    display: block;
    padding: 12px;
    background-color: #f8f9fa;
    color: #333;
    font-weight: 500;
    text-align: center;
  }
}
</style>