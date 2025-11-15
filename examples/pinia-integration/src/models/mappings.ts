import { createMapperBuilder } from '@orika-js/core';
import { UserDTO } from './UserDTO';
import { User } from './User';

/**
 * Configure all mappings
 * This should be imported once in main.ts
 */

// UserDTO -> User
createMapperBuilder<UserDTO, User>()
  .from(UserDTO)
  .to(User)
  .mapField('user_name', 'username')
  .mapField('email_address', 'email')
  .mapField('is_active', 'isActive')
  .forMember('createdAt', (source) => new Date(source.created_at))
  .register();

// User -> UserDTO (for saving)
createMapperBuilder<User, UserDTO>()
  .from(User)
  .to(UserDTO)
  .mapField('username', 'user_name')
  .mapField('email', 'email_address')
  .mapField('isActive', 'is_active')
  .forMember('created_at', (source) => source.createdAt.toISOString())
  .register();

console.log('✅ Mappings configured');

