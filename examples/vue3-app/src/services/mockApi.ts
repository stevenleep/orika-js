/**
 * 模拟 API 服务
 * 模拟后端 API 调用，返回真实的数据结构
 */
import { User, CreateUserRequest, UpdateUserRequest } from '../models/User';

// 模拟数据库
let users: User[] = [
  {
    id: 1,
    username: 'zhangsan',
    email: 'zhangsan@example.com',
    password: 'hashed_password',
    firstName: '三',
    lastName: '张',
    age: 28,
    role: 'admin',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-11-01'),
    lastLoginAt: new Date('2024-11-14'),
    avatar: 'https://i.pravatar.cc/150?img=1',
    phoneNumber: '13800138000',
    address: {
      street: '中关村大街1号',
      city: '北京',
      country: '中国',
      zipCode: '100080'
    }
  },
  {
    id: 2,
    username: 'lisi',
    email: 'lisi@example.com',
    password: 'hashed_password',
    firstName: '四',
    lastName: '李',
    age: 32,
    role: 'user',
    isActive: true,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-10-28'),
    lastLoginAt: new Date('2024-11-13'),
    avatar: 'https://i.pravatar.cc/150?img=2',
    phoneNumber: '13900139000',
    address: {
      street: '南京路100号',
      city: '上海',
      country: '中国',
      zipCode: '200001'
    }
  },
  {
    id: 3,
    username: 'wangwu',
    email: 'wangwu@example.com',
    password: 'hashed_password',
    firstName: '五',
    lastName: '王',
    age: 25,
    role: 'user',
    isActive: false,
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2024-09-15'),
    lastLoginAt: null,
    avatar: null,
    phoneNumber: null,
    address: null
  }
];

let nextId = 4;

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API 服务
 */
export const mockApi = {
  /**
   * 获取所有用户
   */
  async getAllUsers(): Promise<User[]> {
    await delay(500); // 模拟网络延迟
    return users.map(u => ({ ...u })); // 返回副本
  },

  /**
   * 根据 ID 获取用户
   */
  async getUserById(id: number): Promise<User | null> {
    await delay(300);
    const user = users.find(u => u.id === id);
    return user ? { ...user } : null;
  },

  /**
   * 创建用户
   */
  async createUser(request: CreateUserRequest): Promise<User> {
    await delay(600);
    
    const newUser: User = {
      id: nextId++,
      username: request.username,
      email: request.email,
      password: 'hashed_' + request.password,
      firstName: request.firstName,
      lastName: request.lastName,
      age: request.age,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
      avatar: null,
      phoneNumber: request.phoneNumber || null,
      address: null
    };
    
    users.push(newUser);
    return { ...newUser };
  },

  /**
   * 更新用户
   */
  async updateUser(id: number, request: UpdateUserRequest): Promise<User | null> {
    await delay(500);
    
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...request,
      updatedAt: new Date()
    };
    
    return { ...users[index] };
  },

  /**
   * 删除用户
   */
  async deleteUser(id: number): Promise<boolean> {
    await delay(400);
    
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    users.splice(index, 1);
    return true;
  },

  /**
   * 切换用户激活状态
   */
  async toggleUserStatus(id: number): Promise<User | null> {
    await delay(300);
    
    const user = users.find(u => u.id === id);
    if (!user) return null;
    
    user.isActive = !user.isActive;
    user.updatedAt = new Date();
    
    return { ...user };
  },

  /**
   * 搜索用户
   */
  async searchUsers(keyword: string): Promise<User[]> {
    await delay(400);
    
    const lowerKeyword = keyword.toLowerCase();
    return users
      .filter(u => 
        u.username.toLowerCase().includes(lowerKeyword) ||
        u.email.toLowerCase().includes(lowerKeyword) ||
        u.firstName.includes(keyword) ||
        u.lastName.includes(keyword)
      )
      .map(u => ({ ...u }));
  }
};

