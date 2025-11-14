<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="show" :class="['toast', `toast-${type}`]">
        <span class="toast-icon">{{ icon }}</span>
        <span class="toast-message">{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000
});

const show = ref(false);

const icons = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ'
};

const icon = icons[props.type];

watch(() => props.message, (newMessage) => {
  if (newMessage) {
    show.value = true;
    setTimeout(() => {
      show.value = false;
    }, props.duration);
  }
}, { immediate: true });
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  z-index: 9999;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.toast-icon {
  font-size: 16px;
}

.toast-message {
  color: #c9d1d9;
}

.toast-success {
  border-color: #238636;
}

.toast-success .toast-icon {
  color: #3fb950;
}

.toast-error {
  border-color: #da3633;
}

.toast-error .toast-icon {
  color: #f85149;
}

.toast-warning {
  border-color: #9e6a03;
}

.toast-warning .toast-icon {
  color: #d29922;
}

.toast-info {
  border-color: #1f6feb;
}

.toast-info .toast-icon {
  color: #58a6ff;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>

