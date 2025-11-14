<template>
  <div id="app">
    <header class="terminal-header">
      <div class="terminal-title">
        <span class="prompt">orika-js</span>
        <span class="separator">/</span>
        <span class="page">user-management</span>
      </div>
      <div class="status-bar">
        <span class="status-item active">● Live</span>
      </div>
    </header>

    <div class="app-container">
      <aside class="panel left-panel">
        <UserList 
          :key="refreshTrigger"
          @select-user="handleSelectUser" 
        />
      </aside>

      <main class="panel right-panel">
        <UserDetail 
          :user-id="selectedUserId"
          @close="selectedUserId = null"
          @refresh="handleRefreshList"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserList from './components/UserList.vue';
import UserDetail from './components/UserDetail.vue';

const selectedUserId = ref<number | null>(null);
const refreshTrigger = ref(0);

function handleSelectUser(userId: number) {
  selectedUserId.value = userId;
}

function handleRefreshList() {
  selectedUserId.value = null;
  refreshTrigger.value++;
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Consolas', 'Courier New', monospace;
  background: #0d1117;
  color: #c9d1d9;
  font-size: 14px;
  line-height: 1.5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.terminal-header {
  background: #161b22;
  border-bottom: 1px solid #30363d;
  padding: 16px 20px;
}

.terminal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.prompt {
  color: #c9d1d9;
  font-weight: bold;
}

.separator {
  color: #30363d;
  margin: 0 8px;
}

.page {
  color: #8b949e;
}

.status-bar {
  display: flex;
  gap: 16px;
  font-size: 12px;
}

.status-item {
  padding: 2px 8px;
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 3px;
  color: #8b949e;
}

.status-item.active {
  border-color: #238636;
  color: #3fb950;
}

.app-container {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: #30363d;
  margin: 1px;
}

.panel {
  background: #0d1117;
  overflow: auto;
}

.left-panel,
.right-panel {
  height: calc(100vh - 80px);
}

@media (max-width: 1024px) {
  .app-container {
    grid-template-columns: 1fr;
  }
  
  .left-panel,
  .right-panel {
    height: auto;
    min-height: 400px;
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #161b22;
}

::-webkit-scrollbar-thumb {
  background: #30363d;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #484f58;
}
</style>

