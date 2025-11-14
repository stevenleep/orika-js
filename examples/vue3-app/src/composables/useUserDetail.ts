/**
 * 用户详情 Composable
 * 使用 @orika-js/vue3 的响应式映射功能
 */
import { ref } from 'vue';
import { User, UserVO } from '../models/User';
import { mockApi } from '../services/mockApi';
import { useAsyncMapper, mapToReactive } from '@orika-js/vue3';

export function useUserDetail() {
  // 使用 @orika-js/vue3 的 useAsyncMapper
  const { mapAsync, isLoading, error } = useAsyncMapper(User, UserVO);
  
  const userDetail = ref<UserVO | null>(null);
  const rawUser = ref<User | null>(null);
  const currentUserId = ref<number | null>(null);

  // 加载用户详情 - 使用 @orika-js/vue3 的 mapAsync
  async function loadUserDetail(userId: number | null) {
    currentUserId.value = userId;
    
    if (!userId) {
      userDetail.value = null;
      rawUser.value = null;
      return;
    }

    try {
      // 1. 从 API 获取原始 User 数据
      const user = await mockApi.getUserById(userId);
      
      if (!user) {
        userDetail.value = null;
        rawUser.value = null;
        return;
      }
      
      rawUser.value = user;
      
      // 2. 使用 @orika-js/vue3 的 mapAsync 进行映射
      // 这会自动设置 isLoading 和 error 状态
      userDetail.value = await mapAsync(user);
    } catch (err) {
      console.error('❌ 加载用户详情失败:', err);
      throw err;
    }
  }

  return {
    userDetail,
    rawUser,
    currentUserId,
    isLoading,
    error,
    loadUserDetail
  };
}

