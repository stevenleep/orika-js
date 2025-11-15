<template>
  <div class="app">
    <header>
      <h1>🍍 Pinia + orika-js Example</h1>
      <p class="subtitle">Object mapping in Pinia stores</p>
    </header>

    <main>
      <div class="controls">
        <button @click="loadUsers" :disabled="loading" class="btn btn-primary">
          {{ loading ? '⏳ Loading...' : '📥 Load Users' }}
        </button>
        
        <button @click="addDemoUser" :disabled="loading" class="btn btn-secondary">
          ➕ Add Demo User
        </button>
        
        <button @click="clearAllUsers" :disabled="loading" class="btn btn-danger">
          🗑️ Clear All
        </button>
      </div>

      <div v-if="error" class="error">
        ❌ Error: {{ error }}
      </div>

      <div class="stats">
        <div class="stat-card">
          <div class="stat-value">{{ userStore.userCount }}</div>
          <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ userStore.activeUsers.length }}</div>
          <div class="stat-label">Active</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ userStore.inactiveUsers.length }}</div>
          <div class="stat-label">Inactive</div>
        </div>
      </div>

      <div v-if="users.length > 0" class="user-list">
        <h2>Users</h2>
        <div v-for="user in users" :key="user.id" class="user-card">
          <div class="user-info">
            <div class="user-header">
              <h3>{{ user.displayName }}</h3>
              <span v-if="user.isNew" class="badge badge-new">New</span>
              <span 
                :class="['badge', user.isActive ? 'badge-active' : 'badge-inactive']"
              >
                {{ user.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <p class="user-meta">
              ID: {{ user.id }} | Created: {{ formatDate(user.createdAt) }}
            </p>
          </div>
          <div class="user-actions">
            <button 
              @click="toggleActive(user.id)" 
              class="btn btn-sm"
              :disabled="loading"
            >
              {{ user.isActive ? '🔴 Deactivate' : '✅ Activate' }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>No users loaded. Click "Load Users" to fetch data from the API.</p>
      </div>

      <div class="info-box">
        <h3>💡 What's Happening?</h3>
        <ol>
          <li>Click "Load Users" to fetch data from mock API</li>
          <li>API returns data in <code>snake_case</code> (UserDTO)</li>
          <li>Store uses <code>this.$mapper</code> to transform to <code>camelCase</code> (User)</li>
          <li>Domain models include computed properties like <code>displayName</code></li>
          <li>All mapping happens automatically in the Pinia store!</li>
        </ol>
        <p class="note">
          📝 Check the browser console to see detailed mapping logs
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from './stores/userStore';

const userStore = useUserStore();

const users = computed(() => userStore.users);
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

const loadUsers = () => {
  userStore.fetchUsers();
};

const addDemoUser = async () => {
  const timestamp = Date.now();
  await userStore.createUser(
    `user_${timestamp}`,
    `user${timestamp}@example.com`
  );
};

const clearAllUsers = () => {
  userStore.clearUsers();
};

const toggleActive = (userId: number) => {
  userStore.toggleUserActive(userId);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  font-size: 2.5rem;
  margin: 0;
  color: #2c3e50;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.btn-secondary {
  background: #2ecc71;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #27ae60;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c0392b;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.error {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #c33;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  opacity: 0.9;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.user-list h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.user-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.2s;
}

.user-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.user-info {
  flex: 1;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.user-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-new {
  background: #f39c12;
  color: white;
}

.badge-active {
  background: #2ecc71;
  color: white;
}

.badge-inactive {
  background: #95a5a6;
  color: white;
}

.user-meta {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 2rem 0;
}

.info-box {
  background: #f8f9fa;
  border-left: 4px solid #3498db;
  padding: 1.5rem;
  border-radius: 4px;
  margin-top: 2rem;
}

.info-box h3 {
  margin-top: 0;
  color: #2c3e50;
}

.info-box ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.info-box li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.info-box code {
  background: #e8e8e8;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.note {
  margin-top: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}
</style>

