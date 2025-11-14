# Vue 3 Adapter for orika-js

> 为 orika-js 提供完整的 Vue 3 响应式系统集成

## 📦 安装

```bash
pnpm add orika-js vue
# or
npm install orika-js vue
```

## ✨ 特性

- ✅ **完整的响应式支持** - ref, reactive, computed 无缝集成
- ✅ **Composition API** - 提供 `useMapper`, `useAsyncMapper` 等组合式函数
- ✅ **Pinia 插件** - 在 Store 中直接使用对象映射
- ✅ **TypeScript 支持** - 完整的类型推导和类型安全
- ✅ **自动解包** - 自动处理 Vue 响应式对象
- ✅ **批量处理** - 支持批量异步映射和进度追踪

## 🚀 快速开始

### 1. 基础映射

```typescript
import { ref } from 'vue';
import { createMapperBuilder } from 'orika-js';
import { mapToReactive, mapToRef } from 'orika-js/adapters/vue3';

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

### 2. 使用 Composables

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
import { useMapper } from 'orika-js/adapters/vue3';

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
import { ref, computed } from 'vue';
import { mapToComputed } from 'orika-js/adapters/vue3';

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

#### `useAutoMapper(sourceRef, sourceClass, destClass, options?)`

自动映射，监听源对象变化。

```typescript
const userRef = ref(user);
const dtoRef = useAutoMapper(userRef, User, UserDTO, {
  immediate: true  // 立即执行映射
});
// dtoRef 会自动随 userRef 更新
```

### Pinia 插件

#### 安装插件

```typescript
// main.ts
import { createPinia } from 'pinia';
import { createPiniaMapperPlugin } from 'orika-js/adapters/vue3';

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

插件提供的方法：

```typescript
this.$mapper.map(source, SourceClass, DestClass)
this.$mapper.mapArray(sources, SourceClass, DestClass)
this.$mapper.mapAsync(source, SourceClass, DestClass)
this.$mapper.mapArrayAsync(sources, SourceClass, DestClass)
this.$mapper.merge(updates, existing, SourceClass, DestClass)
```

## 💡 实际应用场景

### 场景 1: API 数据转换

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAsyncMapper } from 'orika-js/adapters/vue3';

const { mapArrayAsync, isLoading, error } = useAsyncMapper(User, UserDTO);

const users = ref([]);

onMounted(async () => {
  const response = await fetch('/api/users');
  const rawData = await response.json();
  
  // 自动排除敏感字段、转换格式
  users.value = await mapArrayAsync(rawData);
});
</script>
```

### 场景 2: 表单数据提交

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { useMapper } from 'orika-js/adapters/vue3';

const formData = reactive({
  displayName: '',
  email: ''
});

const { map } = useMapper(UserDTO, CreateUserRequest);

async function submitForm() {
  // 将表单数据转换为 API 请求格式
  const request = map(formData);
  await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(request)
  });
}
</script>
```

### 场景 3: 实时数据同步

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useAutoMapper } from 'orika-js/adapters/vue3';

// 原始数据（可能来自 WebSocket）
const rawUserData = ref(null);

// 自动映射并追踪变化
const userDTO = useAutoMapper(rawUserData, User, UserDTO);

// 当 rawUserData 更新时，userDTO 自动更新
websocket.on('user:updated', (data) => {
  rawUserData.value = data;
});
</script>
```

### 场景 4: 大数据量处理

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useBatchMapper } from 'orika-js/adapters/vue3';

const { mapBatch, progress, isPending } = useBatchMapper(Product, ProductDTO);

const products = ref([]);

async function loadProducts() {
  const rawProducts = await fetchLargeDataset(); // 假设 10000 条数据
  
  // 分批处理，避免阻塞 UI
  products.value = await mapBatch(rawProducts, {
    batchSize: 100,
    onProgress: (percent) => {
      console.log(`处理进度: ${percent}%`);
    }
  });
}
</script>

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
```

## 🎯 最佳实践

### 1. 类型安全

```typescript
// ✅ 推荐：使用泛型确保类型安全
const { map } = useMapper<User, UserDTO>(User, UserDTO);

// ❌ 不推荐：丢失类型信息
const mapper = useMapper(User, UserDTO);
```

### 2. 错误处理

```typescript
const { mapAsync, error } = useAsyncMapper(User, UserDTO);

try {
  const dto = await mapAsync(user);
} catch (err) {
  console.error('映射失败:', error.value);
  // 处理错误
}
```

### 3. 性能优化

```typescript
// ✅ 对于大量数据，使用批量处理
const { mapBatch } = useBatchMapper(User, UserDTO);
const dtos = await mapBatch(users, { batchSize: 50 });

// ❌ 避免循环调用单个映射
users.forEach(user => {
  const dto = map(user); // 性能差
});
```

### 4. 响应式最佳实践

```typescript
// ✅ 使用计算属性自动追踪
const userDTO = mapToComputed(userRef, User, UserDTO);

// ❌ 手动监听更新（代码冗余）
watch(userRef, (newUser) => {
  dtoRef.value = map(newUser);
});
```

## 📚 示例代码

查看 `examples/vue3/` 目录下的完整示例：

- `01-basic-vue.ts` - 基础用法
- `02-async-vue.ts` - 异步映射
- `03-pinia-integration.ts` - Pinia 集成

## 🤝 兼容性

- Vue 3.x
- TypeScript 5.0+
- Node.js 16+
- 支持浏览器环境

## 📄 License

MIT

