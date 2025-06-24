<template>
  <el-dialog
    v-model="isModalVisible"
    class="subscription-modal"
    width="720px"
    :show-close="false"
    :close-on-click-modal="false"
    align-center
  >
    <div class="modal-content">
      <div class="left-pane">
        <img src="@/assets/images/popover.png" alt="Pets Clan Promo" class="promo-image">
      </div>

      <div class="right-pane">
        <h2 class="title">Unlock <span>20% OFF</span><br>Your order Today</h2>
        <p class="subtitle">Make it more convenient for pets</p>
        
        <div class="form-group">
          <label for="email-input">Email</label>
          <el-input
            id="email-input"
            v-model="email"        
            placeholder="Email"
            size="large"
          />
          <span v-if="emailError" class="error-message">{{ emailError }}</span>
        </div>
        
        <el-button 
          type="primary" 
          size="large" 
          class="subscribe-button" 
          @click="handleSubscribe"
          :loading="isLoading"
        >
          Subscribe For
        </el-button>
        
        <a href="#" class="no-thanks-link" @click.prevent="closeModal(false)">No, Thanks</a>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
// 从 'vue' 导入 ref 用于创建响应式变量，computed 用于创建计算属性，watch 用于监听变化
import { ref, computed, watch } from 'vue';
// 导入 Pinia store，用于全局状态管理
import { useUiStore } from '@/store/modules/ui';
// 从 Element Plus 导入消息提示组件
import { ElMessage } from 'element-plus';
// 导入我们自己封装的 API 请求函数
import { subscribeEmail } from '@/services/apiClient';

// 获取 ui store 的实例
const uiStore = useUiStore();
// 创建一个响应式变量，用于双向绑定输入框的 email 值
const email = ref('');
// 创建一个响应式变量，用于控制按钮的加载状态
const isLoading = ref(false);
// 创建一个响应式变量，用于存储错误信息
const emailError = ref('');

// 创建一个计算属性，它负责弹窗的显示和隐藏，并与 store 中的状态保持同步
const isModalVisible = computed({
  // get 方法：当读取 isModalVisible 的值时，返回 store 中的状态
  get: () => uiStore.isSubscriptionModalVisible,
  // set 方法：当修改 isModalVisible 的值时（比如 v-model 改变），调用 store 的 action 来更新状态
  set: (value) => uiStore.setSubscriptionModalVisible(value),
});

// 定义关闭弹窗的函数
const closeModal = (subscribed: boolean) => {
  // 如果是成功订阅后关闭
  if (subscribed) {
    // 使用 sessionStorage 存储一个标记，表示用户已经订阅/关闭过。
    // sessionStorage 的数据只在当前浏览器会话期间有效，关闭标签页后失效。
    sessionStorage.setItem('subscriptionModalClosed', 'true');
  }
  // 更新 store 的状态，隐藏弹窗
  isModalVisible.value = false;
};

// 定义处理订阅按钮点击事件的异步函数
const handleSubscribe = async () => {
  // 校验邮箱是否为空
  if (!email.value) {
    emailError.value = 'This field is required'; // 设置错误信息
    return; // 中断函数执行
  }
  // 使用正则表达式校验邮箱格式
  if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address.'; // 设置错误信息
    return; // 中断函数执行
  }
  
  // 开始 API 请求，将按钮设为加载中状态
  isLoading.value = true;
  // 调用 API 函数，并等待它返回结果（成功或失败）
  const success = await subscribeEmail(email.value);
  // 请求结束后，取消按钮的加载中状态
  isLoading.value = false;

  // 根据 API 返回的结果，给出不同的用户提示
  if (success) {
    // 如果成功，显示成功的消息提示
    ElMessage.success('Thank you for subscribing!');
    // 关闭弹窗，并标记为“永久”关闭
    closeModal(true); 
  } else {
    // 如果失败，在输入框下方显示错误信息
    emailError.value = 'Subscription failed. Please try again later.';
  }
};

// 监听 email 输入框的变化，当用户开始输入时，自动清除错误提示，提升用户体验
watch(email, () => {
  if (emailError.value) {
    emailError.value = '';
  }
});
</script>

<style scoped lang="scss">
/* 使用 :deep() 深度选择器，可以穿透到 Element Plus 子组件的内部，修改其样式。
  我们用它来修改 .el-dialog 这个由 Element Plus 生成的类。
*/

:deep(.el-dialog.subscription-modal) {
  border-radius: 20px !important; /* 设置弹窗的圆角 */
  padding: 0;                     /* 移除 Element Plus 的默认内边距 */
  overflow: hidden;               /* 确保子元素的圆角能正确显示，防止内容溢出 */
  border: none !important; /* ✨ 新增：去掉边框 */
  background: transparent !important; /* ✨ 1. 将对话框本身背景设为透明 */
  box-shadow: none !important;      /* ✨ 2. 移除默认的阴影 */

  /* 隐藏 Element Plus 自带的弹窗头部（通常包含标题和关闭按钮）*/
  .el-dialog__header {
    display: none;
  }
  
  /* 移除 Element Plus 自带的弹窗主体的内边距 */
  .el-dialog__body {
    padding: 0;
  }
}

/* 我们自己的内容容器，设置为 flex 布局 */
.modal-content {
  display: flex;
  height: 400px; /* 您可以根据需要调整弹窗的整体高度 */
  background-color: #fff; /* 将背景色从外层移到这里 */
  border-radius: 16px;   /* ✨ 3. 在这里设置圆角 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* 在这里设置阴影 */
  overflow: hidden;      /* 确保子元素的圆角生效 */
}

/* 左侧图片区域的样式 */
.left-pane {
  width: 300px;           /* 固定宽度 */
  background-color: #5a5757; /* 背景设为黑色 */
  flex-shrink: 0;         /* 防止此区域被压缩 */
}

/* 图片本身的样式 */
.promo-image {
  width: 100%;             /* 让图片宽度撑满100% */
  height: 100%;            /* 让图片高度也撑满100% */
  object-fit: cover;       /* 让图片裁剪以适应并覆盖整个容器，同时保持自身比例 */
}

/* 右侧表单区域的样式 */
.right-pane {
  flex: 1;                /* 占据所有剩余的可用空间 */
  padding: 40px;          /* 设置内边距 */
  display: flex;          /* 内部也使用 flex 布局 */
  flex-direction: column; /* 让内部元素垂直排列 */
  justify-content: center;/* 让内容在垂直方向上居中 */
  
  /* 标题 "Unlock..." 的样式 */
  .title {
    color: #333;           /* 标题主色 */
    font-size: 32px;
    font-weight: 800;       /* 800 是更粗的字重 (Extra-bold) */
    line-height: 1.2;
    margin: 0 0 10px;     /* 设置外边距，只保留下方 10px */
    
    /* 标题中 "20% OFF" 的样式 */
    span {
      color: #e53935;   /* 字体颜色设为红色 */
      font-weight: 800; /* 字体加粗 */
    }
  }

  /* 副标题的样式 */
  .subtitle {
    font-size: 16px;
    color: #666;           /* 副标题颜色 */
    margin: 0 0 30px;
  }

  /* 表单组（标签 + 输入框）的容器样式 */
  .form-group {
    position: relative; /* 设为相对定位，为内部绝对定位的错误信息提供定位锚点 */
    padding-bottom: 22px; /* 在底部留出 22px 的空间，用于显示错误信息 */

    label {
      display: block;      /* 让标签独占一行 */
      font-weight: 500;
      margin-bottom: 8px;
    }
  }

  /* 错误提示的样式 */
  .error-message {
    position: absolute;    /* 绝对定位 */
    bottom: 0;             /* 定位到父容器的底部 */
    left: 0;               /* 定位到父容器的左侧 */
    font-size: 13px;
    color: #e53935;        /* 字体颜色为红色 */
  }

  /* 订阅按钮的样式 */
  .subscribe-button {
    width: 100%;
    background-color: #ffc107; /* 背景色 */
    border-color: #ffc107;     /* 边框颜色 */
    color: #000;               /* 文字颜色 */
    font-weight: bold;
    margin-top: 20px;
    
    /* 鼠标悬浮时的样式 */
    &:hover {
      background-color: #ffca2c;
      border-color: #ffca2c;
    }
  }
  
  /* "No, Thanks" 链接的样式 */
  .no-thanks-link {
    margin-top: 15px;
    text-align: center;    /* 文字居中 */
    color: #bfbfbf;
    text-decoration: none; /* 去掉下划线 */
    font-size: 14px;
    
    /* 鼠标悬浮时的样式 */
    &:hover {
      text-decoration: underline; /* 悬浮时显示下划线 */
    }
  }
}
</style>