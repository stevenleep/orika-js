# Orika-JS

<div align="center">

**轻量级、类型安全的 TypeScript 对象映射库**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

[English](./README.en.md) | 简体中文

</div>

## 📖 简介

**Orika-JS** 是一个专为 TypeScript 设计的对象映射库，灵感来自 Java 的 Orika 框架。它帮助你在分层架构中优雅地处理不同对象模型之间的转换（PO/DO/DTO/VO）。

### 为什么需要对象映射？

现代软件架构中，分层设计是最佳实践。不同层级使用不同的对象模型：

```
┌─────────────────┬────────────────────┬───────────────────┐
│  表现层 (API)    │   业务层 (Service)  │   持久层 (DB)      │
├─────────────────┼────────────────────┼───────────────────┤
│  DTO/VO         │   DO/BO            │   PO/Entity       │
└─────────────────┴────────────────────┴───────────────────┘
         ↓                  ↓                    ↓
     需要转换            需要转换             需要转换
```

传统的手写转换代码存在诸多问题：
- ❌ 大量重复的样板代码
- ❌ 字段遗漏导致的运行时错误
- ❌ 模型变更后需要同步修改多处
- ❌ 缺乏类型安全保障

**Orika-JS 采用声明式配置，一次定义，全局复用：**
- ✅ 完整的 TypeScript 类型推导
- ✅ 约定优于配置（同名字段自动映射）
- ✅ 支持字段重命名、嵌套对象、自定义转换
- ✅ 框架集成（Vue 3 / React）

## ✨ 核心特性

| 特性 | 说明 |
|------|------|
| 🔒 **类型安全** | 完整的 TypeScript 泛型支持，编译时类型检查 |
| 🎯 **约定优于配置** | 同名字段自动映射，零配置即可使用 |
| ⚡️ **高性能** | 映射缓存、惰性求值、批量处理优化 |
| 🔄 **异步支持** | 原生支持异步转换器和并发控制 |
| 🎨 **灵活配置** | 字段重命名、条件映射、自定义转换器 |
| 🚀 **框架集成** | Vue 3 响应式 / React Hooks |
| 📦 **零依赖** | 核心库无运行时依赖，支持 Tree-shaking |

## 📦 安装

```bash
# 核心库（必需）
npm install @orika-js/core

# Vue 3 项目
npm install @orika-js/vue3

# React 项目  
npm install @orika-js/react
```

## 🚀 快速开始

### 基础用法

**3 步完成对象映射：**

```typescript
import { createMapperBuilder, MapperFactory } from '@orika-js/core';

// 1️⃣ 定义模型
class UserEntity {
  id: number;
  username: string;
  password: string;
  email: string;
  createdAt: Date;
}

class UserDTO {
  id: number;
  displayName: string;  // 字段重命名
  email: string;        // 同名字段自动映射
}

// 2️⃣ 配置映射（只需配置一次）
createMapperBuilder<UserEntity, UserDTO>()
  .from(UserEntity).to(UserDTO)
  .mapField('username', 'displayName')  // 字段重命名
  .exclude('password', 'createdAt')     // 排除敏感字段
  .register();

// 3️⃣ 执行映射
const factory = MapperFactory.getInstance();
const entity = {
  id: 1,
  username: 'Alice',
  password: 'secret',
  email: 'alice@example.com',
  createdAt: new Date()
};

const dto = factory.map(entity, UserEntity, UserDTO);
// 结果: { id: 1, displayName: 'Alice', email: 'alice@example.com' }
```

### 高级特性

```typescript
// 自定义转换逻辑
createMapperBuilder<User, UserDTO>()
  .from(User).to(UserDTO)
  .forMember('age', (src) => 2024 - src.birthYear)
  .forMember('fullName', (src) => `${src.firstName} ${src.lastName}`)
  .register();

// 异步转换（如需要查询数据库）
createMapperBuilder<Post, PostDTO>()
  .from(Post).to(PostDTO)
  .forMemberAsync('author', async (src) => {
    return await fetchUser(src.authorId);
  })
  .register();

// 批量映射
const dtos = factory.mapArray(users, User, UserDTO);

// 双向映射
const { toB, toA } = factory.bidirectional(UserEntity, UserDTO);
const dto = toB(entity);
const entity2 = toA(dto);
```

## 🎨 框架集成

### Vue 3

`@orika-js/vue3` 提供完整的 Vue 3 响应式系统集成：

```typescript
import { useMapper, mapToReactive, mapToComputed } from '@orika-js/vue3';

// Composition API
const { map, mapArray } = useMapper(UserEntity, UserDTO);
const userDTO = map(userEntity);

// 响应式映射
const reactiveDTO = mapToReactive(user, User, UserDTO);

// 计算属性（自动追踪依赖）
const userRef = ref(user);
const userDTO = mapToComputed(userRef, User, UserDTO);
```

**Pinia Store 集成：**

```typescript
import { createPiniaMapperPlugin } from '@orika-js/vue3';

const pinia = createPinia();
pinia.use(createPiniaMapperPlugin());

// 在 Store 中使用
export const useUserStore = defineStore('user', () => {
  const users = ref([]);
  
  async function fetchUsers() {
    const data = await api.getUsers();
    users.value = this.$mapper.mapArray(data, UserEntity, UserDTO);
  }
  
  return { users, fetchUsers };
});
```

📚 [查看 Vue 3 完整文档](./packages/vue3)

### React

`@orika-js/react` 提供全面的 Hooks、组件和 HOC：

```typescript
import { useMapper, useMemoizedMapper, MapperProvider } from '@orika-js/react';

function App() {
  return (
    <MapperProvider>
      <UserProfile />
    </MapperProvider>
  );
}

function UserProfile() {
  const [user, setUser] = useState(userEntity);
  
  // 基础映射 Hook
  const { map } = useMapper(UserEntity, UserDTO);
  const dto = map(user);
  
  // 记忆化映射（自动缓存）
  const memoizedDTO = useMemoizedMapper(user, UserEntity, UserDTO);
  
  return <div>{dto.displayName}</div>;
}
```

**声明式组件：**

```tsx
<Mapper source={user} sourceClass={UserEntity} destClass={UserDTO}>
  {(dto, isMapping, error) => (
    error ? <ErrorDisplay /> :
    isMapping ? <Loading /> :
    <UserProfile data={dto} />
  )}
</Mapper>
```

**HOC 模式：**

```typescript
const UserProfileWithMapper = withMapper({
  sourceClass: UserEntity,
  destClass: UserDTO,
  sourceProp: 'user',
  destProp: 'userDTO'
})(UserProfile);
```

📚 [查看 React 完整文档](./packages/react)

## 📚 包说明

| 包 | 版本 | 说明 |
|---|------|------|
| [@orika-js/core](./packages/core) | ![npm](https://img.shields.io/npm/v/@orika-js/core) | 核心映射引擎，零依赖 |
| [@orika-js/vue3](./packages/vue3) | ![npm](https://img.shields.io/npm/v/@orika-js/vue3) | Vue 3 适配器，支持响应式和 Pinia |
| [@orika-js/react](./packages/react) | ![npm](https://img.shields.io/npm/v/@orika-js/react) | React 适配器，提供 Hooks 和组件 |

## 🎯 实际应用场景

### 场景 1: API 数据转换

```typescript
// API 响应 → DTO → 前端展示
async function fetchUsers() {
  const response = await fetch('/api/users');
  const rawData = await response.json();
  
  // 自动排除敏感字段、格式化日期
  return factory.mapArray(rawData, UserEntity, UserDTO);
}
```

### 场景 2: 表单提交

```typescript
// 表单数据 → 请求对象 → API
function submitForm(formData: UserFormData) {
  const request = factory.map(formData, UserFormData, CreateUserRequest);
  return api.createUser(request);
}
```

### 场景 3: 分层架构

```
Controller (DTO) → Service (DO) → Repository (PO) → Database
     ↓                ↓                  ↓
  用户请求         业务逻辑           数据持久化
```

每一层都使用适合的对象模型，通过 Orika-JS 自动转换。

## 🛠 开发

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 开发模式（监听文件变化）
pnpm dev

# 运行示例
cd examples/vue3-app && pnpm dev
cd examples/react-demo && pnpm dev
```

## 📖 示例

查看 [examples](./examples) 目录获取完整示例：

- **基础示例**
  - `01-basic.ts` - 基础映射
  - `02-async.ts` - 异步映射
  - `03-collections.ts` - 集合映射
  - `04-validation.ts` - 数据验证
  - `05-advanced.ts` - 高级特性

- **框架集成**
  - `vue3-app/` - Vue 3 完整应用示例
  - `react-demo/` - React 应用示例

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT](./LICENSE) © [Steven Lee](https://github.com/stevenleep)

## 🔗 链接

- [GitHub 仓库](https://github.com/stevenleep/orika-js)
- [问题反馈](https://github.com/stevenleep/orika-js/issues)
- [变更日志](./CHANGELOG.md)
