/**
 * 用户服务层
 * 封装 API 调用并使用 orika-js 进行数据映射
 * 
 * 注意：本服务层保留用于演示，但在 Vue3 应用中
 * 我们直接在 Composables 中使用 @orika-js/vue3 进行映射
 */
import { MapperFactory } from '@orika-js/core';
import { mockApi } from './mockApi';
import { User, UserVO, UserListItemVO, CreateUserRequest } from '../models/User';

const factory = MapperFactory.getInstance();

export const userService = {
  /**
   * 获取用户列表（映射为 VO）
   */
  async getUserList(): Promise<UserListItemVO[]> {
    const users = await mockApi.getAllUsers();
    return factory.mapArray(users, User, UserListItemVO);
  },

  /**
   * 获取用户详情（映射为 VO）
   */
  async getUserDetail(id: number): Promise<UserVO | null> {
    const user = await mockApi.getUserById(id);
    if (!user) return null;
    return factory.map(user, User, UserVO);
  },

  /**
   * 创建用户
   */
  async createUser(request: CreateUserRequest): Promise<UserVO> {
    // 将请求映射为 User 实体
    const user = factory.map(request, CreateUserRequest, User);
    
    // 调用 API 创建用户
    const createdUser = await mockApi.createUser(request);
    
    // 将返回的实体映射为 VO
    return factory.map(createdUser, User, UserVO);
  },

  /**
   * 切换用户状态
   */
  async toggleUserStatus(id: number): Promise<UserVO | null> {
    const user = await mockApi.toggleUserStatus(id);
    if (!user) return null;
    return factory.map(user, User, UserVO);
  },

  /**
   * 删除用户
   */
  async deleteUser(id: number): Promise<boolean> {
    return await mockApi.deleteUser(id);
  },

  /**
   * 搜索用户
   */
  async searchUsers(keyword: string): Promise<UserListItemVO[]> {
    const users = await mockApi.searchUsers(keyword);
    return factory.mapArray(users, User, UserListItemVO);
  }
};

