# @orika-js/jotai

Jotai 状态管理集成，为 orika-js 提供自动对象映射功能。

## 📦 安装

```bash
npm install @orika-js/jotai @orika-js/core jotai
# 或
pnpm add @orika-js/jotai @orika-js/core jotai
```

## 🚀 快速开始

### 基础用法

```typescript
import { atom } from 'jotai';
import { mappedAtom } from '@orika-js/jotai';

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

// 创建原始 atom
const userAtom = atom<UserState>({
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
});

// 创建映射 atom
const userDTOAtom = mappedAtom(userAtom, {
  sourceClass: UserState,
  dtoClass: UserDTO
});

// 在组件中使用
function UserProfile() {
  const userDTO = useAtomValue(userDTOAtom);
  
  console.log(userDTO); // 自动映射的 DTO
  
  return <div>{userDTO.displayName}</div>;
}
```

### 可写映射 Atom

```typescript
import { mappedWritableAtom } from '@orika-js/jotai';

// 创建可写 atom
const userAtom = atom<UserState>({ id: 0, name: '', email: '' });

// 创建双向映射 atom
const userDTOAtom = mappedWritableAtom(
  userAtom,
  {
    sourceClass: UserState,
    dtoClass: UserDTO
  },
  {
    sourceClass: UserDTO,  // 反向映射
    dtoClass: UserState
  }
);

function UserEditor() {
  const [userDTO, setUserDTO] = useAtom(userDTOAtom);
  
  // 读取时：UserState -> UserDTO
  // 写入时：UserDTO -> UserState
  
  return (
    <input
      value={userDTO.displayName}
      onChange={(e) => setUserDTO({ ...userDTO, displayName: e.target.value })}
    />
  );
}
```

### 使用 Hooks

```typescript
import { useMappedAtomValue, useMappedAtom } from '@orika-js/jotai';

function UserComponent() {
  // 只读映射
  const userDTO = useMappedAtomValue(userAtom, {
    sourceClass: UserState,
    dtoClass: UserDTO
  });
  
  // 可读写映射
  const [dto, setDTO] = useMappedAtom(
    userAtom,
    { sourceClass: UserState, dtoClass: UserDTO },
    { sourceClass: UserDTO, dtoClass: UserState }
  );
  
  return <div>{userDTO.displayName}</div>;
}
```

### Atom Family

```typescript
import { atomFamily } from 'jotai/utils';
import { mappedAtomFamily } from '@orika-js/jotai';

// 创建 atom family
const userAtomFamily = atomFamily((id: number) =>
  atom<UserState>({ id, name: '', email: '' })
);

// 创建映射 atom family
const userDTOFamily = mappedAtomFamily(userAtomFamily, {
  sourceClass: UserState,
  dtoClass: UserDTO
});

function UserCard({ userId }: { userId: number }) {
  const userDTO = useAtomValue(userDTOFamily(userId));
  
  return <div>{userDTO.displayName}</div>;
}
```

### 异步 Atom

```typescript
import { asyncMappedAtom } from '@orika-js/jotai';

const asyncUserAtom = atom(async () => {
  const response = await fetch('/api/user');
  return response.json() as UserState;
});

const userDTOAtom = asyncMappedAtom(asyncUserAtom, {
  sourceClass: UserState,
  dtoClass: UserDTO
});

function AsyncUserProfile() {
  const userDTO = useAtomValue(userDTOAtom);
  // 自动处理 async 并映射
  
  return <div>{userDTO.displayName}</div>;
}
```

## 📖 API

### Atoms

#### `mappedAtom(sourceAtom, config)`
创建只读映射 atom。

**参数：**
- `sourceAtom` - 源 atom
- `config.sourceClass` - 源类型
- `config.dtoClass` - 目标 DTO 类型
- `config.mapper` - 自定义 mapper（可选）
- `config.autoMap` - 是否自动映射（默认 true）

#### `mappedWritableAtom(sourceAtom, forwardConfig, reverseConfig?)`
创建可写映射 atom，支持双向映射。

#### `mappedAtomFamily(atomFamily, config)`
创建映射 atom family。

#### `asyncMappedAtom(sourceAtom, config)`
创建异步映射 atom。

### Hooks

#### `useMappedAtomValue(sourceAtom, config)`
使用映射后的 atom 值（只读）。

#### `useMappedAtom(sourceAtom, forwardConfig, reverseConfig?)`
使用可写映射 atom。

#### `useSetMappedAtom(sourceAtom, reverseConfig)`
使用映射 atom 的 setter。

#### `useAtomWithMapper(sourceAtom, mapper)`
使用自定义 mapper 映射 atom。

#### `useDerivedMappedAtom(sourceAtom, selector, mapper)`
使用派生映射 atom。

## 🎯 使用场景

### 1. API 数据转换

```typescript
const apiUserAtom = atom(async () => {
  const response = await fetch('/api/user');
  const data = await response.json();
  return data as ApiUser;
});

const userAtom = asyncMappedAtom(apiUserAtom, {
  sourceClass: ApiUser,
  dtoClass: User
});

// 自动将 API 数据映射到应用层模型
```

### 2. 表单数据转换

```typescript
// 表单状态
const formAtom = atom<FormData>({ /* ... */ });

// 映射到提交格式
const submitDataAtom = mappedAtom(formAtom, {
  sourceClass: FormData,
  dtoClass: SubmitDTO
});

function handleSubmit() {
  const data = store.get(submitDataAtom);
  await api.post('/submit', data);
}
```

### 3. 状态派生

```typescript
const userAtom = atom<User>({ /* ... */ });

// 派生用户显示信息
const userDisplayAtom = useDerivedMappedAtom(
  userAtom,
  (user) => ({ name: user.name, avatar: user.avatar }),
  displayMapper
);
```

### 4. 多层状态映射

```typescript
const rawDataAtom = atom<RawData>({ /* ... */ });

const processedAtom = mappedAtom(rawDataAtom, {
  sourceClass: RawData,
  dtoClass: ProcessedData
});

const viewModelAtom = mappedAtom(processedAtom, {
  sourceClass: ProcessedData,
  dtoClass: ViewModel
});

// 链式映射: RawData -> ProcessedData -> ViewModel
```

## 💡 最佳实践

### 1. 类型安全

```typescript
// 使用 class 定义状态和 DTO
class UserState {
  constructor(
    public id: number,
    public name: string
  ) {}
}

class UserDTO {
  constructor(
    public userId: number,
    public displayName: string
  ) {}
}
```

### 2. 性能优化

```typescript
// 对于复杂映射，使用自定义 mapper
const optimizedMapper = createMapperBuilder(User, UserDTO)
  .mapField('id', 'userId')
  .mapField('name', 'displayName')
  .build();

const userDTOAtom = mappedAtom(userAtom, {
  sourceClass: User,
  dtoClass: UserDTO,
  mapper: optimizedMapper  // 重用 mapper
});
```

### 3. 原子化状态

```typescript
// 将大状态拆分成多个 atom
const userIdAtom = atom(0);
const userNameAtom = atom('');
const userEmailAtom = atom('');

// 组合并映射
const userAtom = atom((get) => ({
  id: get(userIdAtom),
  name: get(userNameAtom),
  email: get(userEmailAtom)
}));

const userDTOAtom = mappedAtom(userAtom, config);
```

## 🔗 相关链接

- [orika-js 核心文档](../core/README.md)
- [Jotai 官方文档](https://jotai.org/)
- [完整示例](../../examples/)

## 📄 License

MIT

