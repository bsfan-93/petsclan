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
      @select="handleMenuSelect"
      class="main-navigation-menu"
      router
    >
      <el-menu-item index="/">{{ $t('nav.home') }}</el-menu-item>
      <el-sub-menu index="/shop">
        <template #title>{{ $t('nav.shop') }}</template>
        <el-menu-item index="/shop/all">{{ $t('nav.shop_all') }}</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="/about">
        <template #title>{{ $t('nav.aboutUs') }}</template>
        <el-menu-item index="/about/story">{{ $t('nav.aboutUs_story') }}</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/app-download">{{ $t('nav.app') }}</el-menu-item>
    </el-menu>
    
    <!-- {/* <div class="menu-spacer"></div> */}  -->
    <!-- <div class="right-menu-items">
      <el-icon class="menu-action-icon" :size="20" @click="openSearch"><Search /></el-icon>
      <el-icon class="menu-action-icon user-icon" :size="20" @click="goToProfile"><User /></el-icon> 
      <ShoppingCartIcon class="menu-action-item" />
      <LanguageSwitcher class="menu-action-item language-switcher-wrapper" />
    </div> -->
    <div class="right-menu-items"> 
      <el-icon class="menu-action-icon"  @click="openSearch"><Search /></el-icon>
      <el-icon class="menu-action-icon user-icon"  @click="goToProfile"><User /></el-icon> 
      <ShoppingCartIcon class="menu-action-item shopping-cart-item-wrapper" />
      <LanguageSwitcher class="menu-action-item language-switcher-wrapper" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, User } from '@element-plus/icons-vue';
import { useRoute, useRouter,type RouteLocationNormalizedLoaded, type Router } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ExpandingSearchBar from '@/components/features/ExpandingSearchBar.vue';
import LanguageSwitcher from '@/components/features/LanguageSwitcher.vue';
import ShoppingCartIcon from '@/components/features/ShoppingCartIcon.vue';

const { t } = useI18n();
const route: RouteLocationNormalizedLoaded = useRoute(); // Explicitly type route
const router: Router = useRouter(); // Explicitly type router

// 根据当前路由高亮菜单项
const activeMenuIndex = computed(() => {
  // 更复杂的匹配逻辑可能需要，例如匹配子路由也高亮父菜单
  return route.path;
});

const handleMenuSelect = (
  index: string, 
  indexPath: string[], // <--- CORRECTED TYPE HERE (string array)
  item: any, // You can be more specific with component instance types if needed
  routeResult: any  // Optional if router prop is used
) => {
  // el-menu 的 router 模式会自动导航，如果需要手动处理或阻止导航，可以在此操作
  // console.log('Menu selected:', index, routeResult);
  // if (index.startsWith('http')) { // 处理外部链接
  //   window.open(index, '_blank');
  //   return;
  // }
  // router.push(index); // 如果没有使用 router prop
};
</script>

<style scoped lang="scss">

.navigation-bar-container {
  display: flex;
  align-items: center;
  height: 112px;
  // padding: 0 24px; // 1. 左右边距调整：我们将通过绝对定位的子元素来控制边距感
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
  box-sizing: border-box;
  position: relative; /* 为绝对定位的子元素提供参照 */
}

.logo-container {
  // display: flex; // 如果内部只有一个img，flex不是必须
  // align-items: center;
  
  //  左右边距调整：Logo 通过绝对定位到左侧 
  position: absolute;
  left: 100px; // 左边距
  top: 50%;
  transform: translateY(-50%); // 垂直居中
  z-index: 2; // 确保在菜单之上（如果菜单有背景色或扩展）

  .logo-image {
    height: 108px; // 根据您的设置
    display: block;
  }
}

.main-navigation-menu { // 这是 <el-menu>
  height: 100%;
  display: flex !important;
  align-items: center !important;
  
  // 中间字体设置为页面居中 

  // 让我们采用您已有的方案，并稍作调整以确保其在“可用空间”内居中
  flex-grow: 1; // 它会占据 logo 和 right-items 之间的所有空间
  justify-content: center;  // 然后将内部的菜单项在这个空间内居中
  padding-left: 230px;     //字体左边距
  padding-right: 250px;   //字体右边距

  border-bottom: none !important;
  background-color: transparent;

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    padding-left: 30px !important; // 菜单项之间的间距
    padding-right: 15px !important; // 子菜单标题的右侧会进一步调整
    font-size: 24px; 
    font-weight: 700; 
    color: #000000 !important; 
    border-bottom: none !important; 
    background-color: transparent !important; 

    &:hover {
      color: var(--el-color-primary) !important; 
      background-color: transparent !important;
    }
  }

  :deep(.el-sub-menu__title) {
    padding-right: 10px !important; 
    .el-sub-menu__icon-arrow {
      margin-left: 8px !important;
      vertical-align: middle;
      position: static !important;
    }
  }

  .el-menu-item.is-active {
    color: var(--el-color-primary) !important;
  }

  :deep(.el-sub-menu.is-active .el-sub-menu__title) {
    color: var(--el-color-primary) !important;
  }
}
 
.right-menu-items {
  // display: flex !important; // 已通过 & > * 和父级 align-items 控制
  // align-items: center !important;
  // height: 100%;
  // flex-direction: row !important;
  // flex-wrap: nowrap !important;
  // gap: 12px; 
  // padding: 0;

  //  左右边距调整：Right Items 通过绝对定位到右侧 
  position: absolute;
  right: 100px; // 右边距
  top: 50%;
  transform: translateY(-50%); // 垂直居中
  z-index: 2;

  // 内部各项的 flex 布局
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 12px; // 各项之间的间距

  & > * { 
    display: inline-flex !important; 
    align-items: center !important;  
    justify-content: center !important;
    flex-shrink: 0; 
    cursor: pointer; 
  }
}

// 为搜索、用户、购物车图标的“模块”设定统一尺寸
.menu-action-icon,
.menu-action-item.shopping-cart-item-wrapper {
  width: 38px; 
  height: 38px; 
}

// 普通操作图标 (搜索、用户)
.menu-action-icon { 
  font-size: 25px; 
  color: #000000 ; 
  // margin-left 已由父级 gap 控制
  &:hover { 
    color: var(--el-color-primary);
  }
}

// 购物车图标的特定调整
.menu-action-item.shopping-cart-item-wrapper {
  // margin-left 和 margin-right 已由父级 gap 控制或不需要
  // position: relative; // 仅在需要像素级微调垂直对齐时启用
  // top: 1px;        // 示例
  margin-left：20px；
  margin-right：

  :deep(.el-badge.cart-badge) { 
    display: flex !important;      
    align-items: center !important; 
    justify-content: center !important;
    width: 100%; 
    height: 100%;
    padding: 0 !important;         
  }

  :deep(i.el-icon.cart-icon) { 
    color: #000000 !important; 
    font-size: 25px !important; 
    line-height: 1; 
  }
}

// 语言切换器样式
.language-switcher-wrapper.menu-action-item { 
  // width 和 height 不参与统一尺寸，由其内容决定
  :deep(.el-dropdown-link) { 
    padding: 4px 10px;       
    font-size: 11px;          
    border-radius: 12px;   
    border: 1px solid #e0e0e0; 
    background-color: #f5f7fa; 
    color: #5a5a5a; 
    display: flex;
    align-items: center;

    .el-icon { 
      margin-left: 3px;   
      font-size: 10px;    
    }
    &:hover {
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
    }
  }
}
</style>