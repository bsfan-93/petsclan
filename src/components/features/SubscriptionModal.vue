<template>
  <div id="subscription-modal-container">
    <el-dialog
      v-model="isModalVisible"
      width="clamp(400px, 80vw, 950px)"
      :show-close="true"
      center
      align-center
      @closed="onModalClose"
    >
      <div class="modal-content-wrapper">
        <div class="image-section">
          <img src="@/assets/images/popup_shown.png" alt="A dog looking aside" class="modal-image">
        </div>
        
        <div class="form-section">
          <div class="form-header">
            <h2>
              Unlock <span class="highlight-text">20%</span> OFF<br>
              Your order Today
            </h2>
            <p>Make it more convenient for pets</p>
          </div>

          <el-form @submit.prevent="handleSubscription" class="subscription-form" novalidate>
            <el-input
              id="email-input"
              v-model="email"
              type="email"
              placeholder="Email"
              size="large"
              :class="{ 'is-invalid': emailError }"
              @input="clearError"
              required
            />
            <div v-if="emailError" class="input-error-message">
              {{ emailError }}
            </div>
            <el-button type="primary" native-type="submit" class="subscribe-button" :loading="isLoading">
              Subscribe For
            </el-button>
          </el-form>

          <button @click="handleClose" class="no-thanks-button">No, Thanks</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 15. 从 'vue' 中导入核心功能：ref用于创建响应式变量，computed是计算属性
import { ref, computed } from 'vue';
// 16. 从 Pinia store 中导入用于管理UI状态的模块
import { useUiStore } from '@/store/modules/ui';
// 17. 从 Element Plus 导入消息提示组件
import { ElMessage } from 'element-plus';
// 18. 从我们的API客户端导入订阅邮件的函数
import { subscribeEmail } from '@/services/apiClient';

// 19. 获取UI store的实例
const uiStore = useUiStore();
// 20. 创建一个名为 'email' 的响应式变量，用于双向绑定输入框的值
const email = ref('');
// 21. 创建加载状态，防止用户重复提交表单
const isLoading = ref(false);
// 22. 创建用于存放内联错误信息的状态
const emailError = ref('');

// 23. 创建一个计算属性，用于同步弹窗的可见状态和store中的状态
const isModalVisible = computed({
  // a. get函数：当组件需要读取弹窗是否可见时，会从store中获取状态
  get: () => uiStore.isSubscriptionModalVisible,
  // b. set函数：当弹窗关闭时（v-model变化），会调用store中的方法来更新状态
  set: (value) => uiStore.setSubscriptionModalVisible(value),
});

// 24. 当用户重新输入时，清空错误提示的函数
const clearError = () => {
  emailError.value = '';
};

// 25. 处理表单提交的异步函数
const handleSubscription = async () => {
  // 26. 如果正在提交，则阻止新的提交
  if (isLoading.value) return;
  // 27. 每次提交前先清空旧的错误
  clearError();

  // 28. 前端进行一次基本格式校验
  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    // 29. 如果格式不正确，设置错误信息并终止函数
    emailError.value = 'Please enter a valid email address.';
    return;
  }
  
  // 30. 开始提交，设置加载状态为 true
  isLoading.value = true;
  try {
    // 31. 调用API函数，并等待返回结果
    const response = await subscribeEmail(email.value);

    // 32. 如果API返回成功
    if (response.success) {
      // 33. 显示成功的全局消息提示
      ElMessage.success('Subscription successful! Thank you.');
      // 34. 关闭弹窗
      handleClose();
    } else {
      // 35. 如果API返回失败，则显示指定的错误信息
      emailError.value = 'Email address must contain @ and a valid domain name';
    }
  } catch (error) {
    // 36. 如果API请求本身出错（如网络问题），则显示通用错误信息
    emailError.value = 'An unexpected error occurred. Please try again.';
  } finally {
    // 37. 无论成功失败，最终都结束加载状态
    isLoading.value = false;
  }
};

// 38. 关闭弹窗的函数
const handleClose = () => {
  // 39. 调用store的方法来隐藏弹窗
  uiStore.setSubscriptionModalVisible(false);
};

// 40. 弹窗完全关闭后的回调函数
const onModalClose = () => {
  // 41. 在 sessionStorage 中设置一个标记，防止在当前浏览器会话中重复弹出
  sessionStorage.setItem('subscriptionModalClosed', 'true');
};
</script>

<style scoped lang="scss">
/* 42. 弹窗内容的根容器，使用flex布局实现左右分栏 */
.modal-content-wrapper {
  display: flex;
  flex-wrap: wrap; /* 在小屏幕上允许换行 */
  border-radius: 8px; /* 将圆角应用在内容外层 */
  overflow: hidden; /* 裁剪内容以匹配圆角 */
}

/* 43. 左侧图片区域的样式 */
.image-section {
  flex: 0 0 50%; /* 设置基础宽度为50%，且不伸缩 */
  width: 50%;
  background-color: #000;
  .modal-image {
    width: 100%;
    height: 100%;
    object-fit: contain; 
    display: block; /* 移除图片下方的空隙 */
  }
}

/* 44. 右侧表单区域的样式 */
.form-section {
  flex: 0 0 50%;
  width: 50%;
  padding: clamp(50px, 5vw, 60px); /* 响应式内边距 */
  display: flex;
  flex-direction: column; /* 子项垂直排列 */
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
  text-align: center; /* 文本居中 */
  background-color: #fff;
  box-sizing: border-box; /* 让padding不影响总宽度 */
}

/* 45. 表单头部的样式 */
.form-header {
  width: 100%;
  max-width: 360px; /* 限制内容最大宽度，使其在居中时更美观 */
  h2 {
    font-size: clamp(2rem, 5vw, 2.5rem);
    font-weight: 700;
    line-height: 1.25;
    color: #1a1a1a;
    margin: 0 0 16px 0;
    word-break: break-word; /* 允许单词内换行 */

    /* 高亮文本的样式（例如“20% OFF”） */
    .highlight-text {
      color: #E53935;
    }
  }
  p {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    color: #555;
    margin: 0 0 40px 0;
    font-weight: 600;
  }
}

/* 46. 表单容器样式 */
.subscription-form {
  width: 100%;
  max-width: 360px;
}

/* 47. Email标签被移除了，这个样式当前未使用，可以保留或删除 */
/*
.email-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}
*/

/* 48. 错误提示文字的样式 */
.input-error-message {
  color: #E53935;
  font-size: 0.9rem;
  margin-top: 8px;
  text-align: center;
}

/* 49. 当输入框有错误时 (.is-invalid 类被添加时) 的样式 */
.subscription-form :deep(.el-input.is-invalid .el-input__wrapper) {
  border: 2px solid #E53935 !important;
  box-shadow: none !important;
}

/* 50. 订阅按钮样式 */
.subscribe-button {
  width: 100%;
  margin-top: 35px;
  height: 40px;
  font-size: 1rem;
  font-weight: 550;
  border-radius: 16px !important;
  background-color: #00FA9A !important;
  border-color: #f0e6d6 !important;
  color: #1a1a1a !important;

  &:hover {
    background-color: #98FB98 !important;
    border-color: #e6d8c0 !important;
  }
}

/* 51. "No, Thanks" 按钮样式 */
.no-thanks-button {
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  font-size: 1rem;
  padding: 8px;
  margin-top: 28px;
  font-weight: 600;

  &:hover {
    color: #333;
    text-decoration: underline;
  }
}

/* 52. 响应式设计：当屏幕宽度小于等于768px时应用 */
@media (max-width: 768px) {
  .image-section,
  .form-section {
    flex: 1 1 100%; /* 变为堆叠布局，各自占100%宽度 */
    width: 100%;
  }

  .image-section {
    height: 250px;
    order: 1; /* 图片在上方 */
  }
  .form-section {
    order: 2; /* 表单在下方 */
  }
}

</style>

<style lang="scss">
/* 我们使用ID选择器，确保最高优先级 */
#subscription-modal-container .el-dialog {
  /* 让弹窗外框成为定位基准 */
  position: relative !important;
  /* 移除背景和阴影，让我们的内容来填充 */
  background: transparent !important;
  box-shadow: none !important;

  /* 关键1：让标题栏“隐形”而不是“消失” */
  .el-dialog__header {
    padding: 0 !important;
    margin: 0 !important;
    height: 0 !important; /* 高度为0，不占据空间 */
    /* 不要使用 display: none !important; */
  }

  /* 关键2：将关闭按钮定位到弹窗右上角 */
  .el-dialog__headerbtn {
    position: absolute !important;
    top: 15px !important;
    right: 15px !important;
    z-index: 1000 !important; /* 确保它在最上层 */

    /* (可选) 自定义图标大小和颜色 */
    .el-icon {
      font-size: 20px;
      color: #909399; /* 您可以自定义关闭按钮的颜色 */
    }
    &:hover .el-icon {
      color: #333;
    }
  }
  
  .el-dialog__body {
    padding: 0 !important;
  }
}
</style>
