/**
 * 用户实体 - 后端数据模型
 */
export class User {
  id: number = 0;
  username: string = '';
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  age: number = 0;
  role: string = '';
  isActive: boolean = true;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  lastLoginAt: Date | null = null;
  avatar: string | null = null;
  phoneNumber: string | null = null;
  address: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  } | null = null;
}

/**
 * 用户 VO - 视图对象（View Object）
 * 用于前端页面展示
 */
export class UserVO {
  id: number = 0;
  displayName: string = '';
  email: string = '';
  age: number = 0;
  roleName: string = '';
  status: string = '';
  memberSince: string = '';
  lastLogin: string = '';
  avatar: string = '';
  contactInfo: string = '';
}

/**
 * 用户创建请求 DTO - 用于前后端数据传输
 */
export class CreateUserRequest {
  username: string = '';
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  age: number = 0;
  phoneNumber?: string;
}

/**
 * 用户更新请求 DTO - 用于前后端数据传输
 */
export class UpdateUserRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  phoneNumber?: string;
  avatar?: string;
}

/**
 * 用户列表项 VO - 列表视图对象
 * 用于用户列表展示
 */
export class UserListItemVO {
  id: number = 0;
  displayName: string = '';
  email: string = '';
  roleName: string = '';
  status: string = '';
  avatar: string = '';
}

