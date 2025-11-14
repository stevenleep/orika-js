# @orika-js/core

TypeScript object mapping library for PO/DTO/VO transformations.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/@orika-js/core.svg)](https://www.npmjs.com/package/@orika-js/core)

## Installation

```bash
npm install @orika-js/core
# or
pnpm add @orika-js/core
# or
yarn add @orika-js/core
```

## Quick Start

**Step 1: Define your classes**

```typescript
class User {
  id: number;
  username: string;
  email: string;
  password: string;
}

class UserDTO {
  id: number;
  fullName: string;
  email: string;
}
```

**Step 2: Configure mapping**

```typescript
import { createMapperBuilder } from '@orika-js/core';

createMapperBuilder<User, UserDTO>()
  .from(User)
  .to(UserDTO)
  .mapField('username', 'fullName')  // username → fullName
  .exclude('password')                // Don't map password
  .register();
```

**Step 3: Map objects**

```typescript
import { MapperFactory } from '@orika-js/core';

const factory = MapperFactory.getInstance();

const user = new User();
user.id = 1;
user.username = 'Alice';
user.email = 'alice@example.com';
user.password = 'secret';

const dto = factory.map(user, User, UserDTO);
// Result: { id: 1, fullName: 'Alice', email: 'alice@example.com' }
```

That's it! 🎉

## Key Features

| Feature | Description |
|---------|-------------|
| Type Safe | Full TypeScript generics support |
| Auto Mapping | Same-name fields mapped automatically |
| Async | `mapAsync` with parallel processing |
| Collections | Map, Set, Array support |
| Validation | Built-in validation hooks |
| Flexible | Custom converters, hooks, conditions |

## Common Use Cases

```typescript
// 1. Field renaming
.mapField('username', 'fullName')

// 2. Custom transformation
.forMember('age', (s) => 2024 - s.birthYear)

// 3. Async data fetching
.forMemberAsync('author', async (s) => await fetchUser(s.authorId))

// 4. Exclude sensitive fields
.exclude('password', 'salt')

// 5. Array mapping
factory.mapArray(users, User, UserDTO)

// 6. Validation
.validate((s, d) => {
  if (!d.email.includes('@')) throw new Error('Invalid email');
})
```

## API Reference

### MapperFactory

```typescript
const factory = MapperFactory.getInstance();

factory.map(source, S, D, options?)
factory.mapArray(sources, S, D)
factory.mapChain(source, A, B, C)
factory.merge(updates, existing, S, D)

await factory.mapAsync(source, S, D)
await factory.mapArrayAsync(sources, S, D)
```

### Options

```typescript
{
  pick: ['id', 'name'],      // Only map these
  omit: ['password'],        // Skip these
  merge: true,               // Don't overwrite existing
  includeSymbols: true,      // Include Symbol properties
  includeInherited: true,    // Include parent class properties
}
```

### Advanced

```typescript
// Conditional
.mapFieldWhen('field', 'dest', condition, converter)

// Bidirectional
factory.bidirectional(A, B)

// Statistics
factory.enableStatistics(true)
factory.getStats(S, D)
```

## Framework Adapters

**Vue 3 Adapter**

```bash
npm install @orika-js/vue3
```

Vue 3 adapter provides reactive mapping utilities:

```typescript
import { useMapper, mapToReactive } from '@orika-js/vue3';

const { map, mapToReactive, mapArray } = useMapper(User, UserDTO);
const reactiveDTO = mapToReactive(user);
```

See [@orika-js/vue3](../vue3) for more details.

## Web Support 🌐

@orika-js/core fully supports browser environments!

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Run examples
pnpm run example:01  # 基础示例
pnpm run example:web # Web 示例
```

## License

MIT
