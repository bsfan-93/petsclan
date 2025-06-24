<template>
  <el-dialog
    v-model="isDialogVisible"
    :show-close="false"
    width="700px"
    custom-class="subscription-dialog"
    @closed="$emit('closed')"
  >
    <div class="popup-container">
      <div class="image-section">
        <img src="@/assets/images/popover.png" alt="Dog" class="popup-image" />
        <div class="image-overlay-text">
          Pets Clan
        </div>
      </div>
      <div class="form-section">
        <el-button @click="closeDialog" class="close-button" :icon="Close" circle text></el-button>
        <h2>Unlock <span class="highlight">20% OFF</span></h2>
        <p class="subtitle">Your order Today</p>
        <p class="description">Make it more convenient for pets</p>

        <el-form class="subscribe-form">
          <el-form-item>
            <label for="email-input">Email</label>
            <el-input id="email-input" placeholder="Email" v-model="email" size="large"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="subscribe" class="subscribe-button" size="large">Subscribe For</el-button>
          </el-form-item>
        </el-form>

        <button @click="closeDialog" class="no-thanks-button">No, Thanks</button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElDialog, ElButton, ElInput, ElForm, ElFormItem } from 'element-plus';
import { Close } from '@element-plus/icons-vue';

const props = defineProps<{
  visible: boolean
}>();

const emit = defineEmits(['closed']);

const isDialogVisible = ref(props.visible);
const email = ref('');

watch(() => props.visible, (newVal) => {
  isDialogVisible.value = newVal;
});

const closeDialog = () => {
  isDialogVisible.value = false;
};

const subscribe = () => {
  if (email.value) {
    console.log(`Subscribing with email: ${email.value}`);
    // 在这里可以添加您真实的订阅逻辑
    closeDialog();
  }
};
</script>

<style lang="scss">
/* 我们在这里使用全局 style 标签 (没有 scoped), 
  因为 Element Plus 的 el-dialog 组件会被渲染到 body 的直属子节点,
  需要全局样式才能覆盖它。
*/
.subscription-dialog {
  padding: 0 !important;
  border-radius: 20px !important;
  overflow: hidden;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0 !important;
  }
}
</style>

<style scoped lang="scss">
.popup-container {
  display: flex;
}

.image-section {
  width: 45%;
  position: relative;

  .popup-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .image-overlay-text {
    position: absolute;
    bottom: 30px;
    left: 30px;
    font-size: 48px;
    font-weight: bold;
    color: white;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.7);
  }
}

.form-section {
  width: 55%;
  padding: 30px 40px;
  background-color: #fff;
  text-align: center;
  position: relative;

  .close-button {
    position: absolute;
    top: 15px;
    right: 15px;
  }

  h2 {
    font-size: 32px;
    font-weight: 700;
    margin: 20px 0 0 0;

    .highlight {
      color: #e57373; /* 您可以换成自己品牌的主题色 */
    }
  }

  .subtitle {
    font-size: 24px;
    margin: 0 0 20px 0;
    font-weight: 500;
  }

  .description {
    color: #666;
    font-size: 16px;
    margin-bottom: 25px;
  }

  .subscribe-form {
    text-align: left;

    label {
      font-weight: 600;
      margin-bottom: 5px;
      display: block;
    }

    .subscribe-button {
      width: 100%;
      background-color: #f0c14b; /* 根据您的设计图示例颜色 */
      border-color: #f0c14b;
      color: #111;
      font-weight: bold;
    }
  }

  .no-thanks-button {
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    text-decoration: underline;
    margin-top: 15px;
  }
}
</style>