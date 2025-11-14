/**
 * 用户列表 Composable
 * 使用 @orika-js/vue3 的响应式映射功能
 */
import { ref, computed } from 'vue';
import { useAsyncMapper } from '@orika-js/vue3';
import { User, UserListItemVO } from '../models/User';
import { mockApi } from '../services/mockApi';
import { userService } from '../services/userService';

export function useUserList() {
  // 使用 @orika-js/vue3 的 useAsyncMapper
  // 这会自动管理 isLoading 和 error 状态
  const { mapArrayAsync, isLoading, error } = useAsyncMapper(User, UserListItemVO);
  
  const users = ref<UserListItemVO[]>([]);
  const rawUsers = ref<User[]>([]);
  const searchKeyword = ref('');
  const selectedUserId = ref<number | null>(null);

  // 过滤后的用户列表
  const filteredUsers = computed(() => {
    if (!searchKeyword.value) return users.value;
    
    const keyword = searchKeyword.value.toLowerCase();
    return users.value.filter(user => 
      user.displayName.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  });

  // 加载用户列表 - 使用 @orika-js/vue3 的 mapArrayAsync
  async function loadUsers() {
    try {
      // 1. 从 API 获取原始 User 数据
      rawUsers.value = await mockApi.getAllUsers();
      
      // 2. 使用 @orika-js/vue3 的 mapArrayAsync 进行批量映射
      // 这会自动设置 isLoading 状态
      users.value = await mapArrayAsync(rawUsers.value);
    } catch (err) {
      console.error('❌ 加载用户列表失败:', err);
      throw err;
    }
  }

  // 搜索用户 - 使用 @orika-js/vue3 映射
  async function searchUsers() {
    if (!searchKeyword.value.trim()) {
      await loadUsers();
      return;
    }
    
    try {
      // 1. 搜索原始数据
      const searchResults = await mockApi.searchUsers(searchKeyword.value);
      
      // 2. 使用 @orika-js/vue3 映射结果
      users.value = await mapArrayAsync(searchResults);
    } catch (err) {
      console.error('❌ 搜索用户失败:', err);
    }
  }

  // 切换用户状态
  async function toggleStatus(userId: number) {
    try {
      await userService.toggleUserStatus(userId);
      await loadUsers(); // 重新加载并映射
    } catch (err) {
      console.error('切换用户状态失败:', err);
      throw err;
    }
  }

  // 删除用户
  async function deleteUser(userId: number) {
    try {
      const success = await userService.deleteUser(userId);
      if (success) {
        await loadUsers(); // 重新加载并映射
      }
      return success;
    } catch (err) {
      console.error('删除用户失败:', err);
      throw err;
    }
  }

  return {
    users,
    rawUsers,
    filteredUsers,
    searchKeyword,
    selectedUserId,
    isLoading,
    error,
    loadUsers,
    searchUsers,
    toggleStatus,
    deleteUser
  };
}

