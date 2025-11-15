# Pinia Integration Example

This example demonstrates how to use `@orika-js/pinia` plugin to add object mapping capabilities to Pinia stores.

## Features Demonstrated

- ✅ Setting up Pinia with mapper plugin
- ✅ Using `$mapper` in store actions
- ✅ Mapping API responses to domain models
- ✅ Combining with Vue 3 composables (optional)

## Project Structure

```
src/
├── main.ts              # App setup with Pinia plugin
├── models/
│   ├── User.ts         # Domain models
│   ├── UserDTO.ts      # API DTOs
│   └── mappings.ts     # Mapping configurations
├── stores/
│   └── userStore.ts    # Pinia store using $mapper
├── services/
│   └── api.ts          # API service
└── App.vue             # Demo component
```

## Key Concepts

### 1. Plugin Setup

The mapper plugin is registered with Pinia globally:

```typescript
import { createPinia } from 'pinia';
import { createPiniaMapperPlugin } from '@orika-js/pinia';

const pinia = createPinia();
pinia.use(createPiniaMapperPlugin({ debug: true }));
```

### 2. Store Usage

All stores automatically get `$mapper` methods:

```typescript
const userStore = defineStore('user', {
  actions: {
    async fetchUsers() {
      const dtos = await api.getUsers();
      // $mapper is available in all stores
      this.users = this.$mapper.mapArray(dtos, UserDTO, User);
    }
  }
});
```

### 3. Independent Packages

- `@orika-js/pinia` - For Pinia stores
- `@orika-js/vue3` - For Vue 3 composables (optional)

These packages are independent. Install only what you need!

## Running the Example

```bash
pnpm install
pnpm dev
```

## Learn More

- [Pinia Package Documentation](../../packages/pinia/README.md)
- [Core Package Documentation](../../packages/core/README.md)

