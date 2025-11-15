# @orika-js/zustand

Zustand 状态管理集成，为 orika-js 提供自动对象映射功能。

## 📦 安装

```bash
npm install @orika-js/zustand @orika-js/core zustand
# 或
pnpm add @orika-js/zustand @orika-js/core zustand
```

## 🚀 快速开始

### 基础用法

```typescript
import { createMappedStore } from '@orika-js/zustand';

// 定义状态类
class UserState {
  id: number = 0;
  name: string = '';
  email: string = '';
}

// 定义 DTO 类
class UserDTO {
  userId: number = 0;
  displayName: string = '';
  contact: string = '';
}

// 创建带映射功能的 store
const useUserStore = createMappedStore<UserState, UserDTO>({
  sourceClass: UserState,
  dtoClass: UserDTO,
})((set) => ({
  id: 0,
  name: '',
  email: '',
  setName: (name: string) => set({ name }),
  setEmail: (email: string) => set({ email }),
}));

// 在组件中使用
function UserProfile() {
  const user = useUserStore();
  
  // 使用内置的 mapper 映射到 DTO
  const userDTO = useUserStore.mapState();
  
  console.log(userDTO); // { userId: 0, displayName: '', contact: '' }
  
  return <div>{user.name}</div>;
}
```

### 使用 Hooks

```typescript
import { useMappedState, useMappedSelector } from '@orika-js/zustand';

function UserComponent() {
  // 映射整个状态
  const userDTO = useMappedState(useUserStore, useUserStore.mapper);
  
  // 映射选择的部分状态
  const userInfo = useMappedSelector(
    useUserStore,
    (state) => ({ name: state.name, email: state.email }),
    partialMapper
  );
  
  return <div>{userDTO.displayName}</div>;
}
```

### 使用中间件

```typescript
import { mapperMiddleware } from '@orika-js/zustand';
import { create } from 'zustand';

const useStore = create(
  mapperMiddleware(
    (set) => ({
      id: 0,
      name: '',
      updateName: (name: string) => set({ name })
    }),
    {
      mapper: myMapper,
      onMapped: (state, dto) => {
        console.log('State updated and mapped:', dto);
      },
      log: true
    }
  )
);
```

## 📖 API

### `createMappedStore(config)`

创建带映射功能的 Zustand store。

**参数：**
- `config.sourceClass` - 源状态类
- `config.dtoClass` - 目标 DTO 类
- `config.mapper` - 自定义 mapper（可选）
- `config.autoMap` - 是否自动映射（默认 true）

**返回：**
- Store 创建函数，返回的 store 包含：
  - `mapper` - Mapper 实例
  - `mapState()` - 映射当前完整状态
  - `mapStatePartial(selector)` - 映射部分状态

### Hooks

#### `useMappedState(useStore, mapper)`
使用映射后的完整状态。

#### `useMappedSelector(useStore, selector, mapper, equalityFn?)`
使用映射后的选择器状态。

#### `useCachedMappedState(useStore, mapper)`
使用带缓存的映射状态。

#### `useSubscribeMapped(useStore, mapper, onMapped?)`
订阅并映射状态变化。

### 中间件

#### `mapperMiddleware`
在每次状态更新时自动映射。

#### `persistMapperMiddleware`
将映射后的状态持久化到 localStorage。

## 🎯 使用场景

### 1. API 数据转换

```typescript
class ApiUser {
  user_id: number;
  user_name: string;
  user_email: string;
}

class UserState {
  id: number;
  name: string;
  email: string;
}

const useUserStore = createMappedStore<UserState, ApiUser>({
  sourceClass: UserState,
  dtoClass: ApiUser,
})((set) => ({
  id: 0,
  name: '',
  email: '',
  async fetchUser(id: number) {
    const response = await fetch(`/api/users/${id}`);
    const apiUser: ApiUser = await response.json();
    
    // 自动映射 API 数据到状态
    // (需要反向映射器)
    set(apiUser);
  }
}));
```

### 2. 状态持久化

```typescript
import { persistMapperMiddleware } from '@orika-js/zustand';

const useStore = create(
  persistMapperMiddleware(
    (set) => ({ /* state */ }),
    {
      mapper: myMapper,
      key: 'app-state-dto',
      storage: localStorage
    }
  )
);
```

### 3. 状态监听和日志

```typescript
const useStore = create(
  mapperMiddleware(
    (set) => ({ /* state */ }),
    {
      mapper: myMapper,
      log: true,
      onMapped: (state, dto) => {
        // 发送到分析服务
        analytics.track('state_changed', dto);
      }
    }
  )
);
```

## 🔗 相关链接

- [orika-js 核心文档](../core/README.md)
- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [完整示例](../../examples/)

## 📄 License

MIT

