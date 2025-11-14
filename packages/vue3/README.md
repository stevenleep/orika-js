# @orika-js/vue3

> Vue 3 适配器 - 为 @orika-js/core 提供完整的 Vue 3 响应式系统集成

[![npm version](https://img.shields.io/npm/v/@orika-js/vue3.svg)](https://www.npmjs.com/package/@orika-js/vue3)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📦 安装

```bash
# 安装核心库和 Vue 3 适配器
npm install @orika-js/core @orika-js/vue3

# 或使用 pnpm
pnpm add @orika-js/core @orika-js/vue3

# 或使用 yarn
yarn add @orika-js/core @orika-js/vue3
```

## ✨ 特性

- ✅ **完整的响应式支持** - ref, reactive, computed 无缝集成
- ✅ **Composition API** - 提供 `useMapper`, `useAsyncMapper` 等组合式函数
- ✅ **Pinia 插件** - 在 Store 中直接使用对象映射
- ✅ **TypeScript 支持** - 完整的类型推导和类型安全
- ✅ **自动解包** - 自动处理 Vue 响应式对象
- ✅ **批量处理** - 支持批量异步映射和进度追踪
- ✅ **零依赖** - 除了 vue 和 @orika-js/core，无其他依赖

## 🚀 快速开始

### 1. 基础映射

```typescript
import { ref } from 'vue';
import { createMapperBuilder } from '@orika-js/core';
import { mapToReactive, mapToRef } from '@orika-js/vue3';

// 定义映射规则
class User {
  id: number;
  username: string;
  password: string;
}

class UserDTO {
  id: number;
  displayName: string;
}

createMapperBuilder<User, UserDTO>()
  .from(User)
  .to(UserDTO)
  .mapField('username', 'displayName')
  .exclude('password')
  .register();

// 使用映射
const user = { id: 1, username: 'Alice', password: 'secret' };

// 映射为响应式对象
const dto = mapToReactive(user, User, UserDTO);
console.log(dto.displayName); // 'Alice'

// 映射为 ref
const dtoRef = mapToRef(user, User, UserDTO);
console.log(dtoRef.value.displayName); // 'Alice'
```

### 2. 在 Vue 组件中使用

```vue
<template>
  <div>
    <div v-if="isLoading">加载中...</div>
    <div v-else-if="error">错误: {{ error.message }}</div>
    <div v-else>
      <h2>{{ userDTO.displayName }}</h2>
      <p>ID: {{ userDTO.id }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMapper } from '@orika-js/vue3';

const { mapToReactive, isMapping, error } = useMapper(User, UserDTO);

const userDTO = ref(null);

onMounted(() => {
  const rawUser = { id: 1, username: 'Alice', password: 'secret' };
  userDTO.value = mapToReactive(rawUser);
});
</script>
```

### 3. 计算属性自动映射

```typescript
import { ref } from 'vue';
import { mapToComputed } from '@orika-js/vue3';

// 源数据是响应式的
const userRef = ref({ 
  id: 1, 
  username: 'Alice',
  password: 'secret'
});

// 创建计算属性，自动映射并跟踪变化
const userDTOComputed = mapToComputed(userRef, User, UserDTO);

// 当 userRef 变化时，userDTOComputed 会自动更新
userRef.value.username = 'Alice Wang';
console.log(userDTOComputed.value.displayName); // 'Alice Wang'
```

## 🔧 API 参考

### 响应式映射函数

#### `mapToReactive(source, sourceClass, destClass, options?)`

将对象映射为 Vue 响应式对象。

```typescript
const dto = mapToReactive(user, User, UserDTO, {
  deep: true,           // 深度响应式
  keepOnError: false    // 映射失败时是否保留原值
});
```

#### `mapToRef(source, sourceClass, destClass, options?)`

将对象映射为 ref。

```typescript
const dtoRef = mapToRef(user, User, UserDTO);
console.log(dtoRef.value);
```

#### `mapToComputed(sourceRef, sourceClass, destClass, options?)`

创建计算属性映射，自动追踪源对象变化。

```typescript
const userRef = ref(user);
const dtoComputed = mapToComputed(userRef, User, UserDTO);
// dtoComputed 会自动随 userRef 更新
```

### Composables

#### `useMapper(sourceClass, destClass, options?)`

基础映射组合式函数。

```typescript
const {
  map,              // 普通映射
  mapToReactive,    // 映射为响应式对象
  mapToRef,         // 映射为 ref
  mapToComputed,    // 映射为计算属性
  mapArray,         // 批量映射
  isMapping,        // 是否正在映射
  error             // 错误信息
} = useMapper(User, UserDTO);
```

#### `useAsyncMapper(sourceClass, destClass, options?)`

异步映射组合式函数。

```typescript
const {
  mapAsync,         // 异步映射
  mapArrayAsync,    // 批量异步映射
  isLoading,        // 是否正在加载
  error             // 错误信息
} = useAsyncMapper(Post, PostDTO);

// 使用
const dto = await mapAsync(post);
```

#### `useBatchMapper(sourceClass, destClass, options?)`

批量处理组合式函数，支持进度追踪。

```typescript
const { 
  mapBatch,         // 批量映射
  isPending,        // 是否正在处理
  progress,         // 进度 (0-100)
  error             // 错误信息
} = useBatchMapper(User, UserDTO);

// 使用
const dtos = await mapBatch(users, {
  batchSize: 10,
  onProgress: (percent) => console.log(`进度: ${percent}%`)
});
```

### Pinia 插件

#### 安装插件

```typescript
// main.ts
import { createPinia } from 'pinia';
import { createPiniaMapperPlugin } from '@orika-js/vue3';

const pinia = createPinia();
pinia.use(createPiniaMapperPlugin({
  autoTransform: true,  // 自动转换 API 响应
  cache: true,          // 缓存映射结果
  debug: false          // 调试模式
}));
```

#### 在 Store 中使用

```typescript
// stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  
  async function fetchUsers() {
    const response = await fetch('/api/users');
    const data = await response.json();
    
    // 使用插件提供的 $mapper
    users.value = this.$mapper.mapArray(data, User, UserDTO);
  }
  
  return { users, fetchUsers };
});
```

## 💡 为什么选择独立包？

将 Vue 3 适配器作为独立包有以下优势：

1. **依赖隔离** - 核心库 `@orika-js/core` 保持轻量，无 Vue 依赖
2. **按需安装** - 只在需要 Vue 集成时才安装此包
3. **独立维护** - 可以独立于核心库发版和更新
4. **更小体积** - 核心包体积更小，适合非 Vue 项目使用

## 📚 示例代码

查看 [examples/vue3/](../../examples/vue3/) 目录下的完整示例：

- `01-basic-vue.ts` - 基础用法
- `02-async-vue.ts` - 异步映射
- `03-pinia-integration.ts` - Pinia 集成

## 🤝 兼容性

- Vue 3.x
- @orika-js/core ^1.2.0
- TypeScript 5.0+
- Node.js 16+
- 支持浏览器环境

## 📄 License

MIT

## 🔗 相关链接

- [@orika-js/core 核心库](../core)
- [GitHub 仓库](https://github.com/stevenleep/orika-js)
- [问题反馈](https://github.com/stevenleep/orika-js/issues)

