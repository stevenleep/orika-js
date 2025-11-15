# @orika-js/vue3

<div align="center">

**Vue 3 适配器 - 为 Orika-JS 提供完整的响应式系统集成**

[![npm version](https://img.shields.io/npm/v/@orika-js/vue3.svg)](https://www.npmjs.com/package/@orika-js/vue3)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)

</div>

## 📦 安装

```bash
npm install @orika-js/core @orika-js/vue3
# 或
pnpm add @orika-js/core @orika-js/vue3
# 或
yarn add @orika-js/core @orika-js/vue3
```

## ✨ 特性

- ✅ **完整的响应式支持** - ref、reactive、computed 无缝集成
- ✅ **Composition API** - useMapper、useAsyncMapper 等组合式函数
- ✅ **Pinia 插件** - 在 Store 中直接使用对象映射
- ✅ **TypeScript** - 完整的类型推导和类型安全
- ✅ **自动解包** - 自动处理 Vue 响应式对象
- ✅ **批量处理** - 支持批量异步映射和进度追踪
- ✅ **零额外依赖** - 只依赖 vue 和 @orika-js/core

## 🚀 快速开始

### 1. 配置映射规则

```typescript
import { createMapperBuilder } from '@orika-js/core';

class UserEntity {
  id: number;
  username: string;
  password: string;
  email: string;
  createdAt: Date;
}

class UserDTO {
  id: number;
  displayName: string;
  email: string;
}

// 配置映射（全局，只需一次）
createMapperBuilder<UserEntity, UserDTO>()
  .from(UserEntity).to(UserDTO)
  .mapField('username', 'displayName')
  .exclude('password', 'createdAt')
  .register();
```

### 2. 在组件中使用

```vue
<template>
  <div>
    <h1>{{ userDTO.displayName }}</h1>
    <p>{{ userDTO.email }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMapper } from '@orika-js/vue3';

const { map } = useMapper(UserEntity, UserDTO);

const user = ref<UserEntity>(/* ... */);
const userDTO = ref<UserDTO | null>(null);

onMounted(() => {
  userDTO.value = map(user.value);
});
</script>
```

## 📖 API 文档

### 响应式映射函数

#### `mapToReactive(source, sourceClass, destClass, options?)`

将对象映射为 Vue 响应式对象（使用 `reactive`）。

```typescript
import { mapToReactive } from '@orika-js/vue3';

const user = { id: 1, username: 'Alice', password: 'secret' };
const dto = mapToReactive(user, UserEntity, UserDTO);

// dto 是响应式的
dto.displayName = 'Bob';  // 会触发响应式更新
```

**参数：**
- `source`: 源对象
- `sourceClass`: 源类构造函数
- `destClass`: 目标类构造函数
- `options?`: 映射选项

**返回：** 响应式的目标对象

#### `mapToRef(source, sourceClass, destClass, options?)`

将对象映射为 `ref`。

```typescript
import { mapToRef } from '@orika-js/vue3';

const user = { id: 1, username: 'Alice', password: 'secret' };
const dtoRef = mapToRef(user, UserEntity, UserDTO);

console.log(dtoRef.value.displayName);  // 'Alice'
```

#### `mapToComputed(sourceRef, sourceClass, destClass, options?)`

创建计算属性映射，自动追踪源对象变化。

```typescript
import { ref } from 'vue';
import { mapToComputed } from '@orika-js/vue3';

const userRef = ref({ id: 1, username: 'Alice', password: 'secret' });

// 创建计算属性
const dtoComputed = mapToComputed(userRef, UserEntity, UserDTO);

// 当 userRef 变化时，dtoComputed 会自动更新
userRef.value.username = 'Bob';
console.log(dtoComputed.value.displayName);  // 'Bob'
```

### Composables

#### `useMapper(sourceClass, destClass, options?)`

基础映射组合式函数。

```typescript
import { useMapper } from '@orika-js/vue3';

const {
  map,              // 普通映射
  mapToReactive,    // 映射为响应式对象
  mapToRef,         // 映射为 ref
  mapToComputed,    // 映射为计算属性
  mapArray,         // 批量映射
  isMapping,        // 是否正在映射
  error             // 错误信息
} = useMapper(UserEntity, UserDTO);

// 使用
const dto = map(user);
const reactiveDTO = mapToReactive(user);
const dtos = mapArray(users);
```

#### `useAsyncMapper(sourceClass, destClass, options?)`

异步映射组合式函数。

```typescript
import { useAsyncMapper } from '@orika-js/vue3';

const {
  mapAsync,         // 异步映射
  mapArrayAsync,    // 批量异步映射
  isLoading,        // 是否正在加载
  error             // 错误信息
} = useAsyncMapper(PostEntity, PostDTO);

// 使用
const dto = await mapAsync(post);
```

#### `useBatchMapper(sourceClass, destClass, options?)`

批量处理组合式函数，支持进度追踪。

```typescript
import { useBatchMapper } from '@orika-js/vue3';

const {
  mapBatch,         // 批量映射
  isPending,        // 是否正在处理
  progress,         // 进度 (0-100)
  error             // 错误信息
} = useBatchMapper(UserEntity, UserDTO);

// 使用
const dtos = await mapBatch(largeUserArray, {
  batchSize: 100,
  onProgress: (percent) => console.log(`进度: ${percent}%`)
});
```

#### `useAutoMapper(sourceRef, sourceClass, destClass, options?)`

自动映射，监听源对象变化并自动重新映射。

```typescript
import { ref } from 'vue';
import { useAutoMapper } from '@orika-js/vue3';

const userRef = ref(user);

// 自动追踪 userRef 的变化
const dtoRef = useAutoMapper(userRef, UserEntity, UserDTO, {
  immediate: true  // 立即执行映射
});

// userRef 变化时，dtoRef 会自动更新
```

### Pinia 插件

#### 安装插件

```typescript
// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createPiniaMapperPlugin } from '@orika-js/vue3';

const app = createApp(App);
const pinia = createPinia();

// 安装映射插件
pinia.use(createPiniaMapperPlugin({
  autoTransform: true,  // 自动转换 API 响应
  cache: true,          // 缓存映射结果
  debug: false          // 调试模式（打印映射日志）
}));

app.use(pinia);
app.mount('#app');
```

#### 在 Store 中使用

```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const users = ref<UserDTO[]>([]);
  const currentUser = ref<UserDTO | null>(null);
  
  async function fetchUsers() {
    const response = await fetch('/api/users');
    const data = await response.json();
    
    // 使用插件提供的 $mapper
    users.value = this.$mapper.mapArray(data, UserEntity, UserDTO);
  }
  
  async function fetchUser(id: number) {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    
    currentUser.value = this.$mapper.map(data, UserEntity, UserDTO);
  }
  
  async function updateUser(id: number, updates: Partial<UserDTO>) {
    const existing = users.value.find(u => u.id === id);
    if (!existing) return;
    
    // 合并更新
    const merged = this.$mapper.merge(updates, existing, UserDTO, UserEntity);
    await api.updateUser(id, merged);
  }
  
  return { users, currentUser, fetchUsers, fetchUser, updateUser };
});
```

#### 插件提供的方法

```typescript
// 在任何 Pinia Store 中可用
this.$mapper.map(source, SourceClass, DestClass);
this.$mapper.mapArray(sources, SourceClass, DestClass);
this.$mapper.mapAsync(source, SourceClass, DestClass);
this.$mapper.mapArrayAsync(sources, SourceClass, DestClass);
this.$mapper.merge(updates, existing, SourceClass, DestClass);
```

## 🎯 实际应用场景

### 场景 1: API 数据转换

```vue
<template>
  <div>
    <div v-if="isLoading">加载中...</div>
    <div v-else-if="error">错误: {{ error.message }}</div>
    <div v-else>
      <UserCard v-for="user in users" :key="user.id" :user="user" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAsyncMapper } from '@orika-js/vue3';

const { mapArrayAsync, isLoading, error } = useAsyncMapper(UserEntity, UserDTO);
const users = ref<UserDTO[]>([]);

onMounted(async () => {
  const response = await fetch('/api/users');
  const rawData = await response.json();
  
  // 自动排除敏感字段、转换格式
  users.value = await mapArrayAsync(rawData);
});
</script>
```

### 场景 2: 表单编辑

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="formData.displayName" placeholder="姓名" />
    <input v-model="formData.email" placeholder="邮箱" />
    <button type="submit">保存</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMapper } from '@orika-js/vue3';

const props = defineProps<{ user: UserEntity }>();

const { map } = useMapper(UserEntity, UserDTO);
const formData = ref(map(props.user));

async function handleSubmit() {
  // 将 DTO 转回 Entity
  const entity = map(formData.value);  // 需要配置反向映射
  await api.updateUser(entity);
}
</script>
```

### 场景 3: 实时数据同步

```vue
<template>
  <div>
    <h2>{{ userDTO.displayName }}</h2>
    <p>{{ userDTO.email }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAutoMapper } from '@orika-js/vue3';

// 原始数据（可能来自 WebSocket）
const rawUserData = ref<UserEntity | null>(null);

// 自动映射并追踪变化
const userDTO = useAutoMapper(rawUserData, UserEntity, UserDTO, {
  immediate: true
});

// WebSocket 更新时自动重新映射
websocket.on('user:updated', (data) => {
  rawUserData.value = data;  // userDTO 会自动更新
});
</script>
```

### 场景 4: 大数据量处理

```vue
<template>
  <div>
    <div v-if="isPending">
      处理中... {{ progress }}%
    </div>
    <div v-else>
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBatchMapper } from '@orika-js/vue3';

const { mapBatch, progress, isPending } = useBatchMapper(ProductEntity, ProductDTO);
const products = ref<ProductDTO[]>([]);

onMounted(async () => {
  const rawProducts = await fetchLargeDataset();  // 假设 10000 条数据
  
  // 分批处理，避免阻塞 UI
  products.value = await mapBatch(rawProducts, {
    batchSize: 100,
    onProgress: (percent) => {
      console.log(`处理进度: ${percent}%`);
    }
  });
});
</script>
```

### 场景 5: Pinia Store 集成

```typescript
// stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const users = ref<UserDTO[]>([]);
  const isLoading = ref(false);
  
  async function loadUsers() {
    isLoading.value = true;
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      // 使用 Pinia 插件提供的映射功能
      users.value = await this.$mapper.mapArrayAsync(data, UserEntity, UserDTO);
    } finally {
      isLoading.value = false;
    }
  }
  
  return { users, isLoading, loadUsers };
});
```

```vue
<template>
  <div>
    <div v-if="userStore.isLoading">加载中...</div>
    <div v-else>
      <UserCard v-for="user in userStore.users" :key="user.id" :user="user" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

onMounted(() => {
  userStore.loadUsers();
});
</script>
```

## 💡 最佳实践

### 1. 选择合适的响应式函数

```typescript
// ✅ 需要响应式对象：使用 mapToReactive
const dto = mapToReactive(user, User, UserDTO);

// ✅ 需要 ref：使用 mapToRef
const dtoRef = mapToRef(user, User, UserDTO);

// ✅ 需要自动追踪：使用 mapToComputed
const userRef = ref(user);
const dtoComputed = mapToComputed(userRef, User, UserDTO);
```

### 2. 性能优化

```typescript
// ✅ 对于大量数据，使用批量处理
const { mapBatch } = useBatchMapper(User, UserDTO);
const dtos = await mapBatch(largeArray, { batchSize: 50 });

// ❌ 避免在模板中直接映射
<template>
  <!-- 不推荐 -->
  <div v-for="user in users.map(u => map(u))">
</template>

// ✅ 在 setup 中预先映射
<script setup>
const mappedUsers = computed(() => users.value.map(u => map(u)));
</script>
<template>
  <div v-for="user in mappedUsers">
</template>
```

### 3. 错误处理

```typescript
const { map, error } = useMapper(User, UserDTO);

watchEffect(() => {
  if (error.value) {
    console.error('映射错误:', error.value);
    // 处理错误
  }
});
```

### 4. TypeScript 类型安全

```typescript
// ✅ 使用泛型确保类型安全
const { map } = useMapper<UserEntity, UserDTO>(UserEntity, UserDTO);
const dto = map(user);
//    ^? UserDTO

// 计算属性也有完整类型推导
const dtoComputed = mapToComputed(userRef, UserEntity, UserDTO);
//    ^? ComputedRef<UserDTO>
```

## 🔧 高级配置

### 映射选项

```typescript
const dto = mapToReactive(user, User, UserDTO, {
  pick: ['id', 'name'],      // 只映射这些字段
  omit: ['password'],        // 跳过这些字段
  deep: true,                // 深度响应式
  merge: true,               // 合并到现有对象
  keepOnError: false         // 映射失败时是否保留原值
});
```

### Composable 选项

```typescript
const { map } = useMapper(User, UserDTO, {
  immediate: true,           // 立即执行
  cache: true,               // 缓存结果
  debounce: 300,             // 防抖（毫秒）
  errorHandler: (err) => {   // 自定义错误处理
    console.error('映射失败:', err);
  }
});
```

## 🤝 兼容性

- Vue 3.0+
- @orika-js/core ^1.2.0
- Pinia 2.0+（可选，用于 Pinia 插件）
- TypeScript 5.0+
- Node.js 16+
- 支持浏览器环境

## 📦 包大小

- 核心代码：~12KB (gzipped: ~4KB)
- 零运行时依赖（仅 peer dependencies: vue、@orika-js/core）
- 支持 Tree-shaking

## 📄 许可证

[MIT](../../LICENSE) © [Steven Lee](https://github.com/stevenleep)

## 🔗 相关链接

- [@orika-js/core 核心库](../core)
- [@orika-js/react React 适配器](../react)
- [GitHub 仓库](https://github.com/stevenleep/orika-js)
- [问题反馈](https://github.com/stevenleep/orika-js/issues)
- [示例代码](../../examples/vue3-app)
