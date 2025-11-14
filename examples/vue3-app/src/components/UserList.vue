<template>
  <div class="user-list">
    <div class="section-header">
      <div class="header-left">
        <span class="section-title">Users</span>
        <span class="count">{{ filteredAndSortedUsers.length }}</span>
      </div>
      <div class="header-actions">
        <select v-model="filterStatus" class="filter-select">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input 
          v-model="searchKeyword" 
          @input="handleSearch"
          type="text" 
          placeholder="Search users..." 
          class="search-input"
        />
        <button @click="showCreateModal = true" class="btn-create">
          + New User
        </button>
        <button @click="loadUsers" :disabled="isLoading" class="btn-reload" title="Refresh">
          {{ isLoading ? '⟳' : '↻' }}
        </button>
      </div>
    </div>

    <div v-if="error" class="status-message error">
      <span class="icon">✗</span> {{ error.message || 'Failed to load users' }}
    </div>

    <div v-else-if="isLoading && users.length === 0" class="status-message loading">
      <span class="icon">⟳</span> Loading users...
    </div>

    <div v-else-if="filteredAndSortedUsers.length === 0" class="status-message empty">
      <span class="icon">○</span> 
      {{ searchKeyword ? 'No users match your search' : 'No users found' }}
    </div>

    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-id" @click="toggleSort('id')">
              ID {{ getSortIcon('id') }}
            </th>
            <th class="col-name" @click="toggleSort('displayName')">
              Name {{ getSortIcon('displayName') }}
            </th>
            <th class="col-email" @click="toggleSort('email')">
              Email {{ getSortIcon('email') }}
            </th>
            <th class="col-role">Role</th>
            <th class="col-status">Status</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="user in filteredAndSortedUsers" 
            :key="user.id"
            :class="{ 'row-selected': selectedUserId === user.id }"
            @click="$emit('select-user', user.id)"
          >
            <td class="col-id">
              <span class="mono">#{{ user.id }}</span>
            </td>
            <td class="col-name">
              <div class="user-name-cell">
                <img :src="user.avatar" :alt="user.displayName" class="avatar-small" />
                <span>{{ user.displayName }}</span>
              </div>
            </td>
            <td class="col-email">
              <span class="text-muted">{{ user.email }}</span>
            </td>
            <td class="col-role">
              <span class="badge">{{ user.roleName }}</span>
            </td>
            <td class="col-status">
              <span :class="['status-indicator', user.status.includes('活跃') ? 'status-active' : 'status-inactive']">
                {{ user.status }}
              </span>
            </td>
            <td class="col-actions">
              <button 
                @click.stop="handleToggleStatus(user.id)" 
                class="btn-icon"
                :title="user.status.includes('活跃') ? 'Deactivate' : 'Activate'"
              >
                {{ user.status.includes('活跃') ? '○' : '●' }}
              </button>
              <button 
                @click.stop="handleDelete(user.id)" 
                class="btn-icon btn-danger"
                title="Delete"
              >
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer-stats">
      <span class="stat">{{ filteredAndSortedUsers.length }} users</span>
      <span class="stat-separator">|</span>
      <span class="stat stat-active">
        {{ filteredAndSortedUsers.filter(u => u.status.includes('活跃')).length }} active
      </span>
      <span class="stat-separator">|</span>
      <span class="stat stat-inactive">
        {{ filteredAndSortedUsers.filter(u => !u.status.includes('活跃')).length }} inactive
      </span>
    </div>

    <!-- Create User Modal -->
    <Modal :show="showCreateModal" title="Create New User" @close="showCreateModal = false">
      <UserForm @submit="handleCreateUser" @cancel="showCreateModal = false" />
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal 
      :show="showDeleteModal" 
      title="Confirm Delete" 
      @close="showDeleteModal = false"
      :close-on-overlay="false"
    >
      <p style="color: #c9d1d9; margin-bottom: 20px;">
        Are you sure you want to delete this user? This action cannot be undone.
      </p>
      <template #footer>
        <button @click="showDeleteModal = false" class="btn btn-secondary">
          Cancel
        </button>
        <button @click="confirmDelete" class="btn btn-danger">
          Delete
        </button>
      </template>
    </Modal>

    <!-- Toast Notifications -->
    <Toast v-if="toastMessage" :message="toastMessage" :type="toastType" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserList } from '../composables/useUserList';
import type { CreateUserRequest } from '../models/User';
import Modal from './Modal.vue';
import Toast from './Toast.vue';
import UserForm from './UserForm.vue';
import { userService } from '../services/userService';

defineEmits<{
  'select-user': [userId: number]
}>();

const {
  users,
  searchKeyword,
  selectedUserId,
  isLoading,
  error,
  loadUsers,
  toggleStatus,
  deleteUser
} = useUserList();

// Filter and Sort
const filterStatus = ref<'all' | 'active' | 'inactive'>('all');
const sortField = ref<'id' | 'displayName' | 'email'>('id');
const sortOrder = ref<'asc' | 'desc'>('asc');

const filteredAndSortedUsers = computed(() => {
  let result = [...users.value];
  
  // Filter by status
  if (filterStatus.value !== 'all') {
    result = result.filter(user => {
      const isActive = user.status.includes('活跃');
      return filterStatus.value === 'active' ? isActive : !isActive;
    });
  }
  
  // Filter by search
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(user =>
      user.displayName.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  }
  
  // Sort
  result.sort((a, b) => {
    const aVal = a[sortField.value];
    const bVal = b[sortField.value];
    const order = sortOrder.value === 'asc' ? 1 : -1;
    return aVal > bVal ? order : -order;
  });
  
  return result;
});

function toggleSort(field: 'id' | 'displayName' | 'email') {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
}

function getSortIcon(field: string) {
  if (sortField.value !== field) return '';
  return sortOrder.value === 'asc' ? '↑' : '↓';
}

// Modals
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const deleteUserId = ref<number | null>(null);

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

async function handleCreateUser(data: CreateUserRequest) {
  try {
    await userService.createUser(data);
    showCreateModal.value = false;
    await loadUsers();
    showToast('User created successfully', 'success');
  } catch (err) {
    showToast('Failed to create user', 'error');
  }
}

function handleDelete(userId: number) {
  deleteUserId.value = userId;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (deleteUserId.value === null) return;
  
  try {
    await deleteUser(deleteUserId.value);
    showDeleteModal.value = false;
    deleteUserId.value = null;
    showToast('User deleted successfully', 'success');
  } catch (err) {
    showToast('Failed to delete user', 'error');
  }
}

async function handleToggleStatus(userId: number) {
  try {
    await toggleStatus(userId);
    showToast('User status updated', 'success');
  } catch (err) {
    showToast('Failed to update status', 'error');
  }
}

function handleSearch() {
  // Debounce search if needed
}

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.user-list {
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
  gap: 16px;
  flex-wrap: wrap;
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

.count {
  color: #8b949e;
  font-size: 12px;
  padding: 2px 8px;
  background: #21262d;
  border-radius: 10px;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 6px 10px;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 4px;
  color: #c9d1d9;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  outline: none;
}

.filter-select:focus {
  border-color: #58a6ff;
}

.search-input {
  padding: 6px 12px;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 4px;
  color: #c9d1d9;
  font-family: inherit;
  font-size: 12px;
  width: 200px;
  outline: none;
}

.search-input:focus {
  border-color: #58a6ff;
  box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.1);
}

.search-input::placeholder {
  color: #6e7681;
}

.btn-create {
  padding: 6px 14px;
  background: #238636;
  border: 1px solid #238636;
  border-radius: 4px;
  color: white;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.btn-create:hover {
  background: #2ea043;
}

.btn-reload {
  padding: 6px 12px;
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 4px;
  color: #c9d1d9;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  min-width: 36px;
}

.btn-reload:hover {
  background: #30363d;
  border-color: #58a6ff;
}

.btn-reload:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-message {
  padding: 40px 20px;
  text-align: center;
  color: #8b949e;
  font-size: 14px;
}

.status-message .icon {
  margin-right: 8px;
  font-size: 16px;
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

.table-container {
  flex: 1;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table thead {
  position: sticky;
  top: 0;
  background: #161b22;
  z-index: 10;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #8b949e;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #30363d;
  cursor: pointer;
  user-select: none;
}

.data-table th:hover {
  color: #c9d1d9;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #21262d;
}

.data-table tbody tr {
  cursor: pointer;
  transition: background-color 0.15s;
}

.data-table tbody tr:hover {
  background: #161b22;
}

.data-table tbody tr.row-selected {
  background: #1c2128;
  border-left: 2px solid #58a6ff;
}

.col-id {
  width: 80px;
}

.col-name {
  min-width: 200px;
}

.col-email {
  min-width: 220px;
}

.col-role {
  width: 120px;
}

.col-status {
  width: 120px;
}

.col-actions {
  width: 100px;
  text-align: right;
}

.mono {
  font-family: 'Monaco', 'Menlo', monospace;
  color: #8b949e;
}

.user-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #30363d;
}

.text-muted {
  color: #8b949e;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 12px;
  font-size: 11px;
  color: #58a6ff;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
}

.status-indicator::before {
  content: '●';
  font-size: 8px;
}

.status-active {
  color: #3fb950;
}

.status-active::before {
  color: #3fb950;
}

.status-inactive {
  color: #f85149;
}

.status-inactive::before {
  color: #f85149;
}

.btn-icon {
  padding: 4px 8px;
  background: transparent;
  border: 1px solid #30363d;
  border-radius: 3px;
  color: #8b949e;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  margin-left: 4px;
}

.btn-icon:hover {
  background: #21262d;
  border-color: #58a6ff;
  color: #58a6ff;
}

.btn-icon.btn-danger:hover {
  border-color: #f85149;
  color: #f85149;
}

.footer-stats {
  padding: 12px 20px;
  border-top: 1px solid #30363d;
  background: #161b22;
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #8b949e;
}

.stat-separator {
  color: #30363d;
}

.stat-active {
  color: #3fb950;
}

.stat-inactive {
  color: #f85149;
}

/* Modal Buttons */
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

.btn-danger {
  background: #da3633;
  border: 1px solid #da3633;
  color: white;
}

.btn-danger:hover {
  background: #f85149;
  border-color: #f85149;
}
</style>
