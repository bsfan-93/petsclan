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
      
      <el-sub-menu index="/about">
        <template #title>{{ $t('nav.aboutUs') }}</template>
        <el-menu-item index="/about/story">{{ $t('nav.aboutUs_story') }}</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/app-download">{{ $t('nav.app') }}</el-menu-item>
    </el-menu>

    <div class="right-menu-items"> 
      <ExpandingSearchBar />
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
import ExpandingSearchBar from '@/components/features/ExpandingSearchBar.vue';
// 14. 导入 API 请求函数和数据类型定义
import { fetchShopCategories, type ShopCategory } from '@/services/apiClient';

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

// 21. onMounted 生命周期钩子，在组件挂载后执行一次
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
  // 我们不再需要在这里拼接URL，因为apiClient已经处理好了
  // 直接从 shopCategories 中截取前3个即可
  // 注意：我们假设 fetchShopCategories 返回的数据已经包含了 imageUrl
  return shopCategories.value.slice(0, 3);
});

</script>

<style scoped lang="scss">
/* 25. 导航栏最外层容器的样式 */
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

/* 26. Logo 容器的样式 */
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

/* 27. 右侧图标容器的样式 */
.right-menu-items {
  position: absolute;
  right: 100px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 28. 中间主导航菜单的样式 */
.main-navigation-menu {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
  border-bottom: none !important;
  background-color: transparent;

  /* 29. 修改子组件 el-menu-item 和 el-sub-menu__title 的样式 */
  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    padding: 0 35px !important;
    font-size: 26px;
    font-weight: 700;
    color: #000000 !important;
    &:hover {
      color: var(--el-color-primary) !important;
    }
  }

  /* 30. 子菜单的下拉箭头图标样式 */
  :deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
    margin-left: 8px !important;
    vertical-align: middle;
    position: static !important;
  }

  /* 31. 菜单项被激活（选中）时的样式 */
  .el-menu-item.is-active,
  :deep(.el-sub-menu.is-active .el-sub-menu__title) {
    color: #000000 !important;
    border-bottom: none !important;
  }
}

/* 32. 右侧普通图标的通用样式 */
.menu-action-icon {
  font-size: 25px;
  color: #000000;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}

/* 33. 针对购物车图标的特殊微调 */
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

  &:hover {
    i.el-icon.cart-icon {
      color: var(--el-color-primary);
    }
  }
}
</style>

<style lang="scss">
/* 34. 针对我们自定义的 shop-mega-menu 类进行样式设置 */
.el-popper.is-light.shop-mega-menu {
  top: 176px !important;

  /* --- 以下是主要修改点 --- */
  left: 1px !important; /* 1. 将左侧定位点设为 100px，与您的Logo对齐 */
  transform: translateX(0) !important; /* 2. 移除居中的横向位移 */

  /* 宽度可以保持不变，或者设置为您想要的固定宽度 */
  width: 2000px; /* 您可以设置为一个固定的宽度，例如1200px */
  max-width: 2000px; /* 同时设置一个最大宽度，防止在小屏幕上超出 */
  
  /* 外观：只保留必要的样式 */
  border-radius: 0 0 20px 20px !important;
  background-color: transparent; /* 背景透明 */
  border: none;                  /* 移除边框 */
  box-shadow: none;              /* 移除阴影 */

  // border: 2px solid red !important; /* 添加一个2像素的红色实线边框用于调试 */
}

/* 35. 移除内部 el-menu 的默认样式，让我们的内容来填充 */
.el-popper.shop-mega-menu .el-menu--popup {
  padding: 0 !important;
  border: none !important;
}

/* 36. Mega Menu 内部内容的布局 */
.shop-mega-menu .mega-menu-content {
  display: flex;
  /* padding: 上下内边距  左右内边距; */
  /* ↓↓↓ 修改这里的第二个值来调整左右内边距 ↓↓↓ */
  padding: 40px 60px; /* 例如，从 50px 增大到 60px */
  gap: 120px;
}

/* 37. 左侧导航链接列的样式 */
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
    /* ↓↓↓ 修改这里的数值来调整链接之间的垂直间距 ↓↓↓ */
    li { margin-bottom: 40px; }
  }

  /* 这是一个SCSS嵌套规则，它会选中所有 .mega-menu-link 类的元素 */
.mega-menu-link {
    /* 设置字体大小为 30 像素 */
    font-size: 35px;
    /* 设置字体粗细为 700 (等同于 'bold'，粗体) */
    font-weight: 700;
    /* 设置文字颜色为深灰色 (#303133) */
    color: #303133;
    /* 移除文字下方的下划线 */
    text-decoration: none;
    /* 为颜色变化添加一个0.2秒的平滑过渡动画效果 */
    transition: color 0.2s;
    
    /* & 代表当前选择器(.mega-menu-link)，&:hover 设置鼠标悬浮在链接上时的样式 */
    &:hover { 
        /* 将文字颜色变为 Element Plus 的主题色 (通常是蓝色) */
        color: var(--el-color-primary); 
    }

    /* & 代表当前选择器(.mega-menu-link)，&.all-items-link 选中同时拥有这两个类的元素 */
    &.all-items-link {
        /* 设置距离上方元素的间距为 25 像素 */
        margin-top: 25px;
        /* 将元素设置为行内块级元素，使其可以拥有上下外边距 */
        display: inline-block;
        /* 覆盖上面设置的字体大小，将这个特定链接的字号设为 18 像素 */
        font-size: 38px;
        /* 覆盖上面设置的颜色，将这个特定链接的颜色设为 Element Plus 的主题色 */
        color: var(--el-color-primary);
    }
} 
}

/* 38. 右侧产品预览区域的样式 */
.shop-mega-menu .mega-menu-previews {
  display: flex;
  flex-grow: 1;
  gap: 45px;    /* 例如，将间距从25px增大到30px */
  justify-content: space-between;
}

/* 39. 单个产品预览卡的样式 */
/* 选中所有 .mega-menu-preview-card 类的元素 */
.mega-menu-preview-card {
    /* 将元素设置为块级元素，使其占据一整行 */
    display: block;
    /* 移除文字下方的下划线 */
    text-decoration: none;
   /* 关键：我们不再使用固定的宽度，而是让它自动填充 */
    flex: 1; /* 让每个卡片平均占据所有可用空间 */
    min-width: 420px; /* 可以设置一个最小宽度，防止过度压缩 */

    /* 设置卡片的圆角为 15 像素 */
    border-radius: 15px;
    /* 隐藏超出圆角部分的内容 */
    overflow: hidden;
    /* 为 transform 和 box-shadow 属性的变化添加一个0.2秒的平滑过渡动画 */
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    display: block; /* 移除图片下方可能的空隙 */
    background-color: #161616; /* 为留白区域设置一个背景色 */
    /* & 代表当前选择器(.mega-menu-preview-card)，&:hover 设置鼠标悬浮在卡片上时的样式 */
    &:hover {
        /* 将卡片向上移动 5 像素 */
        transform: translateY(-5px);
        /* 为卡片添加一个更明显的阴影效果 */
        box-shadow: 0 6px 12px rgba(175, 115, 115, 0.08);
    }

    /* 选中卡片内部的 .preview-image 元素 */
    .preview-image {
        /* 设置图片宽度为100%，撑满卡片 */
        width: 100%;
        /* 设置图片的固定高度为 180 像素 */
        height: 400px;
        /* 保持图片宽高比，放大并裁剪多余部分以填充整个容器 */
        object-fit: cover;
        /* 将图片设置为块级元素，移除下方可能的空隙 */
        display: block;
        /* 设置一个浅灰色背景，作为图片加载时的占位颜色 */
        background-color: #f5f7fa;
    }

    /* 选中卡片内部的 .preview-name 元素 */
    .preview-name {
        /* 将其设置为块级元素 */
        display: block;
        /* 设置内部的上下左右内边距为 12 像素 */
        padding: 12px;
        /* 设置背景色为浅灰色 */
        background-color: #f8f9fa;
        /* 设置文字颜色 */
        color: #333;
        /* 设置字体粗细为 500 (中等粗细) */
        font-weight: 500;
        /* 设置文字水平居中对齐 */
        text-align: center;
    }
}


</style>