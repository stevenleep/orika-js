# Orika-JS

<div align="center">

**Type-Safe Object Mapping Library for TypeScript**

[![npm version](https://img.shields.io/npm/v/@orika-js/core.svg)](https://www.npmjs.com/package/@orika-js/core)
[![npm downloads](https://img.shields.io/npm/dm/@orika-js/core.svg)](https://www.npmjs.com/package/@orika-js/core)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[English](./README.en.md) | [简体中文](./README.md)

</div>

## Introduction

Orika-JS is an object mapping library designed for TypeScript, enabling elegant transformations between Entity, DTO, and VO in layered architectures.

### Key Features

- **Type Safety** - Complete TypeScript type inference and compile-time checking
- **Convention Over Configuration** - Automatic mapping for same-name fields, zero configuration required
- **High Performance** - Smart caching, batch processing, and lazy evaluation
- **Async Support** - Native Promise support for async field transformations
- **Framework Integration** - Deep integration with React, Vue 3, Zustand, Jotai, and Pinia
- **Lightweight** - Zero runtime dependencies, core library only 8KB gzipped

### Use Cases

- **API Layer**: Transform backend DTOs to frontend Models
- **Business Layer**: Bidirectional mapping between Entities and DTOs
- **View Layer**: Convert Models to ViewModels
- **Data Persistence**: Transform domain objects to database entities

## Installation

```bash
pnpm add @orika-js/core
```

Framework integration packages (optional):

```bash
pnpm add @orika-js/react      # React
pnpm add @orika-js/vue3       # Vue 3
pnpm add @orika-js/pinia      # Pinia
pnpm add @orika-js/zustand    # Zustand
pnpm add @orika-js/jotai      # Jotai
```

## Quick Start

### Basic Mapping

```typescript
import { createMapperBuilder, MapperFactory } from '@orika-js/core';

// Define data models
class User {
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

// Configure mapping rules
createMapperBuilder<User, UserDTO>()
  .from(User)
  .to(UserDTO)
  .mapField('username', 'displayName')  // Rename field
  .exclude('password')                  // Exclude sensitive field
  .register();

// Execute mapping
const factory = MapperFactory.getInstance();

// Single object
const dto = factory.map(user, User, UserDTO);

// Batch mapping
const dtos = factory.mapArray(users, User, UserDTO);
```

### Async Field Transformation

Use when you need to fetch related data from other sources.

```typescript
createMapperBuilder<Post, PostDetailDTO>()
  .from(Post)
  .to(PostDetailDTO)
  .forMemberAsync('author', async (src) => {
    const user = await userService.getById(src.authorId);
    return factory.map(user, User, UserDTO);
  })
  .forMemberAsync('comments', async (src) => {
    return await commentService.getByPostId(src.id);
  })
  .register();

// Automatically handles all async operations
const detail = await factory.mapAsync(post, Post, PostDetailDTO);
```

### Custom Transformation Logic

Support for computed fields, conditional mapping, and complex scenarios.

```typescript
createMapperBuilder<Product, ProductDTO>()
  .from(Product)
  .to(ProductDTO)
  // Computed field
  .forMember('totalPrice', (src) => src.price * src.quantity)
  // Conditional mapping
  .mapFieldWhen('discountPrice', 'finalPrice',
    (src) => src.onSale,
    (src) => src.price * (1 - src.discount)
  )
  // Type conversion
  .forMember('createdAt', (src) => new Date(src.createTime))
  .register();
```

### Nested Object Mapping

Handle complex object structures.

```typescript
createMapperBuilder<Order, OrderDTO>()
  .from(Order)
  .to(OrderDTO)
  .forMember('customer', (src) => 
    factory.map(src.user, User, UserDTO)
  )
  .forMember('items', (src) => 
    factory.mapArray(src.orderItems, OrderItem, OrderItemDTO)
  )
  .register();
```

## Real-World Scenarios

### Scenario 1: API Response Transformation

Transform backend API responses to frontend models.

```typescript
// Backend response structure
interface APIResponse {
  user_id: number;
  user_name: string;
  created_at: string;
}

// Frontend data model
class UserModel {
  id: number;
  name: string;
  createdAt: Date;
}

// Configure mapping
createMapperBuilder<APIResponse, UserModel>()
  .from(Object as any)
  .to(UserModel)
  .mapField('user_id', 'id')
  .mapField('user_name', 'name')
  .forMember('createdAt', (src) => new Date(src.created_at))
  .register();

// Usage
const response = await api.getUser();
const user = factory.map(response, Object as any, UserModel);
```

### Scenario 2: Form Data Submission

Convert form data to API request format.

```typescript
createMapperBuilder<FormData, CreateUserRequest>()
  .from(FormData)
  .to(CreateUserRequest)
  .forMember('age', (src) => parseInt(src.age))
  .forMember('tags', (src) => src.tagString.split(','))
  .validate((src, dest) => {
    if (!dest.email.includes('@')) {
      throw new Error('Invalid email format');
    }
  })
  .register();
```

### Scenario 3: List View Data

Prepare optimized data structures for list views.

```typescript
createMapperBuilder<Product, ProductListItemDTO>()
  .from(Product)
  .to(ProductListItemDTO)
  .forMember('displayPrice', (src) => 
    src.onSale ? src.salePrice : src.originalPrice
  )
  .forMember('stockStatus', (src) => {
    if (src.stock === 0) return 'sold-out';
    if (src.stock < 10) return 'low-stock';
    return 'in-stock';
  })
  .register();
```

## Framework Integration

### React

```typescript
import { useMapper, useMemoizedMapper } from '@orika-js/react';

function UserProfile({ user }) {
  // Automatically responds to dependency changes
  const dto = useMemoizedMapper(user, User, UserDTO);
  
  return <div>{dto.displayName}</div>;
}
```

Full documentation: [React Integration Guide](./packages/react)

### Vue 3

```typescript
import { useMapper, mapToReactive } from '@orika-js/vue3';

export default {
  setup() {
    const { map } = useMapper(User, UserDTO);
    
    // Reactive mapping
    const userDTO = mapToReactive(user, User, UserDTO);
    
    return { userDTO };
  }
}
```

Full documentation: [Vue 3 Integration Guide](./packages/vue3)

### State Management

```typescript
// Pinia
import { createPiniaMapperPlugin } from '@orika-js/pinia';
pinia.use(createPiniaMapperPlugin());

// Zustand
import { createMappedStore } from '@orika-js/zustand';
const useStore = createMappedStore(/* ... */);

// Jotai
import { atomWithMapper } from '@orika-js/jotai';
const userDTOAtom = atomWithMapper(userAtom, User, UserDTO);
```

Integration docs: [Pinia](./packages/pinia) • [Zustand](./packages/zustand) • [Jotai](./packages/jotai)

## Ecosystem

| Package | Version | Size | Description |
|---------|---------|------|-------------|
| [@orika-js/core](./packages/core) | [![npm](https://img.shields.io/npm/v/@orika-js/core.svg)](https://www.npmjs.com/package/@orika-js/core) | 8KB | Core mapping engine |
| [@orika-js/react](./packages/react) | [![npm](https://img.shields.io/npm/v/@orika-js/react.svg)](https://www.npmjs.com/package/@orika-js/react) | 3KB | React integration |
| [@orika-js/vue3](./packages/vue3) | [![npm](https://img.shields.io/npm/v/@orika-js/vue3.svg)](https://www.npmjs.com/package/@orika-js/vue3) | 3KB | Vue 3 integration |
| [@orika-js/pinia](./packages/pinia) | [![npm](https://img.shields.io/npm/v/@orika-js/pinia.svg)](https://www.npmjs.com/package/@orika-js/pinia) | 2KB | Pinia plugin |
| [@orika-js/zustand](./packages/zustand) | [![npm](https://img.shields.io/npm/v/@orika-js/zustand.svg)](https://www.npmjs.com/package/@orika-js/zustand) | 2KB | Zustand middleware |
| [@orika-js/jotai](./packages/jotai) | [![npm](https://img.shields.io/npm/v/@orika-js/jotai.svg)](https://www.npmjs.com/package/@orika-js/jotai) | 2KB | Jotai integration |

## Documentation & Resources

- **[Core Documentation](./packages/core)** - Complete API reference and usage guide
- **[Examples](./examples)** - Practical examples from basic to advanced
- **[Best Practices](./packages/core#best-practices)** - Production environment recommendations
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Development mode
pnpm dev

# Run examples
pnpm --filter react-demo dev
```

## Contributing

Contributions are welcome! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

[MIT](./LICENSE) © [Steven Lee](https://github.com/stevenleep)

---

Inspired by [Orika](https://orika-mapper.github.io/orika-docs/) (Java) and [AutoMapper](https://automapper.org/) (.NET)
