<template>
  <div class="navigation-bar-container">
    <div class="logo-container">
      <router-link to="/">
        <img src="@/assets/images/logo.png" alt="Pets Clan Logo" class="logo-image" />
      </router-link>
    </div>
    <el-menu :default-active="activeMenuIndex" mode="horizontal" :ellipsis="false" class="main-navigation-menu" router>
    <el-menu-item index="/">{{ $t('nav.home') }}</el-menu-item>
    
    <el-sub-menu index="/shop" key="shop-main-submenu" popper-class="shop-mega-menu">
        <template #title>{{ $t('nav.shop') }}</template>
          <div class="mega-menu-content">
            <div class="mega-menu-nav">
              <h3 class="mega-menu-title">Collection</h3>
              <div v-if="isLoadingShopCategories">加载中...</div>
              <ul v-else>
                <li v-for="category in shopCategories" :key="category.id">
                  <router-link :to="category.path" class="mega-menu-link">{{ t(category.name) }}</router-link>
                </li>
                <li>
                  <router-link to="/shop/all" class="mega-menu-link all-items-link">{{ t('nav.shop_all') }}</router-link>
                </li>
              </ul>
            </div>

            <div class="mega-menu-previews">
              <router-link 
                v-for="item in featuredCategories" 
                :key="item.id" 
                :to="item.path" 
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
      <el-icon class="menu-action-icon" @click="openSearch"><Search /></el-icon>
      <el-icon class="menu-action-icon user-icon" @click="goToProfile"><User /></el-icon> 
      <ShoppingCartIcon />
      <LanguageSwitcher />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';    // ref:创建响应式变量, computed:创建计算属性, onMounted:生命周期钩子
import { Search, User, Loading } from '@element-plus/icons-vue';    // 导入需要用到的图标
import { useRoute, useRouter } from 'vue-router';   // 导入 vue-router 的功能
import { useI18n } from 'vue-i18n';   // 导入国际化功能
import LanguageSwitcher from '@/components/features/LanguageSwitcher.vue';     // 导入语言切换组件
import ShoppingCartIcon from '@/components/features/ShoppingCartIcon.vue';    // 导入购物车图标组件
import { fetchShopCategories, type ShopCategory } from '@/services/apiClient';    // 导入API请求函数和类型定义
import NavItem from './NavItem.vue';    // 导入用于递归的子菜单组件

const { t } = useI18n();    // 获取翻译函数 t
const route = useRoute();   // 获取当前路由的详细信息（如路径）
const router = useRouter();   // 获取路由实例，用于页面跳转

// computed 是一个计算属性，它会根据依赖自动更新。这里它会时刻跟踪当前页面的路径，以确保菜单项能正确高亮。
const activeMenuIndex = computed(() => route.path);
// ref 用于创建响应式变量，当这些变量的值改变时，<template> 中使用到它们的地方会自动更新。
const shopCategories = ref<ShopCategory[]>([]);   // 用于存储从 API 获取的商店分类
const isLoadingShopCategories = ref(false);   // 用于控制是否显示“加载中”状态

onMounted(async () => {
  isLoadingShopCategories.value = true;   // 开始请求前，显示加载状态
  try { shopCategories.value = await fetchShopCategories();   // 等待异步请求完成 
  } catch (e) {
     console.error(e);    // 如果请求失败，在控制台打印错误
  } finally { 
    isLoadingShopCategories.value = false; }  // 不论成功或失败，最后都隐藏加载状态
});   

// 定义了点击图标后要执行的函数
const openSearch = () => router.push('/search');    // 跳转到搜索页
const goToProfile = () => router.push('/profile');    // 跳转到个人资料页

// 在 script 的末尾，goToProfile 函数的后面，添加下面这段代码

// 我们创建一个“计算属性”，它会根据获取到的 shopCategories 数据，
// 动态地生成带有完整 imageUrl 的特色分类列表。
const featuredCategories = computed(() => {
  // 这里我们假设特色分类就是所有分类的前3个，您可以根据需求修改逻辑
  return shopCategories.value.slice(0, 3).map(category => {
    // 假设您的 category 对象中有一个唯一的标识符，比如 'id' 或 'slug'
    // 我们用它来拼接出完整的图片 URL
    return {
      ...category, // 复制 category 的所有原有属性 (id, name, path 等)
      // !! 请根据您的实际情况，确认 id 的字段名，以及 URL 结构 !!
      imageUrl: `http://192.168.2.9:9999/standalones/photo/details?type=0&id=${category.id}` 
    };
  });
});

</script>

<style scoped lang="scss">

.navigation-bar-container {
  display: flex;    /* 使用 Flexbox 布局 */
  align-items: center;    /* 子元素垂直居中 */
  height: 110px;    /* 导航栏高度 */
  background-color: #ffffff;     /* 背景色 */
  border-bottom: 1px solid #e0e0e0;
  width: 100%;  /* 宽度占满父容器 */
  box-sizing: border-box;   /* padding 和 border 不会增加总宽度 */

   /* 置顶功能的样式 */
  position: sticky;   /* 声明为“粘性定位” */
  top: 0;    /* 滚动到距离浏览器视口顶部 0px 时触发固定效果 */
  z-index: 1000;    /* 设置堆叠顺序，确保导航栏在页面其他内容之上 */
  margin-block-start: 0;    /* 重置顶部外边距，防止意外空白 */
  margin-block-end: 0;    /* 重置底部外边距，防止意外空白 */
}

/* Logo 和右侧图标容器的样式 */
.logo-container {
  position: absolute;   /* 使用绝对定位，让它们可以脱离文档流，覆盖在菜单之上 */
  left: 100px;      /* Logo 定位在左侧 */
  top: 50%;   /* 先向下移动50% */
  transform: translateY(-50%);    /* 再向上移动自身高度的50%，实现完美的垂直居中 */
  z-index: 2;   /* 确保它们在菜单项之上 */
  .logo-image {
    height: 108px;    /* 设置 Logo 图片的高度 */
    display: block;     /* 移除图片作为 inline 元素时可能产生的下方几像素的空隙 */
  }
}

/* Element Plus 主导航菜单的容器样式 */
.main-navigation-menu {
  height: 100%;   /* 高度继承父容器 */
  display: flex !important;   /* 使用 !important 强制覆盖 Element Plus 的默认样式，确保 Flexbox 生效 */
  align-items: center !important;   /* 垂直居中 */
  flex-grow: 1;   /* 让它占据 Logo 和右侧图标之间的所有剩余空间 */
  justify-content: center;    /* 让菜单项在可用的空间内居中对齐 */
  /* 左右的 padding 是为了“推开”中间的菜单项，防止它们与两侧的 Logo 和图标重叠 */
  padding-left: 230px;
  padding-right: 250px;
  border-bottom: none !important;   /* 移除 Element Plus 菜单自带的下边框 */
  background-color: transparent;     /* 背景色设为透明 */

  // 菜单项的字体、颜色、间距
  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    padding-top: 0 !important;    /* 重置内边距 */
    padding-bottom: 0 !important;
    padding-left: 30px !important;    /* 菜单项左内边距 */
    padding-right: 15px !important;   /* 菜单项右内边距 */
    font-size: 24px;      /* 字体大小 */
    font-weight: 700;     /* 字体粗细 */
    color: #000000 !important;      /* 字体颜色 */
    border-bottom: none !important; 
    background-color: transparent !important; 

    // 设置鼠标悬浮时的样式
    &:hover {
      color: var(--el-color-primary) !important;    /* 悬浮时变为主题色 */
      background-color: transparent !important;
    }
  }

  /* 针对可展开的子菜单标题做一些微调 */
  :deep(.el-sub-menu__title) {
    padding-right: 10px !important;     /* 减少右内边距，让箭头更靠近文字 */
    
    /* 设置子菜单右侧的下拉小箭头图标样式 */
    .el-sub-menu__icon-arrow {
      margin-left: 8px !important;    
      vertical-align: middle;   /* 确保箭头和文字垂直对齐 */
      position: static !important;    /* 覆盖 Element Plus 可能的定位样式 */
    }
  }

  .el-menu-item.is-active,
:deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: #000000 !important;
}

   /* “加载中”状态的图标样式 */
  :deep(.el-menu-item .el-icon.is-loading) {
    margin-right: 8px;
    font-size: 18px;
  }
}
  
/* 右侧功能图标的容器样式 */
.right-menu-items {
  position: absolute;   /* 同样使用绝对定位 */
  right: 100px;   /* 图标定位在右侧 */
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: flex !important;   /* 让内部的图标水平排列 */
  flex-direction: row !important;   /* 确保是行方向 */
  align-items: center !important;    /* 垂直居中 */
  gap: 12px;    /* 设置图标之间的间距 */

  //  这里用于给所有图标容器设置一些通用样式
  & > * { 
    display: inline-flex !important; 
    align-items: center !important;   
    justify-content: center !important;
    flex-shrink: 0;       /* 防止图标在空间不足时被压缩 */
    cursor: pointer;      /* 鼠标悬浮时显示为小手形状 */
  }
  }


// 定义图标容器的统一尺寸
.menu-action-icon,
.menu-action-item.shopping-cart-item-wrapper {
  width: 38px; 
  height: 38px; 
}

// 搜索、用户等图标的大小和颜色
.menu-action-icon { 
  font-size: 25px;    /* 控制图标的大小 */
  color: #000000 ;    /* 控制图标的颜色 */
  &:hover { 
    color: var(--el-color-primary);   /* 鼠标悬浮时变为主题色 */
  }
}

/* 针对购物车图标的特殊微调 */
  :deep(.shopping-cart-icon-wrapper) {
    /* 因为这个组件没有 .menu-action-item 类，
      我们在这里为它补上和其他图标统一的尺寸，确保对齐。
    */
    width: 38px; 
    height: 38px; 
    
    /* 保留您之前的微调样式 */
    margin-left: -10px;
    margin-right: -5px;

  /* 深度选择器，修改 Element Plus 徽章组件的样式 */
  .el-badge.cart-badge { 
    display: flex !important;     
    align-items: center !important; 
    justify-content: center !important;
    width: 100%; 
    height: 100%;
    padding: 0 !important;        
  }

  /* 深度选择器，修改购物车图标的样式 */
  i.el-icon.cart-icon { 
    color: #000000 !important; 
    font-size: 25px !important; 
    line-height: 1; 
  }
}

/* 针对语言切换器组件的特殊微调 */
  :deep(.language-switcher) { 
    /* 同样，为它补上一些基础对齐样式 */
    display: inline-flex;
    align-items: center;
    justify-content: center;

  /* 深度选择器，修改 Element Plus 下拉菜单的触发链接样式 */
  .el-dropdown-link { 
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


/* 在 NavigationBar.vue 的 <style scoped> 的末尾添加 */

:deep(.el-menu--popup.shop-mega-menu) {
  /* 我们只做一件事：把背景色强制改成一个非常鲜艳的颜色 */
  background-color: limegreen !important; /* 亮绿色 */
}
</style>