<!-- 页脚 -->
<template>
  <footer class="app-footer">
    <div class="footer-container">
      <el-row :gutter="40" class="footer-main">
        <el-col :xs="24" :sm="12" :md="5">
          <div class="footer-column">
            <h4 class="footer-heading">{{ $t('footer.company.title') }}</h4>
            <ul class="footer-links">
              <li><a href="#">{{ $t('footer.company.about_us') }}</a></li>
              <li><a href="#">{{ $t('footer.company.blog') }}</a></li>
              <li><a href="#">{{ $t('footer.company.privacy_policy') }}</a></li>
              <li><a href="#">{{ $t('footer.company.terms_of_service') }}</a></li>
            </ul>
          </div>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="5">
          <div class="footer-column">
            <h4 class="footer-heading">{{ $t('footer.support.title') }}</h4>
            <ul class="footer-links">
              <li><a href="#">{{ $t('footer.support.faq') }}</a></li>
              <li><a href="#">{{ $t('footer.support.contact_us') }}</a></li>
              <li><a href="#">{{ $t('footer.support.app_service') }}</a></li>
              <li><a href="#">{{ $t('footer.support.user_manual') }}</a></li>
              <li><a href="#">{{ $t('footer.support.shipping_policy') }}</a></li>
              <li><a href="#">{{ $t('footer.support.warranty_policy') }}</a></li>
              <li><a href="#">{{ $t('footer.support.return_refund_policy') }}</a></li>
            </ul>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="5">
          <div class="footer-column">
            <h4 class="footer-heading">{{ $t('footer.how_it_works.title') }}</h4>
            <ul class="footer-links">
              <li><a href="#">{{ $t('footer.how_it_works.user_manual') }}</a></li>
            </ul>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="9">
          <div class="footer-column">
            <h4 class="footer-heading signup-heading">{{ $t('footer.signup.title') }}</h4>
            <div class="subscribe-form">
              <el-input :placeholder="$t('footer.signup.email_placeholder')" v-model="email" class="subscribe-input">
                <template #append>
                  <el-button :icon="ArrowRightBold" />
                </template>
              </el-input>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row justify="space-between" align="middle" class="footer-bottom">
        <el-col :xs="24" :md="12" class="social-icons-wrapper">
          <div class="social-icons">
            <a href="#" class="social-icon facebook" aria-label="Facebook"><img src="@/assets/images/icons/facebook.png" alt="Facebook"></a>
            <a href="#" class="social-icon instagram" aria-label="Instagram"><img src="@/assets/images/icons/instagram.png" alt="Instagram"></a>
            <a href="#" class="social-icon tiktok" aria-label="TikTok"><img src="@/assets/images/icons/tiktok.png" alt="TikTok"></a>
            <a href="#" class="social-icon youtube" aria-label="YouTube"><img src="@/assets/images/icons/youtube.png" alt="YouTube"></a>
          </div>
        </el-col>
        
        <el-col :xs="24" :md="12" class="app-stores-wrapper">
          <div class="app-stores">
            <a href="#" class="store-badge"><img src="@/assets/images/app-store.png" alt="Download on the App Store"></a>
            <a href="#" class="store-badge google-play"><img src="@/assets/images/google-play.png" alt="Get it on Google Play"></a>
          </div>
        </el-col>
      </el-row>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowRightBold } from '@element-plus/icons-vue';

const { t } = useI18n();
const email = ref('');
</script>

<style scoped lang="scss">

/* 页脚最外层容器的样式 */
.app-footer { 
  background-color: #000;    /* 背景色为黑色 */
  color: #fff;               /* 默认文字颜色为白色 */
  padding: 80px 0 80px;        /* 上下内边距80px，左右为0 */
  font-size: 18px;             /* 基础字体大小 */
  line-height: 2.0;            /* 基础行高 */
}

/* 内容容器样式 */
.footer-container { 
  max-width: 1600px;    /* 内容最大宽度为1600px */
  margin: 0 auto;       /* 实现水平居中 */
  padding: 0 20px;      /* 左右内边距20px，防止内容贴边 */
}

/* 主要链接区域的样式 */
.footer-main { 
  padding-bottom: 40px;     /* 距离下方的分割线有40px的内边距 */
  margin-bottom: 40px;      /* 距离下方的 footer-bottom 区域有40px的外边距 */
  border-bottom: 1px solid #333;    /* 底部分割线 */
}

/* 每一列的通用样式 */
.footer-column { 
  /* 嵌套选择器，选中 .footer-column 内部的 .footer-heading */
  .footer-heading {
    font-size: 24px;      /* 标题字体大小 */
    font-weight: 600;     /* 字体粗细为半粗体 */
    margin-top: 0;        /* 顶部外边距为0 */
    margin-bottom: 24px;  /* 底部外边距24px */
    color: #ffffff;     /* 颜色为白色 */
  }

  /* 针对邮件订阅标题的特殊样式 */
  .signup-heading {
    font-size: 48px;
    font-weight: 700;   /* 更粗的字体 */
  }
}

.footer-links {
  /* 1. 移除列表项前面默认的“白点” */
  list-style: none;
  
  /* 2. 移除列表默认的左内边距，让文字与上方标题左侧对齐 */
  padding: 0;
}

/* 链接列表中的 <a> 标签样式 */
.footer-links a { 
  color: #a0a0a0;           /* 链接默认颜色为灰色 */
  text-decoration: none;      /* 去掉下划线 */
  transition: color 0.2s;     /* 颜色变化时有0.2秒的平滑过渡效果 */
  font-size: 18px;            /* 链接字体大小 */
  font-weight: 400;           /* 正常粗细 */
  
  /* & 代表当前选择器(a)，&:hover 就是设置鼠标悬浮时的样式 */
  &:hover { 
    color: #ffffff;         /* 鼠标悬浮时变为白色 */
  }
}

/* 邮件订阅输入框的样式 */
.subscribe-form .subscribe-input {
  max-width: 560px;         /* 输入框最大宽度 */
  width: 100%;              /* 宽度占满父容器 */
  --input-height: 56px;     /* 定义一个CSS变量，方便统一修改高度 */
  
  /* :deep() 深度作用选择器，用于修改 Element Plus 组件内部的样式 */
  :deep(.el-input__wrapper) {
    height: var(--input-height);      /* 使用上面定义的变量来设置高度 */
  }
  :deep(.el-button) {
    /* 通过计算，让按钮基本呈正方形 */
    width: calc(var(--input-height) - -4px);
    height: calc(var(--input-height) - 8px);
  }
}

/* 社交媒体图标容器的样式 */
.social-icons {
  display: flex;            /* 使用 Flexbox 布局 */
  gap: 15px;                /* 图标之间的间距为15px */
  align-items: center;      /* 垂直居中对齐 */
  
  .social-icon {
    display: flex;
    justify-content: center;          /* 水平居中 */
    align-items: center;              /* 垂直居中 */
    width: 28px;                      /* 容器宽度 */
    height: 28px;                     /* 容器高度 */
    border-radius: 50%;               /* 制作成圆形 */
    background-color: #000000;
    border: 2.3px solid #e0e0e0;    /* 边框 */

    img {
      height: 20px;
      width: 20px;
      filter: none;         /* 确保图片显示原始颜色 */
    }
  }
}

/* 应用商店徽章容器的样式 */
.app-stores {
  display: flex;
  justify-content: flex-end;        /* 让内容靠右对齐 */
  align-items: center;
  gap: 30px;

  .store-badge {
    display: inline-block;
    width: 120px;
    height: 40px;
    border: 2.3px solid #fff;
    border-radius: 8px;
    box-sizing: border-box;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;    /* 确保图片完整显示且不变形 */
    }
  }
}


/* @media 是媒体查询，用于响应式设计 */
/* 当屏幕宽度小于等于 768px 时，应用以下样式 */
@media (max-width: 768px) {
  .footer-bottom { 
    flex-direction: column;     /* 将 flex 方向从水平变为垂直，即堆叠起来 */
    gap: 30px; 
  }
  .social-icons-wrapper, .app-stores-wrapper { 
    width: 100%; 
    display: flex; 
    justify-content: center;    /* 在小屏幕上让它们都居中显示 */
  }
}
</style>