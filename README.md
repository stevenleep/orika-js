# Orika-JS

<div align="center">

**TypeScript 对象映射库**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

[English](./README.en.md) | 简体中文

</div>

## 简介

Orika-JS 是一个类型安全的对象映射库，用于简化不同数据模型之间的转换（Entity/DTO/VO）。灵感来自 Java 的 Orika 框架。

## 特性

- **类型安全** - 完整的 TypeScript 类型推导和编译时检查
- **自动映射** - 同名字段自动映射，零配置即可使用
- **异步支持** - 支持异步转换器和并发控制
- **框架适配** - 提供 Vue 3 / React 适配器
- **轻量级** - 零运行时依赖，支持 Tree-shaking

## 安装

```bash
# 核心库
npm install @orika-js/core

# Vue 3
npm install @orika-js/vue3

# Pinia (Vue 3 状态管理)
npm install @orika-js/pinia

# React
npm install @orika-js/react
```

## 快速开始

```typescript
import { createMapperBuilder, MapperFactory } from '@orika-js/core';

// 定义模型
class UserEntity {
  id: number;
  username: string;
  password: string;
  email: string;
}

class UserDTO {
  id: number;
  displayName: string;
  email: string;
}

// 配置映射
createMapperBuilder<UserEntity, UserDTO>()
  .from(UserEntity).to(UserDTO)
  .mapField('username', 'displayName')
  .exclude('password')
  .register();

// 执行映射
const factory = MapperFactory.getInstance();
const dto = factory.map(userEntity, UserEntity, UserDTO);

// 批量映射
const dtos = factory.mapArray(users, UserEntity, UserDTO);

// 自定义转换
createMapperBuilder<User, UserDTO>()
  .from(User).to(UserDTO)
  .forMember('age', (src) => new Date().getFullYear() - src.birthYear)
  .forMemberAsync('author', async (src) => await fetchUser(src.authorId))
  .register();
```

## 框架集成

### Vue 3

```typescript
import { useMapper, mapToReactive, mapToComputed } from '@orika-js/vue3';

const { map, mapArray } = useMapper(UserEntity, UserDTO);
const reactiveDTO = mapToReactive(user, User, UserDTO);
const computedDTO = mapToComputed(userRef, User, UserDTO);
```

[完整文档](./packages/vue3) · [示例](./examples/vue3-app)

### Pinia

```typescript
import { createPinia } from 'pinia';
import { createPiniaMapperPlugin } from '@orika-js/pinia';

// 添加映射插件到 Pinia
const pinia = createPinia();
pinia.use(createPiniaMapperPlugin());

// 在 store 中使用
const userStore = defineStore('user', {
  actions: {
    async fetchUsers() {
      const dtos = await api.getUsers();
      this.users = this.$mapper.mapArray(dtos, UserDTO, User);
    }
  }
});
```

[完整文档](./packages/pinia) · [示例](./examples/pinia-integration)

### React

```typescript
import { useMapper, useMemoizedMapper, MapperProvider, Mapper, withMapper } from '@orika-js/react';

const { map } = useMapper(UserEntity, UserDTO);
const dto = useMemoizedMapper(user, UserEntity, UserDTO);

// 组件
<Mapper source={user} sourceClass={UserEntity} destClass={UserDTO}>
  {(dto) => <div>{dto.displayName}</div>}
</Mapper>

// HOC
const Enhanced = withMapper({ sourceClass: UserEntity, destClass: UserDTO })(Component);
```

[完整文档](./packages/react) · [示例](./examples/react-demo)

## 包说明

| 包 | 说明 |
|---|------|
| [@orika-js/core](./packages/core) | 核心映射引擎，零依赖 |
| [@orika-js/vue3](./packages/vue3) | Vue 3 Composition API 适配器 |
| [@orika-js/pinia](./packages/pinia) | Pinia 状态管理适配器 |
| [@orika-js/react](./packages/react) | React Hooks 适配器 |

## 开发

```bash
pnpm install  # 安装
pnpm build    # 构建
pnpm dev      # 开发
```

查看 [examples](./examples) 目录获取更多示例。

## 许可证

[MIT](./LICENSE) · [GitHub](https://github.com/stevenleep/orika-js) · [Issues](https://github.com/stevenleep/orika-js/issues)
