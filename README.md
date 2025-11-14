# orika-js

TypeScript 对象映射库 - 实现 DTO/VO/PO/DO 等分层架构中的对象转换

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> 灵感源自 Java 的 [Orika](https://orika-mapper.github.io/orika-docs/)、[MapStruct](https://mapstruct.org/) 和 .NET 的 [AutoMapper](https://automapper.org/)

## 为什么需要对象映射？

现代软件架构中，分层设计是最佳实践。不同层级使用不同的对象模型，需要频繁的数据转换：

- **表现层 (Presentation Layer)**：VO (View Object) / DTO (Data Transfer Object)
- **业务层 (Business Layer)**：DO (Domain Object) / BO (Business Object)
- **持久层 (Persistence Layer)**：PO (Persistent Object) / Entity

典型的转换场景：

```
Controller  →  Service     →  Repository  →  Database
   DTO      →    DO        →     PO       →  Table Record
```

传统做法是手写转换代码，存在诸多问题：
- 大量样板代码，维护成本高
- 字段遗漏、类型错误难以发现
- 模型变更后需要同步修改多处代码

**orika-js** 采用声明式映射配置，一次定义，全局复用。

## 核心特性

| 特性 | 说明 |
|------|------|
| **类型安全** | 完整的 TypeScript 泛型支持，编译时类型检查和智能提示 |
| **约定优于配置** | 同名字段自动映射，遵循 Convention over Configuration 原则 |
| **异步支持** | 原生支持异步转换器、批量映射和并发控制 |
| **灵活配置** | 字段重命名、嵌套映射、条件转换、自定义转换器、映射拦截器 |
| **框架集成** | Vue 3 响应式映射、Pinia 状态管理插件 |
| **零依赖** | 核心库无运行时依赖，支持 Tree-shaking |
| **性能优化** | 映射结果缓存、惰性求值、批量处理优化 |

## 安装

```bash
# 核心库
npm install @orika-js/core

# Vue 3 项目
npm install @orika-js/core @orika-js/vue3
```

## 快速开始

**3 步完成对象映射：**

```typescript
import { createMapperBuilder, MapperFactory } from '@orika-js/core';

// 第 1 步：定义领域模型和 DTO
class UserEntity {
  id: number;
  username: string;
  password: string;     // 敏感字段
  email: string;
  createdAt: Date;
}

class UserDTO {
  id: number;
  displayName: string;  // 字段重命名
  email: string;        // 同名字段自动映射
}

// 第 2 步：配置映射规则（配置一次，全局可用）
createMapperBuilder<UserEntity, UserDTO>()
  .from(UserEntity).to(UserDTO)
  .mapField('username', 'displayName')  // 字段重命名
  .exclude('password', 'createdAt')     // 排除敏感或不需要的字段
  .register();

// 第 3 步：执行映射
const factory = MapperFactory.getInstance();
const entity = { 
  id: 1, 
  username: 'Alice', 
  password: 'secret123',
  email: 'alice@example.com',
  createdAt: new Date()
};

const dto = factory.map(entity, UserEntity, UserDTO);
// => { id: 1, displayName: 'Alice', email: 'alice@example.com' }
```

## Vue 3 集成

`@orika-js/vue3` 提供了 Vue 3 响应式系统的集成：

```typescript
import { useMapper, mapToReactive, mapToComputed } from '@orika-js/vue3';

// Composition API 中使用
const { map, mapArray } = useMapper(UserEntity, UserDTO);
const userDTO = map(userEntity);           // Entity -> DTO
const userList = mapArray(entityList);     // 批量转换

// 响应式映射（自动追踪依赖）
const reactiveDTO = mapToReactive(userEntity, UserEntity, UserDTO);

// 计算属性映射
const userDTO = mapToComputed(userRef, UserEntity, UserDTO);

// Pinia Store 集成
import { createPinia } from 'pinia';
import { createMapperPlugin } from '@orika-js/vue3';

const pinia = createPinia();
pinia.use(createMapperPlugin());  // 在 Store 中直接使用映射功能
```

更多高级用法请查看 [@orika-js/vue3 文档](./packages/vue3)

## 更多示例

查看 [examples](./examples) 目录获取更多使用示例：

## License

MIT © [Steven Lee](https://github.com/stevenleep)
