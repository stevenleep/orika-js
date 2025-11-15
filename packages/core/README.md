# @orika-js/core

<div align="center">

**轻量级、类型安全的 TypeScript 对象映射库**

[![npm version](https://img.shields.io/npm/v/@orika-js/core.svg)](https://www.npmjs.com/package/@orika-js/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)

</div>

## 📖 简介

`@orika-js/core` 是 Orika-JS 的核心映射引擎，专为 TypeScript 设计的对象转换库。它帮助你在分层架构中优雅地处理不同对象模型之间的转换（PO/DO/DTO/VO）。

**核心特性：**
- 🔒 完整的 TypeScript 类型支持
- 🎯 约定优于配置（同名字段自动映射）
- ⚡️ 高性能（映射缓存、惰性求值）
- 🔄 异步支持（原生 Promise）
- 📦 零依赖（仅 8KB gzipped）
- 🌐 支持浏览器和 Node.js

## 📦 安装

```bash
npm install @orika-js/core
# 或
pnpm add @orika-js/core
# 或
yarn add @orika-js/core
```

## 🚀 快速开始

### 基础映射

**3 步完成对象映射：**

```typescript
import { createMapperBuilder, MapperFactory } from '@orika-js/core';

// 1️⃣ 定义类
class User {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

class UserDTO {
  id: number;
  displayName: string;
  email: string;
}

// 2️⃣ 配置映射规则
createMapperBuilder<User, UserDTO>()
  .from(User)
  .to(UserDTO)
  .mapField('username', 'displayName')  // 字段重命名
  .exclude('password', 'createdAt')     // 排除字段
  .register();

// 3️⃣ 执行映射
const factory = MapperFactory.getInstance();

const user = {
  id: 1,
  username: 'Alice',
  email: 'alice@example.com',
  password: 'secret',
  createdAt: new Date()
};

const dto = factory.map(user, User, UserDTO);
// 结果: { id: 1, displayName: 'Alice', email: 'alice@example.com' }
```

### 自定义转换

```typescript
createMapperBuilder<User, UserDTO>()
  .from(User)
  .to(UserDTO)
  .forMember('age', (src) => 2024 - src.birthYear)
  .forMember('fullName', (src) => `${src.firstName} ${src.lastName}`)
  .register();
```

### 异步转换

```typescript
createMapperBuilder<Post, PostDTO>()
  .from(Post)
  .to(PostDTO)
  .forMemberAsync('author', async (src) => {
    return await fetchUser(src.authorId);
  })
  .forMemberAsync('comments', async (src) => {
    return await fetchComments(src.id);
  })
  .register();

// 使用
const dto = await factory.mapAsync(post, Post, PostDTO);
```

## 📖 API 参考

### MapperFactory

单例工厂，提供所有映射功能。

```typescript
const factory = MapperFactory.getInstance();
```

#### 基础方法

##### `map(source, sourceClass, destClass, options?)`

映射单个对象。

```typescript
const dto = factory.map(user, User, UserDTO);
```

**参数：**
- `source`: 源对象
- `sourceClass`: 源类构造函数
- `destClass`: 目标类构造函数
- `options?`: 映射选项

**返回：** 目标对象

##### `mapArray(sources, sourceClass, destClass)`

批量映射数组。

```typescript
const dtos = factory.mapArray(users, User, UserDTO);
```

##### `mapAsync(source, sourceClass, destClass, options?)`

异步映射（支持异步转换器）。

```typescript
const dto = await factory.mapAsync(post, Post, PostDTO);
```

##### `mapArrayAsync(sources, sourceClass, destClass)`

批量异步映射。

```typescript
const dtos = await factory.mapArrayAsync(posts, Post, PostDTO);
```

#### 高级方法

##### `mapChain(source, classA, classB, classC)`

链式映射（A → B → C）。

```typescript
// Entity → DTO → ViewModel
const viewModel = factory.mapChain(entity, UserEntity, UserDTO, UserViewModel);
```

##### `merge(updates, existing, sourceClass, destClass)`

合并映射（只更新变化的字段）。

```typescript
const formUpdates = { displayName: 'Bob' };
const existing = { id: 1, displayName: 'Alice', email: 'alice@example.com' };

const merged = factory.merge(formUpdates, existing, UserDTO, UserDTO);
// 结果: { id: 1, displayName: 'Bob', email: 'alice@example.com' }
```

##### `bidirectional(classA, classB)`

获取双向映射函数。

```typescript
const { toB, toA } = factory.bidirectional(UserEntity, UserDTO);

const dto = toB(entity);      // Entity → DTO
const entity = toA(dto);       // DTO → Entity
```

### MapperConfigBuilder

用于配置映射规则的构建器。

```typescript
createMapperBuilder<Source, Dest>()
  .from(SourceClass)
  .to(DestClass)
  // ... 配置方法
  .register();
```

#### 配置方法

##### `mapField(sourceField, destField)`

字段重命名。

```typescript
.mapField('username', 'displayName')
.mapField('createdAt', 'createTime')
```

##### `forMember(destField, converter)`

自定义字段转换。

```typescript
.forMember('age', (src) => 2024 - src.birthYear)
.forMember('status', (src) => src.isActive ? 'active' : 'inactive')
```

##### `forMemberAsync(destField, asyncConverter)`

异步字段转换。

```typescript
.forMemberAsync('author', async (src) => {
  return await fetchUser(src.authorId);
})
```

##### `exclude(...fields)`

排除字段。

```typescript
.exclude('password', 'salt', 'internalId')
```

##### `mapFieldWhen(sourceField, destField, condition, converter?)`

条件字段映射。

```typescript
.mapFieldWhen('price', 'discountPrice', 
  (src) => src.hasDiscount,
  (src) => src.price * 0.8
)
```

##### `validate(validator)`

添加验证器。

```typescript
.validate((src, dest) => {
  if (!dest.email.includes('@')) {
    throw new Error('Invalid email format');
  }
})
```

##### `beforeMap(hook)`

映射前钩子。

```typescript
.beforeMap((src, context) => {
  console.log('开始映射:', src);
})
```

##### `afterMap(hook)`

映射后钩子。

```typescript
.afterMap((dest, context) => {
  console.log('映射完成:', dest);
})
```

### 映射选项

```typescript
interface MappingOptions {
  pick?: string[];              // 只映射这些字段
  omit?: string[];              // 跳过这些字段
  merge?: boolean;              // 合并到现有对象
  includeSymbols?: boolean;     // 包含 Symbol 属性
  includeInherited?: boolean;   // 包含继承的属性
}

// 使用
const dto = factory.map(user, User, UserDTO, {
  pick: ['id', 'username'],     // 只映射 id 和 username
  omit: ['password']            // 跳过 password
});
```

## 🎯 常见用例

### 1. 字段重命名

```typescript
createMapperBuilder<User, UserDTO>()
  .from(User).to(UserDTO)
  .mapField('username', 'displayName')
  .mapField('createdAt', 'createTime')
  .register();
```

### 2. 字段计算

```typescript
createMapperBuilder<User, UserDTO>()
  .from(User).to(UserDTO)
  .forMember('age', (src) => 2024 - src.birthYear)
  .forMember('fullName', (src) => `${src.firstName} ${src.lastName}`)
  .register();
```

### 3. 嵌套对象映射

```typescript
class Order {
  id: number;
  user: User;
  items: Product[];
}

class OrderDTO {
  id: number;
  user: UserDTO;
  items: ProductDTO[];
}

createMapperBuilder<Order, OrderDTO>()
  .from(Order).to(OrderDTO)
  .forMember('user', (src) => factory.map(src.user, User, UserDTO))
  .forMember('items', (src) => factory.mapArray(src.items, Product, ProductDTO))
  .register();
```

### 4. 异步数据获取

```typescript
createMapperBuilder<Post, PostDTO>()
  .from(Post).to(PostDTO)
  .forMemberAsync('author', async (src) => {
    const user = await api.getUser(src.authorId);
    return factory.map(user, User, UserDTO);
  })
  .register();

// 使用
const dto = await factory.mapAsync(post, Post, PostDTO);
```

### 5. 条件映射

```typescript
createMapperBuilder<Product, ProductDTO>()
  .from(Product).to(ProductDTO)
  .mapFieldWhen('price', 'discountPrice',
    (src) => src.onSale,              // 条件：是否促销
    (src) => src.price * 0.8          // 转换：打8折
  )
  .register();
```

### 6. 数据验证

```typescript
createMapperBuilder<User, UserDTO>()
  .from(User).to(UserDTO)
  .validate((src, dest) => {
    if (!dest.email.includes('@')) {
      throw new Error('Invalid email');
    }
    if (dest.displayName.length < 2) {
      throw new Error('Name too short');
    }
  })
  .register();
```

### 7. 双向映射

```typescript
// Entity → DTO
createMapperBuilder<UserEntity, UserDTO>()
  .from(UserEntity).to(UserDTO)
  .mapField('username', 'displayName')
  .exclude('password')
  .register();

// DTO → Entity（反向映射）
createMapperBuilder<UserDTO, UserEntity>()
  .from(UserDTO).to(UserEntity)
  .mapField('displayName', 'username')
  .forMember('password', () => '')  // 默认值
  .register();

// 使用
const { toB, toA } = factory.bidirectional(UserEntity, UserDTO);
const dto = toB(entity);
const entity2 = toA(dto);
```

### 8. 集合类型支持

```typescript
createMapperBuilder<User, UserDTO>()
  .from(User).to(UserDTO)
  .forMember('tags', (src) => new Set(src.tags))
  .forMember('metadata', (src) => new Map(Object.entries(src.metadata)))
  .register();
```

## 🔧 高级特性

### 映射统计

```typescript
// 启用统计
factory.enableStatistics(true);

// 执行一些映射
factory.map(user1, User, UserDTO);
factory.map(user2, User, UserDTO);

// 获取统计信息
const stats = factory.getStats(User, UserDTO);
console.log({
  totalMappings: stats.totalMappings,
  averageTime: stats.averageTime,
  lastMappingTime: stats.lastMappingTime
});
```

### 映射缓存

```typescript
// 缓存会自动启用，重复映射相同对象会返回缓存结果
const dto1 = factory.map(user, User, UserDTO);
const dto2 = factory.map(user, User, UserDTO);  // 返回缓存的结果

// 清除缓存
factory.clearCache();
```

### 自定义转换器

```typescript
import { Converter, ConverterRegistry } from '@orika-js/core';

// 定义转换器
class DateToStringConverter implements Converter<Date, string> {
  convert(source: Date): string {
    return source.toISOString();
  }
}

// 注册转换器
ConverterRegistry.getInstance().register(Date, String, new DateToStringConverter());

// 使用（自动应用）
const dto = factory.map(entity, Entity, DTO);  // Date 字段自动转换为 string
```

### 批量处理

```typescript
import { BatchProcessor } from '@orika-js/core';

const processor = new BatchProcessor({
  batchSize: 100,
  concurrency: 4
});

const dtos = await processor.processBatch(
  largeUserArray,
  (batch) => factory.mapArray(batch, User, UserDTO),
  {
    onProgress: (percent) => console.log(`${percent}%`),
    onError: (err) => console.error('批处理错误:', err)
  }
);
```

## 💡 最佳实践

### 1. 全局配置映射规则

```typescript
// config/mappings.ts
import { createMapperBuilder } from '@orika-js/core';

// 集中配置所有映射规则
export function configureMappings() {
  // User 映射
  createMapperBuilder<UserEntity, UserDTO>()
    .from(UserEntity).to(UserDTO)
    .mapField('username', 'displayName')
    .exclude('password')
    .register();
  
  // Post 映射
  createMapperBuilder<PostEntity, PostDTO>()
    .from(PostEntity).to(PostDTO)
    .forMemberAsync('author', async (src) => await fetchUser(src.authorId))
    .register();
  
  // ... 更多映射
}

// main.ts
import { configureMappings } from './config/mappings';
configureMappings();
```

### 2. 类型安全的映射

```typescript
// ✅ 推荐：使用泛型确保类型安全
const dto = factory.map<User, UserDTO>(user, User, UserDTO);
//    ^? UserDTO

// ❌ 避免：丢失类型信息
const dto = factory.map(user, User, UserDTO) as any;
```

### 3. 错误处理

```typescript
try {
  const dto = factory.map(user, User, UserDTO);
} catch (error) {
  if (error instanceof MappingError) {
    console.error('映射失败:', error.message);
    // 处理映射错误
  }
}
```

### 4. 性能优化

```typescript
// ✅ 批量映射大数组
const dtos = factory.mapArray(users, User, UserDTO);

// ❌ 避免循环中单独映射
users.forEach(user => {
  const dto = factory.map(user, User, UserDTO);  // 性能差
});

// ✅ 启用缓存和统计
factory.enableStatistics(true);
```

## 🌐 浏览器支持

`@orika-js/core` 完全支持浏览器环境，无需任何 polyfill。

```html
<script type="module">
  import { createMapperBuilder, MapperFactory } from 'https://esm.sh/@orika-js/core';
  
  // 配置和使用
</script>
```

## 🧪 测试

```typescript
import { MapperFactory, createMapperBuilder } from '@orika-js/core';

describe('User mapping', () => {
  beforeAll(() => {
    createMapperBuilder<User, UserDTO>()
      .from(User).to(UserDTO)
      .mapField('username', 'displayName')
      .register();
  });
  
  it('should map user to DTO', () => {
    const factory = MapperFactory.getInstance();
    const user = { id: 1, username: 'Alice', password: 'secret' };
    const dto = factory.map(user, User, UserDTO);
    
    expect(dto.displayName).toBe('Alice');
    expect(dto).not.toHaveProperty('password');
  });
});
```

## 📦 包大小

- 核心代码：~20KB (minified)
- Gzipped：~8KB
- 零运行时依赖
- 支持 Tree-shaking

## 🤝 框架集成

`@orika-js/core` 可以独立使用，也可以与框架适配器一起使用：

- **[@orika-js/vue3](../vue3)** - Vue 3 响应式映射
- **[@orika-js/react](../react)** - React Hooks 和组件

## 🔗 相关链接

- [GitHub 仓库](https://github.com/stevenleep/orika-js)
- [问题反馈](https://github.com/stevenleep/orika-js/issues)
- [更新日志](https://github.com/stevenleep/orika-js/blob/main/CHANGELOG.md)
- [示例代码](../../examples)

## 📄 许可证

[MIT](../../LICENSE) © [Steven Lee](https://github.com/stevenleep)
