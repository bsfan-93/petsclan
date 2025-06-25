<template>
  <el-dialog
    v-model="isModalVisible"
    :title="t('subscriptionModal.title')"
    width="clamp(300px, 80vw, 850px)"
    custom-class="subscription-dialog"
    :show-close="true"
    center
    align-center
  >
    <div class="modal-content-wrapper">
      <div class="image-section">
        <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1962&auto=format&fit=crop" alt="Happy Dog" class="modal-image">
      </div>
      <div class="form-section">
        <div class="form-header">
          <h2>{{ t('subscriptionModal.headline') }}</h2>
          <p>{{ t('subscriptionModal.subheadline') }}</p>
        </div>
        <el-form @submit.prevent="handleSubscription" class="subscription-form">
          <el-input
            v-model="email"
            :placeholder="t('subscriptionModal.emailPlaceholder')"
            type="email"
            size="large"
            required
          >
            <template #append>
              <el-button type="primary" native-type="submit" class="subscribe-button">{{ t('subscriptionModal.subscribeButton') }}</el-button>
            </template>
          </el-input>
        </el-form>
        <button @click="handleClose" class="no-thanks-button">{{ t('subscriptionModal.noThanks') }}</button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '@/store/modules/ui';
import { ElMessage } from 'element-plus';

const { t } = useI18n();
const uiStore = useUiStore();
const email = ref('');

// 使用 computed 属性与 Pinia store 进行双向绑定
const isModalVisible = computed({
  get: () => uiStore.isSubscriptionModalVisible,
  set: (value) => {
    if (!value) {
      uiStore.hideSubscriptionModal();
    }
  }
});

const handleSubscription = () => {
  if (email.value && /\S+@\S+\.\S+/.test(email.value)) {
    console.log('Subscribed with email:', email.value);
    ElMessage.success(t('subscriptionModal.subscribeSuccess'));
    uiStore.hideSubscriptionModal();
  } else {
    ElMessage.error(t('subscriptionModal.invalidEmail'));
  }
};

const handleClose = () => {
  uiStore.hideSubscriptionModal();
};
</script>

<style lang="scss">
.subscription-dialog {
  border-radius: 20px !important;
  overflow: hidden;

  .el-dialog__header {
    display: none; // We hide the default title bar
  }

  .el-dialog__body {
    padding: 0 !important;
  }
}

.modal-content-wrapper {
  display: flex;
  flex-wrap: wrap; // Allow wrapping on small screens
}

.image-section {
  flex: 1;
  min-width: 300px;
  background-color: #333;

  .modal-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.form-section {
  flex: 1;
  min-width: 300px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.form-header {
  margin-bottom: 24px;
  h2 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0 0 8px 0;
    color: #1a1a1a;
  }
  p {
    font-size: 1rem;
    color: #666;
    margin: 0;
  }
}

.subscription-form {
  width: 100%;
  max-width: 400px;
  margin-bottom: 16px;
}

.subscribe-button {
  background-color: #E6A23C !important;
  border-color: #E6A23C !important;
  color: #fff;
  &:hover {
    background-color: #d8932c !important;
    border-color: #d8932c !important;
  }
}

.no-thanks-button {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 8px;
  &:hover {
    color: #333;
    text-decoration: underline;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .image-section {
    height: 250px; // Fixed height for the image on mobile
  }
  .form-section {
    padding: 24px;
  }
  .form-header h2 {
    font-size: 1.5rem;
  }
}
</style>