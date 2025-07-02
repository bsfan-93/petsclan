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
      
      <el-sub-menu index="/shop" key="shop-main-submenu" popper-class="shop-mega-menu" >
        <template #title>{{ $t('nav.shop') }}</template>
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
            </router-link>
          </div>
        </div>
      </el-sub-menu>
      
      <el-menu-item index="/about">{{ $t('nav.aboutUs') }}</el-menu-item>

      <el-menu-item index="/app-download">{{ $t('nav.app') }}</el-menu-item>
    </el-menu>

    <div class="right-menu-items"> 
      <el-icon class="menu-action-icon search-icon" @click="openFullScreenSearch"><Search /></el-icon> 

      <el-icon class="menu-action-icon user-icon" @click="goToProfile"><User /></el-icon> 
      <ShoppingCartIcon />
      <LanguageSwitcher />
    </div>
  </div>
</template>

<script setup lang="ts">
// 9. 从 'vue' 导入核心功能
import { ref, computed, onMounted } from 'vue';
// 10. 从 Element Plus 图标库导入图标组件
import { User } from '@element-plus/icons-vue';
// 11. 从 vue-router 导入路由功能
import { useRoute, useRouter } from 'vue-router';
// 12. 从 vue-i18n 导入国际化功能
import { useI18n } from 'vue-i18n';
// 13. 导入我们自己封装的组件
import ShoppingCartIcon from '@/components/features/ShoppingCartIcon.vue';
import LanguageSwitcher from '@/components/features/LanguageSwitcher.vue';
import FullScreenSearch from '@/components/features/FullScreenSearch.vue';
// 14. 导入 API 请求函数和数据类型定义
import { fetchShopCategories, type ShopCategory } from '@/services/apiClient';
import { Search } from '@element-plus/icons-vue'; // 确保导入了Search图标
import { useUiStore } from '@/store/modules/ui';
const uiStore = useUiStore();
const openFullScreenSearch = () => {
  uiStore.setFullScreenSearchVisible(true);
};

// 15. 获取 t 函数，用于国际化翻译
const { t } = useI18n();
// 16. 获取当前路由信息
const route = useRoute();
// 17. 获取路由实例，用于页面跳转
const router = useRouter();

// 18. 创建计算属性，用于高亮当前激活的菜单项
const activeMenuIndex = computed(() => route.path);
// 19. 创建响应式变量，用于存储商店分类列表
const shopCategories = ref<ShopCategory[]>([]);
// 20. 创建响应式变量，用于控制加载状态
const isLoadingShopCategories = ref(false);

// 21. onMounted 生命周期钩子，在组件被挂载到页面上之后执行一次
onMounted(async () => {
  isLoadingShopCategories.value = true;
  try {
    shopCategories.value = await fetchShopCategories();
  } catch (e) {
    console.error("Failed to fetch shop categories:", e);
  } finally { 
    isLoadingShopCategories.value = false;
  }
});

// 22. 定义跳转到个人资料页的函数
const goToProfile = () => router.push('/profile');

// 23. 创建计算属性，用于生成右侧的特色分类预览数据
const featuredCategories = computed(() => {
  // 24. 我们不再需要在这里拼接URL，因为apiClient已经处理好了
  // 25. 直接从 shopCategories 中截取前3个即可
  // 26. 注意：我们假设 fetchShopCategories 返回的数据已经包含了 imageUrl
  return shopCategories.value.slice(0, 3);
});
</script>

<style scoped lang="scss">
/* 27. 导航栏最外层容器的样式 */
.navigation-bar-container {
  position: relative;
  height: 114px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* 28. Logo 容器的样式 */
.logo-container {
  position: absolute;
  left: 100px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  
  .logo-image {
    height: 118px;
    display: block;
  }
}

/* 29. 右侧图标容器的样式 */
.right-menu-items {
  position: absolute;
  right: 100px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 30. 中间主导航菜单的样式 */
.main-navigation-menu {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
  border-bottom: none !important;
  background-color: transparent;

  /* 31. 修改子组件 el-menu-item 和 el-sub-menu__title 的样式 */
  :deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  padding: 0 35px !important;
  font-size: 26px;
  font-weight: 700;
  color: #000000 !important;

  /* 新增：为 transform 属性添加平滑过渡动画 */
  transition: transform 0.2s ease-in-out;

  /* 关键：设置悬浮状态的样式 */
  &:hover {
    /* 1. 强制背景色为透明，确保不会有任何底色 */
    background-color: transparent !important; 
    /* 2. 添加放大效果 */
    transform: scale(1.1); 
  }
}
}

  /* 32. 子菜单的下拉箭头图标样式 */
  :deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
    margin-left: 8px !important;
    vertical-align: middle;
    position: static !important;
  }

  /* 33. 菜单项被激活（选中）时的样式 */
  .el-menu-item.is-active,
  :deep(.el-sub-menu.is-active .el-sub-menu__title) {
    color: #000000 !important;
    border-bottom: none !important;
  }

/* 34. 右侧普通图标的通用样式 */
.menu-action-icon {
  font-size: 25px;
  color: #000000;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease-in-out; /* 新增：平滑过渡动画 */

  &:hover {
    transform: scale(1.15); /* 新增：鼠标悬浮时放大到115% */
  }
}

/* 35. 针对购物车图标的特殊微调 */
:deep(.shopping-cart-icon-wrapper) {
  width: 40px;
  height: 40px;
  margin-left: -10px;
  margin-right: -5px;

  .el-badge.cart-badge {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100%;
    height: 100%;
    padding: 0 !important;
  }
  
  i.el-icon.cart-icon {
    color: #000000;
    font-size: 25px !important;
    line-height: 1;
    transition: color 0.2s ease;
  }
  transition: transform 0.2s ease-in-out; /* 新增：平滑过渡动画 */

  &:hover {
    transform: scale(1.15); /* 新增：鼠标悬浮时放大到115% */
  }
}


</style>

<style lang="scss">
/* 36. 针对我们自定义的 shop-mega-menu 类进行样式设置 */
.el-popper.is-light.shop-mega-menu {
  top: 176px !important;
  left: 1px !important;
  transform: translateX(0) !important;
  width: 1900px;
  max-width: 2000px;
  border-radius: 0 0 20px 20px !important;
  background-color: transparent;
  border: none;
  box-shadow: none;
  border: 2px solid red !important; /* 您用于调试的红色边框 */
}

/* 37. 移除内部 el-menu 的默认样式，让我们的内容来填充 */
.el-popper.shop-mega-menu .el-menu--popup {
  padding: 0 !important;
  border: none !important;
}

/* 38. Mega Menu 内部内容的布局 */
.shop-mega-menu .mega-menu-content {
  display: flex;
  padding: 30px 130px;
  gap: 85px;
}

/* 39. 左侧导航链接列的样式 */
.shop-mega-menu .mega-menu-nav {
  flex-shrink: 0;
  border-right: 1px solid #f0f0f0;
  padding-right: 50px;

  .mega-menu-title {
    font-size: 40px;
    font-weight: 600;
    color: #909399;
    margin: 0 0 65px 0;
    text-transform: uppercase;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li { margin-bottom: 40px; }
  }

.mega-menu-link {
    font-size: 35px;
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
      font-size: 38px;
      color: var(--el-color-primary);
    }
} 
}

/* 40. 右侧产品预览区域的样式 */
.shop-mega-menu .mega-menu-previews {
  display: flex;
  flex-grow: 1;
  gap: 15px;
  justify-content: space-between;
}

/* 41. 单个产品预览卡的样式 */
.mega-menu-preview-card {
    display: block;
    text-decoration: none;
    flex: 1;
    min-width: 420px;
    height: auto; 
    border-radius: 15px;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background-color: #161616;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(175, 115, 115, 0.08);
    }

    .preview-image {
      width: 100%;
      height: 400px;
      object-fit: contain; /* 您已修改为 contain */
      display: block;
      background-color: #f5f7fa;
    }

    /* .preview-name 已被您从模板中删除，故注释掉 */
    /*
    .preview-name {
      display: block;
      padding: 12px;
      background-color: #f8f9fa;
      color: #333;
      font-weight: 500;
      text-align: center;
    }
    */
}

/* 42. About Us 下拉菜单的样式 */
.el-popper.is-light.about-us-dropdown {
  min-width: 180px;
  border-radius: 8px !important;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 6px 0 !important;
  background-color: #ffffff !important; 
}

/* 43. About Us 下拉菜单项的样式 */
.about-us-dropdown .el-menu-item {
  height: 42px;
  font-size: 16px;
  color: #303133;
  padding: 0 20px;

  &:hover {
    background-color: transparent !important; /* 您已修改为 transparent */
    color: var(--el-color-primary);
  }
}
</style>