# @orika-js/react

<div align="center">

**React 适配器 - 为 Orika-JS 提供 Hooks、组件和 HOC**

[![npm version](https://img.shields.io/npm/v/@orika-js/react.svg)](https://www.npmjs.com/package/@orika-js/react)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)

</div>

## 📦 安装

```bash
npm install @orika-js/core @orika-js/react
# 或
pnpm add @orika-js/core @orika-js/react
# 或
yarn add @orika-js/core @orika-js/react
```

## ✨ 特性

- ✅ **React Hooks** - 完整的 Hooks 集合（useMapper、useMemoizedMapper 等）
- ✅ **声明式组件** - Mapper、MapperList 等 JSX 组件
- ✅ **HOC 模式** - withMapper、withBidirectionalMapper 等高阶组件
- ✅ **React 18 支持** - useTransition、Suspense 等新特性
- ✅ **TypeScript** - 完整的类型推导和类型安全
- ✅ **性能优化** - 内置缓存、记忆化、批量处理
- ✅ **零额外依赖** - 只依赖 react 和 @orika-js/core

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

### 2. 使用 MapperProvider（推荐）

```tsx
import { MapperProvider } from '@orika-js/react';

function App() {
  return (
    <MapperProvider>
      <UserProfile />
    </MapperProvider>
  );
}
```

### 3. 在组件中使用 Hooks

```tsx
import { useMapper, useMemoizedMapper } from '@orika-js/react';

function UserProfile() {
  const [user, setUser] = useState<UserEntity>(/* ... */);
  
  // 基础映射
  const { map } = useMapper(UserEntity, UserDTO);
  const dto = map(user);
  
  // 或使用记忆化映射（推荐）
  const memoizedDTO = useMemoizedMapper(user, UserEntity, UserDTO);
  
  return (
    <div>
      <h1>{memoizedDTO?.displayName}</h1>
      <p>{memoizedDTO?.email}</p>
    </div>
  );
}
```

## 📖 API 文档

### Hooks

#### `useMapper(sourceClass, destClass, options?)`

基础映射 Hook，提供映射函数和状态。

```typescript
const { 
  map,         // 映射单个对象
  mapArray,    // 映射数组
  isMapping,   // 是否正在映射
  error        // 错误信息
} = useMapper(UserEntity, UserDTO);

const dto = map(user);
const dtos = mapArray(users);
```

#### `useMemoizedMapper(source, sourceClass, destClass, deps?)`

记忆化映射，自动缓存结果，只在依赖变化时重新计算。

```typescript
// 自动缓存，性能最优
const userDTO = useMemoizedMapper(user, UserEntity, UserDTO);

// 自定义依赖
const userDTO = useMemoizedMapper(user, UserEntity, UserDTO, [user.id]);
```

#### `useBidirectionalMapper(classA, classB, options?)`

双向映射 Hook，提供 A→B 和 B→A 的转换函数。

```typescript
const { toB, toA } = useBidirectionalMapper(UserEntity, UserDTO);

const dto = toB(entity);      // Entity → DTO
const entity = toA(dto);       // DTO → Entity
```

#### `useMapperDiff()`

差异检测 Hook，比较两个对象的变化。

```typescript
const { diff, hasChanges } = useMapperDiff<UserEntity>();

const changes = diff(originalUser, updatedUser);
if (hasChanges(changes)) {
  console.log('变更的字段:', Object.keys(changes));
}
```

#### `useAsyncMapper(sourceClass, destClass, options?)`

异步映射 Hook，支持异步转换器。

```typescript
const { 
  mapAsync, 
  mapArrayAsync, 
  isLoading, 
  error 
} = useAsyncMapper(Post, PostDTO);

const dto = await mapAsync(post);
```

#### `useBatchMapper(sourceClass, destClass, options?)`

批量映射 Hook，支持大数据量处理和进度追踪。

```typescript
const { mapBatch, progress, isPending } = useBatchMapper(User, UserDTO);

const dtos = await mapBatch(largeUserArray, {
  batchSize: 100,
  onProgress: (percent) => console.log(`${percent}%`)
});
```

#### `useMapperChain()`

链式映射 Hook，支持多步转换（A → B → C）。

```typescript
const { mapChain } = useMapperChain();

// Entity → DTO → ViewModel
const viewModel = mapChain(entity, UserEntity, UserDTO, UserViewModel);
```

#### `useMergeMapper(sourceClass, destClass, options?)`

合并映射 Hook，将部分更新合并到现有对象。

```typescript
const { merge } = useMergeMapper(UserDTO, UserEntity);

// 只更新变化的字段
const updated = merge(formChanges, existingUser);
```

#### `useMapperStats(sourceClass, destClass)`

性能统计 Hook，监控映射性能指标。

```typescript
const { stats, refreshStats } = useMapperStats(User, UserDTO);

// stats: { totalMappings, averageTime, lastMappingTime }
```

#### `useMapperCallback(sourceClass, destClass, callback, deps)`

映射回调 Hook，类似 useCallback 但包含映射逻辑。

```typescript
const handleMap = useMapperCallback(
  User, 
  UserDTO,
  (user) => {
    const dto = factory.map(user, User, UserDTO);
    console.log('Mapped:', dto);
    return dto;
  },
  []
);
```

#### `useConditionalMapper(sourceClass, destClass, condition)`

条件映射 Hook，根据条件决定是否执行映射。

```typescript
const { map } = useConditionalMapper(
  User, 
  UserDTO, 
  (user) => user.isActive  // 只映射活跃用户
);
```

#### `useTransitionMapper(sourceClass, destClass)` 

React 18 过渡映射 Hook，使用 useTransition 优化性能。

```typescript
const { mapWithTransition, isPending } = useTransitionMapper(User, UserDTO);

// 标记为低优先级，不阻塞 UI
const dto = mapWithTransition(user);
```

#### `useDeferredMapper(source, sourceClass, destClass)`

React 18 延迟映射 Hook，使用 useDeferredValue。

```typescript
const deferredDTO = useDeferredMapper(user, User, UserDTO);
// 延迟更新，优先响应用户交互
```

### 组件

#### `<Mapper>`

Render Props 模式的映射组件。

```tsx
<Mapper 
  source={user} 
  sourceClass={UserEntity} 
  destClass={UserDTO}
  fallback={<Error />}
>
  {(dto, isMapping, error) => (
    error ? <ErrorDisplay error={error} /> :
    isMapping ? <Loading /> :
    <UserProfile data={dto} />
  )}
</Mapper>
```

**Props:**
- `source`: 源对象或数组
- `sourceClass`: 源类
- `destClass`: 目标类
- `options?`: 映射选项
- `fallback?`: 错误时的回退组件
- `children`: Render function

#### `<AsyncMapper>`

异步映射组件，配合 Suspense 使用。

```tsx
<Suspense fallback={<Loading />}>
  <AsyncMapper 
    source={post} 
    sourceClass={Post} 
    destClass={PostDTO}
  >
    {(dto) => <PostDetail data={dto} />}
  </AsyncMapper>
</Suspense>
```

#### `<MapperList>`

列表映射组件，自动渲染映射后的数组。

```tsx
<MapperList
  sources={users}
  sourceClass={UserEntity}
  destClass={UserDTO}
  renderItem={(dto, index) => (
    <UserCard key={dto.id} user={dto} />
  )}
  keyExtractor={(dto) => dto.id}
  emptyComponent={<EmptyState />}
/>
```

### HOC (高阶组件)

#### `withMapper(config)`

自动映射 props 的 HOC。

```typescript
const UserProfileWithMapper = withMapper({
  sourceClass: UserEntity,
  destClass: UserDTO,
  sourceProp: 'user',      // 输入 prop 名称
  destProp: 'userDTO',     // 输出 prop 名称
  isArray: false           // 是否数组映射
})(UserProfile);

// 使用
<UserProfileWithMapper user={userEntity} />
// UserProfile 会收到 userDTO prop
```

#### `withBidirectionalMapper(config)`

提供双向映射的 HOC。

```typescript
const UserFormWithMapper = withBidirectionalMapper({
  classA: UserEntity,
  classB: UserDTO,
  mapperProp: 'mapper'
})(UserForm);

// UserForm 会收到 mapper.toB 和 mapper.toA
```

#### `withAutoMapper(configs)`

自动映射多个 props 的 HOC。

```typescript
const ComplexComponent = withAutoMapper([
  { sourceClass: UserEntity, destClass: UserDTO, sourceProp: 'user', destProp: 'userDTO' },
  { sourceClass: PostEntity, destClass: PostDTO, sourceProp: 'post', destProp: 'postDTO' }
])(Component);

// 同时映射多个 props
<ComplexComponent user={userEntity} post={postEntity} />
```

### Provider

#### `<MapperProvider>`

提供映射上下文，推荐包裹整个应用。

```tsx
import { MapperProvider } from '@orika-js/react';

function App() {
  return (
    <MapperProvider>
      {/* 你的应用 */}
    </MapperProvider>
  );
}
```

## 🎯 实际应用场景

### 场景 1: 表单编辑

```tsx
function UserEditForm({ user }: { user: UserEntity }) {
  const { toB, toA } = useBidirectionalMapper(UserEntity, UserDTO);
  const { diff, hasChanges } = useMapperDiff<UserEntity>();
  
  const [formData, setFormData] = useState(() => toB(user));
  
  const handleSubmit = () => {
    const updatedEntity = toA(formData);
    const changes = diff(user, updatedEntity);
    
    if (hasChanges(changes)) {
      api.updateUser(updatedEntity, changes);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.displayName}
        onChange={e => setFormData({ ...formData, displayName: e.target.value })}
      />
      <button type="submit">保存</button>
    </form>
  );
}
```

### 场景 2: 列表渲染

```tsx
function UserList({ users }: { users: UserEntity[] }) {
  return (
    <MapperList
      sources={users}
      sourceClass={UserEntity}
      destClass={UserDTO}
      renderItem={(dto) => (
        <div key={dto.id}>
          <h3>{dto.displayName}</h3>
          <p>{dto.email}</p>
        </div>
      )}
      keyExtractor={(dto) => dto.id}
      emptyComponent={<div>暂无用户</div>}
    />
  );
}
```

### 场景 3: 异步数据加载

```tsx
function UserDetail({ userId }: { userId: number }) {
  const [user, setUser] = useState<UserEntity | null>(null);
  const { mapAsync, isLoading, error } = useAsyncMapper(UserEntity, UserDTO);
  const [dto, setDto] = useState<UserDTO | null>(null);
  
  useEffect(() => {
    async function loadUser() {
      const userData = await api.getUser(userId);
      setUser(userData);
      const mappedDto = await mapAsync(userData);
      setDto(mappedDto);
    }
    loadUser();
  }, [userId]);
  
  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  if (!dto) return null;
  
  return <UserProfile data={dto} />;
}
```

### 场景 4: 大数据量处理

```tsx
function BulkImport({ data }: { data: UserEntity[] }) {
  const { mapBatch, progress, isPending } = useBatchMapper(UserEntity, UserDTO);
  const [result, setResult] = useState<UserDTO[]>([]);
  
  const handleImport = async () => {
    const dtos = await mapBatch(data, {
      batchSize: 100,
      onProgress: (percent) => {
        console.log(`处理进度: ${percent}%`);
      }
    });
    setResult(dtos);
  };
  
  return (
    <div>
      <button onClick={handleImport} disabled={isPending}>
        导入 {data.length} 条数据
      </button>
      {isPending && <ProgressBar value={progress} />}
      {result.length > 0 && <div>成功导入 {result.length} 条</div>}
    </div>
  );
}
```

## 💡 最佳实践

### 1. 使用 MapperProvider

```tsx
// ✅ 推荐：包裹整个应用
<MapperProvider>
  <App />
</MapperProvider>

// ❌ 不推荐：不使用 Provider（仍然可用，但缺少上下文）
```

### 2. 选择合适的 Hook

```tsx
// ✅ 静态数据：使用 useMemoizedMapper
const dto = useMemoizedMapper(user, User, UserDTO);

// ✅ 频繁变化：使用 useMapper
const { map } = useMapper(User, UserDTO);
const dto = useMemo(() => map(user), [user]);

// ✅ 异步转换：使用 useAsyncMapper
const { mapAsync } = useAsyncMapper(Post, PostDTO);
```

### 3. 性能优化

```tsx
// ✅ 对于大列表，使用批量处理
const { mapBatch } = useBatchMapper(User, UserDTO);
const dtos = await mapBatch(largeArray, { batchSize: 50 });

// ❌ 避免在循环中单独映射
users.forEach(user => map(user));  // 性能差
```

### 4. 错误处理

```tsx
const { map, error } = useMapper(User, UserDTO);

if (error) {
  return <ErrorBoundary error={error} />;
}
```

## 🔧 TypeScript 支持

完整的类型推导和类型安全：

```typescript
// 类型会自动推导
const dto = useMemoizedMapper(user, UserEntity, UserDTO);
//    ^? UserDTO | null

// 泛型支持
const { map } = useMapper<UserEntity, UserDTO>(UserEntity, UserDTO);
const dto = map(user);
//    ^? UserDTO
```

## 🤝 兼容性

- React 16.8+ (Hooks 支持)
- React 17.x
- React 18.x（支持 useTransition、useDeferredValue 等新特性）
- @orika-js/core ^1.2.0
- TypeScript 5.0+
- Node.js 16+

## 📦 包大小

- 核心代码：~15KB (gzipped: ~5KB)
- 零运行时依赖（仅 peer dependencies: react、@orika-js/core）
- 支持 Tree-shaking

## 📄 许可证

[MIT](../../LICENSE) © [Steven Lee](https://github.com/stevenleep)

## 🔗 相关链接

- [@orika-js/core 核心库](../core)
- [@orika-js/vue3 Vue 3 适配器](../vue3)
- [GitHub 仓库](https://github.com/stevenleep/orika-js)
- [问题反馈](https://github.com/stevenleep/orika-js/issues)
- [示例代码](../../examples/react-demo)

