<template>
  <form @submit.prevent="handleSubmit" class="user-form">
    <div class="form-group">
      <label class="form-label">Username *</label>
      <input 
        v-model="formData.username" 
        type="text" 
        class="form-input"
        placeholder="Enter username"
        required
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">First Name *</label>
        <input 
          v-model="formData.firstName" 
          type="text" 
          class="form-input"
          placeholder="First name"
          required
        />
      </div>
      <div class="form-group">
        <label class="form-label">Last Name *</label>
        <input 
          v-model="formData.lastName" 
          type="text" 
          class="form-input"
          placeholder="Last name"
          required
        />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Email *</label>
      <input 
        v-model="formData.email" 
        type="email" 
        class="form-input"
        placeholder="user@example.com"
        required
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Age *</label>
        <input 
          v-model.number="formData.age" 
          type="number" 
          class="form-input"
          placeholder="18"
          min="18"
          max="120"
          required
        />
      </div>
      <div class="form-group">
        <label class="form-label">Phone</label>
        <input 
          v-model="formData.phoneNumber" 
          type="tel" 
          class="form-input"
          placeholder="13800138000"
        />
      </div>
    </div>

    <div class="form-group" v-if="!isEdit">
      <label class="form-label">Password *</label>
      <input 
        v-model="formData.password" 
        type="password" 
        class="form-input"
        placeholder="Enter password"
        minlength="6"
        required
      />
    </div>

    <div class="form-actions">
      <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { CreateUserRequest } from '../models/User';

interface Props {
  isEdit?: boolean;
  initialData?: Partial<CreateUserRequest>;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
});

const emit = defineEmits<{
  submit: [data: CreateUserRequest];
  cancel: [];
}>();

const isSubmitting = ref(false);

const formData = reactive<CreateUserRequest>({
  username: props.initialData?.username || '',
  email: props.initialData?.email || '',
  password: '',
  firstName: props.initialData?.firstName || '',
  lastName: props.initialData?.lastName || '',
  age: props.initialData?.age || 18,
  phoneNumber: props.initialData?.phoneNumber || ''
});

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    emit('submit', { ...formData });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.user-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  color: #8b949e;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  padding: 8px 12px;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 4px;
  color: #c9d1d9;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #58a6ff;
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
}

.form-input::placeholder {
  color: #6e7681;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #30363d;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #30363d;
  color: #c9d1d9;
}

.btn-secondary:hover {
  background: #21262d;
  border-color: #58a6ff;
}

.btn-primary {
  background: #238636;
  border: 1px solid #238636;
  color: white;
}

.btn-primary:hover {
  background: #2ea043;
  border-color: #2ea043;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

