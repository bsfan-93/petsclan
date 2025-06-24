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
/*
 * ===================================================================
 * 大型菜单 (Mega Menu) 样式
 * ===================================================================
*/

/* ✨ 修正点：将所有下拉菜单的样式都放在这个不带 scoped 的块里 */

/* 重置 Element Plus 下拉菜单的内层样式，让它变透明 */
.el-popper.shop-mega-menu .el-dropdown-menu {
  padding: 0 !important;              /* 内边距设为0 */
  border: none !important;                 /* 去掉边框 */
  background: transparent !important;      /* 背景设为透明 */
  box-shadow: none !important;             /* 去掉阴影 */
}

/* 设置菜单面板本身的大小和外观 */
.el-popper.is-light.shop-mega-menu {
  /* --- 关键布局修正 --- */
  top: 171px !important;                   /* 定位：从导航栏下方（110px）开始 */
  z-index: 1000 !important;                   /* 层级：确保在导航栏下方（导航栏为1000）*/
  left: 50% !important;                    /* 定位：水平居中第一步 */
  transform: translateX(-50%) !important;    /* 定位：水平居中第二步 */

  /* --- 以下为你设定的参数，我进行了整理和修正 --- */
  width: 2116px;                             /* 宽度：保留你设定的值 */
  max-width: 100vw;                           /* 最大宽度：修正为一个合理的值，防止超出屏幕 */
  height: auto;                              /* 高度：由内容自动撑开，比固定的 50vh 更灵活 */
  
  /* 其他美化样式 */
  border-radius: 0 !important;               /* 边框圆角：按你的设定去掉 */
  border: none !important;            /* 边框：移除所有边框*/
  border-bottom: 1px solid #e4e7ed !important; /* 只加上底部的边框作为分割线 */
  border-top: none !important;               /* 顶部无边框，与导航栏无缝衔接 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 阴影：保留你设定的值 */
  padding: 0 !important;                     /* 面板自身无内边距 */
  background-color: #fff;                    /* 面板背景色 */
}

/* 我们自己的内容容器的布局 */
.shop-mega-menu .mega-menu-content {
  display: flex;                             /* flex 布局 */
  flex-direction: row;                       /* 水平排列，形成左右两列 */
  padding: 130px 130px;                      /* 内边距：保留你设定的值 */
  gap: 1000px;                                /* ✨ 修正：原 1300px 值过大，会导致布局破坏，已调整为更能体现你意图的 120px */
  align-items: stretch;                   /* 让左右两列顶部对齐 */
}

/* 左列：文字链接列表的样式 */
.shop-mega-menu .mega-menu-nav {
  flex-basis: 220px;                         /* 基础宽度：保留你设定的值 */
  flex-shrink: 0;                            /* 防止被压缩 */
  border-right: 1px solid #f0f0f0;           /* 右侧分割线 */
  padding-right: 50px;                       /* 右内边距 */
  
  /* 左列标题 "Collection" 的样式 */
  .mega-menu-title {
    font-size: 30px;                         /* 字体大小：保留你设定的值 */
    font-weight: 900;                        /* 字体粗细：保留你设定的值 */
    color: #909399;                          /* 字体颜色：保留你设定的值 */
    margin-top: 0;                           /* 顶部外边距 */
    margin-bottom: 50px;                     /* 底部外边距：保留你设定的值 */
    text-transform: uppercase;               /* 文本大写 */
  }
  
  /* 链接列表 <ul> 标签的样式 */
  ul {
    list-style: none;                        /* 去掉列表默认的点 */
    padding: 0;                              /* ✨ 修正：原 110 没有单位，修正为 0 */
    margin: 0;                               /* 去掉外边距 */
  }

  /* 列表项 <li> 标签的样式 */
  li {
    margin-bottom: 50px;                     /* 列表项间距：保留你设定的值 */
  }

  /* 链接 <a> 标签的样式 */
  .mega-menu-link {
    text-decoration: none;                   /* 去掉下划线 */
    font-size: 50px;                         /* 字体大小：保留你设定的值 */
    font-weight: 700;                        /* 字体粗细：保留你设定的值 */
    color: #303133;                          /* 字体颜色：保留你设定的值 */
    
    /* 鼠标悬浮在链接上时的样式 */
    &:hover {
      color: #409eff;                        /* 悬浮颜色：保留你设定的值 */
    }
  }
}

/* 右列：图片预览列表的样式 */
.shop-mega-menu .mega-menu-previews {
  display: flex;                             /* flex 布局 */
  flex-grow: 1;                              /* 占据所有剩余空间 */
  justify-content: space-between;            /* 项目之间均匀分布 */
  gap: 10px;                                 /* 项目之间的间距 */
  justify-content: space-around;             /* 让三张图片在拉长后的空间里均匀分布 */
  /* 图片预览卡片的样式 */
  .mega-menu-preview-card {
    display: block;                          /* 显示为块级元素 */
    text-decoration: none;                   /* 去掉链接下划线 */
    width: 200px; /* <-- 添加这一行，并设置你想要的任意宽度 */
    // flex: 1;                                 /* 每个卡片等分空间 */

    /* 卡片中图片的样式 */
    .preview-image {
      width: 100%;                           /* 图片宽度占满卡片 */
      aspect-ratio: 1;                       /* 宽高比 1:1 (正方形) */
      object-fit: cover;                     /* 图片裁剪以填满容器 */
      border-radius: 0px;                    /* 图片圆角 */
      // margin-bottom: 12px;                   /* 图片与下方文字的间距 */
      transition: all 0.3s ease;             /* 平滑过渡效果 */
      background-color: #f5f7fa;             /* 图片加载前的占位背景色 */
    }

    /* 卡片中文字的样式 */
    .preview-name {
      font-size: 15px;                       /* 字体大小 */
      font-weight: 500;                      /* 字体粗细 */
      text-align: center;                    /* 文字居中 */
      color: #303133;                        /* 字体颜色 */
    }

    /* 鼠标悬浮在整个卡片上时的效果 */
    &:hover .preview-image {
      transform: translateY(-5px);           /* 图片向上移动，产生上浮效果 */
      box-shadow: 0 8px 16px rgba(0,0,0,0.1); /* 同时增加阴影 */
    }
  }
}

:deep(.el-menu--popup.shop-mega-menu) {
  /* 重置 Element Plus 的默认样式 */
  padding: 0;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  background-color: #ffffff;
}

.mega-menu-content {
  display: flex; /* 使用 Flex 布局实现多列效果 */
  padding: 30px 40px;
  gap: 50px; /* 设置列之间的间距 */
}

.mega-menu-nav {
  flex-shrink: 0; /* 防止这一列被压缩 */

  .mega-menu-title {
    font-size: 16px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    margin: 0 0 20px 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 15px;
    }
  }

  .mega-menu-link {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--el-color-primary);
    }

    &.all-items-link {
      color: var(--el-color-primary);
      margin-top: 20px;
      display: inline-block;
    }
  }
}

.mega-menu-previews {
  display: flex;
  gap: 20px; /* 设置预览卡片之间的间距 */
}

.mega-menu-preview-card {
  display: block;
  text-decoration: none;
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }

  .preview-image {
    width: 200px; /* 固定图片宽度 */
    height: 150px; /* 固定图片高度 */
    object-fit: cover;
    display: block;
  }

  .preview-name {
    display: block;
    padding: 10px;
    background-color: #f5f7fa;
    color: #333;
    font-weight: 500;
    text-align: center;
  }
}
</style>