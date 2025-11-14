<template>
  <div class="user-detail">
    <div class="section-header">
      <div class="header-left">
        <span class="section-title">User Detail</span>
        <span v-if="userDetail" class="user-id">#{{ userDetail.id }}</span>
      </div>
      <button @click="$emit('close')" class="btn-close" title="Close">✕</button>
    </div>

    <div v-if="isLoading" class="status-message loading">
      <span class="icon">⟳</span> Loading...
    </div>

    <div v-else-if="error" class="status-message error">
      <span class="icon">✗</span> {{ error.message || 'Failed to load user' }}
    </div>

    <div v-else-if="!userDetail" class="status-message empty">
      <div class="empty-state">
        <div class="empty-icon">👤</div>
        <p class="empty-title">No User Selected</p>
        <p class="empty-desc">Select a user from the list to view details</p>
      </div>
    </div>

    <div v-else class="detail-content">
      <!-- Profile Header -->
      <div class="profile-section">
        <img :src="userDetail.avatar" :alt="userDetail.displayName" class="avatar-large" />
        <div class="profile-info">
          <h2 class="user-name">{{ userDetail.displayName }}</h2>
          <p class="user-email">{{ userDetail.email }}</p>
          <div class="user-meta">
            <span :class="['badge', userDetail.status.includes('活跃') ? 'badge-success' : 'badge-danger']">
              {{ userDetail.status }}
            </span>
            <span class="badge badge-info">{{ userDetail.roleName }}</span>
          </div>
        </div>
      </div>

      <!-- Information Grid -->
      <div class="info-section">
        <h3 class="section-title-small">Basic Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Age</span>
            <span class="value">{{ userDetail.age }} years</span>
          </div>
          <div class="info-item">
            <span class="label">Member Since</span>
            <span class="value">{{ userDetail.memberSince }}</span>
          </div>
          <div class="info-item">
            <span class="label">Last Login</span>
            <span class="value">{{ userDetail.lastLogin }}</span>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="info-section">
        <h3 class="section-title-small">Contact Information</h3>
        <div class="contact-info">
          {{ userDetail.contactInfo }}
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <button @click="handleEdit" class="btn btn-primary">Edit User</button>
        <button @click="handleResetPassword" class="btn btn-secondary">Reset Password</button>
        <button @click="handleDelete" class="btn btn-danger">Delete User</button>
      </div>

      <!-- Developer Info (Hidden by default) -->
      <details class="dev-section">
        <summary class="dev-toggle">Developer Info</summary>
        <div class="dev-content">
          <div class="comparison-grid">
            <div class="comparison-panel">
              <h5 class="panel-title">Raw Data</h5>
              <pre class="json-output">{{ JSON.stringify(rawUser, null, 2) }}</pre>
            </div>
            
            <div class="comparison-panel">
              <h5 class="panel-title">Mapped VO (View Object)</h5>
              <pre class="json-output">{{ JSON.stringify(userDetail, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </details>
    </div>

    <!-- Reset Password Modal -->
    <Modal 
      :show="showResetModal" 
      title="Reset Password" 
      @close="showResetModal = false"
    >
      <p style="color: #c9d1d9; margin-bottom: 20px;">
        Send password reset email to <strong>{{ userDetail?.email }}</strong>?
      </p>
      <template #footer>
        <button @click="showResetModal = false" class="btn btn-secondary">
          Cancel
        </button>
        <button @click="confirmResetPassword" class="btn btn-primary">
          Send Email
        </button>
      </template>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal 
      :show="showDeleteModal" 
      title="Delete User" 
      @close="showDeleteModal = false"
      :close-on-overlay="false"
    >
      <p style="color: #c9d1d9; margin-bottom: 20px;">
        Are you sure you want to delete <strong>{{ userDetail?.displayName }}</strong>?
        <br/>
        This action cannot be undone.
      </p>
      <template #footer>
        <button @click="showDeleteModal = false" class="btn btn-secondary">
          Cancel
        </button>
        <button @click="confirmDelete" class="btn btn-danger">
          Delete User
        </button>
      </template>
    </Modal>

    <!-- Toast Notifications -->
    <Toast v-if="toastMessage" :message="toastMessage" :type="toastType" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUserDetail } from '../composables/useUserDetail';
import Modal from './Modal.vue';
import Toast from './Toast.vue';

const props = defineProps<{
  userId: number | null
}>();

const emit = defineEmits<{
  'close': [];
  'refresh': [];
}>();

const { userDetail, rawUser, currentUserId, isLoading, error, loadUserDetail } = useUserDetail();

// Modals
const showEditModal = ref(false);
const showResetModal = ref(false);
const showDeleteModal = ref(false);

// Toast
const toastMessage = ref('');
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('info');

function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
  toastMessage.value = message;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3000);
}

// Action handlers
function handleEdit() {
  showToast('Edit feature coming soon', 'info');
  // showEditModal.value = true;
}

function handleResetPassword() {
  showResetModal.value = true;
}

function handleDelete() {
  showDeleteModal.value = true;
}

async function confirmResetPassword() {
  showResetModal.value = false;
  showToast('Password reset email sent', 'success');
}

async function confirmDelete() {
  if (!props.userId) return;
  
  try {
    // Call delete API
    const { mockApi } = await import('../services/mockApi');
    await mockApi.deleteUser(props.userId);
    
    showDeleteModal.value = false;
    showToast('User deleted successfully', 'success');
    
    // Close detail panel and refresh list
    emit('close');
    emit('refresh');
  } catch (err) {
    showToast('Failed to delete user', 'error');
  }
}

// 监听 userId 变化
watch(() => props.userId, (newUserId) => {
  loadUserDetail(newUserId);
}, { immediate: true });
</script>

<style scoped>
.user-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #30363d;
  background: #161b22;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title {
  color: #c9d1d9;
  font-weight: bold;
  font-size: 16px;
}

.user-id {
  color: #8b949e;
  font-size: 12px;
  padding: 2px 8px;
  background: #21262d;
  border-radius: 10px;
  font-family: 'Monaco', 'Menlo', monospace;
}

.btn-close {
  padding: 4px 8px;
  background: transparent;
  border: 1px solid #30363d;
  border-radius: 3px;
  color: #8b949e;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #21262d;
  border-color: #f85149;
  color: #f85149;
}

.status-message {
  padding: 60px 20px;
  text-align: center;
  color: #8b949e;
  font-size: 14px;
}

.status-message .icon {
  margin-right: 8px;
  font-size: 18px;
  display: inline-block;
}

.status-message.error {
  color: #f85149;
}

.status-message.loading .icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.3;
}

.empty-title {
  margin: 0;
  color: #c9d1d9;
  font-size: 18px;
  font-weight: 600;
}

.empty-desc {
  margin: 0;
  color: #6e7681;
  font-size: 14px;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-section {
  display: flex;
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 1px solid #21262d;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid #30363d;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-name {
  margin: 0;
  color: #c9d1d9;
  font-size: 20px;
  font-weight: 600;
}

.user-email {
  margin: 0;
  color: #8b949e;
  font-size: 14px;
}

.user-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-success {
  background: rgba(63, 185, 80, 0.15);
  color: #3fb950;
  border: 1px solid rgba(63, 185, 80, 0.3);
}

.badge-danger {
  background: rgba(248, 81, 73, 0.15);
  color: #f85149;
  border: 1px solid rgba(248, 81, 73, 0.3);
}

.badge-info {
  background: rgba(88, 166, 255, 0.15);
  color: #58a6ff;
  border: 1px solid rgba(88, 166, 255, 0.3);
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title-small {
  margin: 0;
  color: #8b949e;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #161b22;
  border: 1px solid #21262d;
  border-radius: 6px;
}

.info-item .label {
  color: #6e7681;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item .value {
  color: #c9d1d9;
  font-size: 14px;
  font-weight: 500;
}

.contact-info {
  padding: 12px;
  background: #161b22;
  border: 1px solid #21262d;
  border-radius: 6px;
  color: #c9d1d9;
  font-size: 13px;
  line-height: 1.6;
}

.actions-section {
  display: flex;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid #21262d;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-primary {
  background: #238636;
  border: 1px solid #238636;
  color: white;
}

.btn-primary:hover {
  background: #2ea043;
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

.btn-danger {
  background: transparent;
  border: 1px solid #30363d;
  color: #f85149;
}

.btn-danger:hover {
  background: rgba(248, 81, 73, 0.1);
  border-color: #f85149;
}

/* Developer Section */
.dev-section {
  margin-top: 12px;
  padding-top: 24px;
  border-top: 2px dashed #21262d;
}

.dev-toggle {
  color: #6e7681;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  user-select: none;
  padding: 8px 0;
}

.dev-toggle:hover {
  color: #8b949e;
}

.dev-content {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dev-note {
  margin: 0;
  padding: 12px;
  background: rgba(88, 166, 255, 0.1);
  border-left: 3px solid #58a6ff;
  border-radius: 4px;
  color: #8b949e;
  font-size: 12px;
}

.dev-note code {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 3px;
  color: #a5d6ff;
}

.mapping-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.mapping-stat {
  padding: 4px 10px;
  background: #161b22;
  border: 1px solid #21262d;
  border-radius: 12px;
  font-size: 11px;
  color: #3fb950;
}

.json-output {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  font-size: 11px;
  line-height: 1.6;
  color: #79c0ff;
  margin: 0;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0;
}

.comparison-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-title {
  margin: 0;
  color: #8b949e;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
