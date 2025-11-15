# @orika-js/pinia

> Pinia adapter for orika-js - Object mapping plugin for Pinia stores

[![npm version](https://img.shields.io/npm/v/@orika-js/pinia.svg)](https://www.npmjs.com/package/@orika-js/pinia)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📦 Installation

```bash
# pnpm
pnpm add @orika-js/pinia @orika-js/core pinia

# npm
npm install @orika-js/pinia @orika-js/core pinia

# yarn
yarn add @orika-js/pinia @orika-js/core pinia
```

## 🚀 Quick Start

### 1. Setup Pinia Plugin

```typescript
import { createPinia } from 'pinia';
import { createPiniaMapperPlugin } from '@orika-js/pinia';

const pinia = createPinia();

// Add the mapper plugin to Pinia
pinia.use(createPiniaMapperPlugin({
  autoTransform: true,
  cache: true,
  debug: false
}));

app.use(pinia);
```

### 2. Define Your Models

```typescript
import { MapField } from '@orika-js/core';

// API Response DTO
export class UserDTO {
  @MapField()
  id: number;
  
  @MapField()
  user_name: string;
  
  @MapField()
  email_address: string;
  
  @MapField()
  created_at: string;
}

// Domain Model
export class User {
  @MapField({ from: 'id' })
  id: number;
  
  @MapField({ from: 'user_name' })
  username: string;
  
  @MapField({ from: 'email_address' })
  email: string;
  
  @MapField({ 
    from: 'created_at',
    transform: (value: string) => new Date(value)
  })
  createdAt: Date;
}
```

### 3. Configure Mapping

```typescript
import { MapperFactory } from '@orika-js/core';

const factory = MapperFactory.getInstance();

factory.createMap(UserDTO, User)
  .forMember('username', opts => opts.mapFrom('user_name'))
  .forMember('email', opts => opts.mapFrom('email_address'))
  .forMember('createdAt', opts => 
    opts.mapFrom('created_at', (value: string) => new Date(value))
  );
```

### 4. Use in Pinia Store

```typescript
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    currentUser: null as User | null
  }),
  
  actions: {
    async fetchUsers() {
      // Fetch from API
      const response = await fetch('/api/users');
      const dtos: UserDTO[] = await response.json();
      
      // Use $mapper to transform DTOs to domain models
      this.users = this.$mapper.mapArray(dtos, UserDTO, User);
    },
    
    async fetchUser(id: number) {
      const response = await fetch(`/api/users/${id}`);
      const dto: UserDTO = await response.json();
      
      // Map single object
      this.currentUser = this.$mapper.map(dto, UserDTO, User);
    },
    
    async createUser(userData: Partial<User>) {
      // Map domain model to DTO for API
      const dto = this.$mapper.map(userData, User, UserDTO);
      
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(dto)
      });
      
      const createdDto = await response.json();
      return this.$mapper.map(createdDto, UserDTO, User);
    },
    
    updateUser(updates: Partial<User>) {
      if (this.currentUser) {
        // Merge updates into existing user
        this.currentUser = this.$mapper.merge(
          updates,
          this.currentUser,
          User,
          User
        );
      }
    }
  }
});
```

## 🎯 Features

### TypeScript Support

The plugin provides full TypeScript support with type inference:

```typescript
// Full type safety
const user = this.$mapper.map(dto, UserDTO, User); // Type: User
const users = this.$mapper.mapArray(dtos, UserDTO, User); // Type: User[]
```

### Async Mapping

For complex transformations that require async operations:

```typescript
async fetchUserWithDetails(id: number) {
  const dto = await fetchUserDTO(id);
  
  // Async mapping with promise-based transformations
  const user = await this.$mapper.mapAsync(dto, UserDTO, User);
  
  this.currentUser = user;
}

async fetchAllUsers() {
  const dtos = await fetchUserDTOs();
  
  // Batch async mapping
  this.users = await this.$mapper.mapArrayAsync(dtos, UserDTO, User);
}
```

### Merge Updates

Update existing state objects efficiently:

```typescript
updateUserProfile(changes: Partial<User>) {
  if (this.currentUser) {
    // Merge only changed fields
    this.currentUser = this.$mapper.merge(
      changes,
      this.currentUser,
      User,
      User
    );
  }
}
```

## ⚙️ Configuration Options

```typescript
interface PiniaMapperOptions {
  /**
   * Auto-transform API responses
   * @default true
   */
  autoTransform?: boolean;
  
  /**
   * Cache mapping results
   * @default true
   */
  cache?: boolean;
  
  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}
```

### Example with All Options

```typescript
pinia.use(createPiniaMapperPlugin({
  autoTransform: true,  // Automatically transform data
  cache: true,          // Cache mapping configurations
  debug: true           // Log mapping operations
}));
```

## 🔧 API Reference

### Store Methods

All stores automatically get access to these methods via `this.$mapper`:

#### `map<S, D>(source, sourceClass, destClass): D`

Map a single object from source type to destination type.

```typescript
const user = this.$mapper.map(dto, UserDTO, User);
```

#### `mapArray<S, D>(sources, sourceClass, destClass): D[]`

Map an array of objects.

```typescript
const users = this.$mapper.mapArray(dtos, UserDTO, User);
```

#### `mapAsync<S, D>(source, sourceClass, destClass): Promise<D>`

Asynchronously map a single object.

```typescript
const user = await this.$mapper.mapAsync(dto, UserDTO, User);
```

#### `mapArrayAsync<S, D>(sources, sourceClass, destClass): Promise<D[]>`

Asynchronously map an array of objects.

```typescript
const users = await this.$mapper.mapArrayAsync(dtos, UserDTO, User);
```

#### `merge<S, D>(updates, existing, sourceClass, destClass): D`

Merge partial updates into an existing object.

```typescript
const updated = this.$mapper.merge(changes, current, User, User);
```

## 🎨 Real-World Example

Complete example with user management:

```typescript
import { defineStore } from 'pinia';
import { MapperFactory } from '@orika-js/core';

// Setup mapping once
const factory = MapperFactory.getInstance();
factory.createMap(UserDTO, User)
  .forMember('username', opts => opts.mapFrom('user_name'))
  .forMember('email', opts => opts.mapFrom('email_address'))
  .forMember('createdAt', opts => 
    opts.mapFrom('created_at', (v: string) => new Date(v))
  );

factory.createMap(User, UserDTO)
  .forMember('user_name', opts => opts.mapFrom('username'))
  .forMember('email_address', opts => opts.mapFrom('email'))
  .forMember('created_at', opts => 
    opts.mapFrom('createdAt', (v: Date) => v.toISOString())
  );

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    currentUser: null as User | null,
    loading: false,
    error: null as string | null
  }),
  
  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch('/api/users');
        const dtos: UserDTO[] = await response.json();
        
        // Transform all DTOs to domain models
        this.users = this.$mapper.mapArray(dtos, UserDTO, User);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    
    async saveUser(user: User) {
      // Transform domain model to DTO for API
      const dto = this.$mapper.map(user, User, UserDTO);
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      
      const savedDto = await response.json();
      const savedUser = this.$mapper.map(savedDto, UserDTO, User);
      
      this.users.push(savedUser);
      return savedUser;
    }
  }
});
```

## 📝 License

MIT © Steven Lee

## 🔗 Related Packages

- [@orika-js/core](../core) - Core mapping functionality
- [@orika-js/vue3](../vue3) - Vue 3 composables and utilities
- [@orika-js/react](../react) - React hooks and components

