/**
 * 映射配置
 * 配置所有数据模型之间的映射关系
 * 
 * PO (Persistent Object) - 数据库实体
 * DTO (Data Transfer Object) - 数据传输对象（前后端传输）
 * VO (View Object) - 视图对象（页面展示）
 */
import { createMapperBuilder } from '@orika-js/core';
import { User, UserVO, UserListItemVO, CreateUserRequest } from './User';

/**
 * User (Entity) -> UserVO (View Object) 映射
 * 用于用户详情页面展示
 */
createMapperBuilder<User, UserVO>()
  .from(User)
  .to(UserVO)
  // 组合字段映射
  .forMember('displayName', (source) => 
    `${source.firstName} ${source.lastName}`.trim() || source.username
  )
  // 字段重命名
  .mapField('role', 'roleName')
  // 状态转换
  .forMember('status', (source) => 
    source.isActive ? '活跃' : '已停用'
  )
  // 日期格式化
  .forMember('memberSince', (source) => 
    source.createdAt.toLocaleDateString('zh-CN')
  )
  .forMember('lastLogin', (source) => 
    source.lastLoginAt 
      ? source.lastLoginAt.toLocaleString('zh-CN')
      : '从未登录'
  )
  // 默认值处理
  .forMember('avatar', (source) => 
    source.avatar || 'https://via.placeholder.com/150'
  )
  // 复杂字段组合
  .forMember('contactInfo', (source) => {
    const parts = [];
    if (source.email) parts.push(`📧 ${source.email}`);
    if (source.phoneNumber) parts.push(`📱 ${source.phoneNumber}`);
    if (source.address) {
      parts.push(`📍 ${source.address.city}, ${source.address.country}`);
    }
    return parts.join(' | ') || '无联系方式';
  })
  // 排除敏感字段
  .exclude('password')
  .register();

/**
 * User (Entity) -> UserListItemVO (View Object) 映射
 * 用于用户列表展示（简化版）
 */
createMapperBuilder<User, UserListItemVO>()
  .from(User)
  .to(UserListItemVO)
  .forMember('displayName', (source) => 
    `${source.firstName} ${source.lastName}`.trim() || source.username
  )
  .mapField('role', 'roleName')
  .forMember('status', (source) => 
    source.isActive ? '✅ 活跃' : '❌ 已停用'
  )
  .forMember('avatar', (source) => 
    source.avatar || 'https://via.placeholder.com/50'
  )
  .register();

/**
 * CreateUserRequest (DTO) -> User (Entity) 映射
 * 用于创建用户时的数据转换
 */
createMapperBuilder<CreateUserRequest, User>()
  .from(CreateUserRequest)
  .to(User)
  .forMember('createdAt', () => new Date())
  .forMember('updatedAt', () => new Date())
  .forMember('isActive', () => true)
  .forMember('role', () => 'user') // 默认角色
  .register();

