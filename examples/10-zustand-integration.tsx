/**
 * Zustand 集成示例
 * 演示如何在 Zustand 状态管理中使用 orika-js 自动映射
 */

import React from 'react';
import { createMappedStore, useMappedState, mapperMiddleware } from '../packages/zustand/src';
import { MapField, MapTo, Transform, createMappingFromDecorators } from '../packages/core/src';

// ========== 示例 1: 基础映射 Store ==========

console.log('📦 Zustand 集成示例\n');
console.log('1️⃣  基础映射 Store\n');

class UserState {
  id: number = 0;
  name: string = '';
  email: string = '';
}

class UserDTO {
  userId: number = 0;
  displayName: string = '';
  contact: string = '';
}

// 配置映射
const userMapper = createMappingFromDecorators<UserState, UserDTO>(
  (() => {
    @MapTo(UserDTO)
    class UserStateWithMapping {
      @MapField('userId')
      id: number = 0;
      
      @MapField('displayName')
      name: string = '';
      
      @MapField('contact')
      @Transform((v: string) => v.toLowerCase())
      email: string = '';
    }
    return UserStateWithMapping;
  })()
);

// 创建映射 store
const useUserStore = createMappedStore<UserState, UserDTO>({
  sourceClass: UserState,
  dtoClass: UserDTO,
  mapper: userMapper,
})((set) => ({
  id: 0,
  name: '',
  email: '',
  setName: (name: string) => set({ name }),
  setEmail: (email: string) => set({ email }),
  setUser: (user: Partial<UserState>) => set(user),
}));

// 测试 store
const state1 = useUserStore.getState();
console.log('初始状态:', { id: state1.id, name: state1.name, email: state1.email });

// 使用内置的映射方法
const dto1 = useUserStore.mapState();
console.log('映射后的 DTO:', dto1);

// 更新状态
useUserStore.getState().setUser({ id: 1, name: 'Alice', email: 'ALICE@EXAMPLE.COM' });
const dto2 = useUserStore.mapState();
console.log('更新后的 DTO:', dto2);
console.log();

// ========== 示例 2: 带中间件的 Store ==========

console.log('2️⃣  带中间件的 Store\n');

class ProductState {
  id: number = 0;
  name: string = '';
  price: number = 0;
}

class ProductDTO {
  productId: number = 0;
  productName: string = '';
  displayPrice: string = '';
}

const productMapper = createMappingFromDecorators<ProductState, ProductDTO>(
  (() => {
    @MapTo(ProductDTO)
    class ProductStateWithMapping {
      @MapField('productId')
      id: number = 0;
      
      @MapField('productName')
      name: string = '';
      
      @MapField('displayPrice')
      @Transform((v: number) => `$${v.toFixed(2)}`)
      price: number = 0;
    }
    return ProductStateWithMapping;
  })()
);

// 使用 mapper 中间件
const useProductStore = ((set: any) => 
  mapperMiddleware(
    (set) => ({
      id: 0,
      name: '',
      price: 0,
      updateProduct: (product: Partial<ProductState>) => set(product),
    }),
    {
      mapper: productMapper,
      log: true,
      onMapped: (state, dto) => {
        console.log('[中间件] 状态已映射:', dto);
      },
    }
  )(set, useProductStore.getState, useProductStore)
) as any;

console.log('产品 Store 创建完成\n');

// ========== 示例 3: 使用 Hook 映射状态 ==========

console.log('3️⃣  使用 Hook 映射状态（模拟）\n');

// 模拟 useMappedState 的行为
const currentState = useUserStore.getState();
const mappedDTO = userMapper.map({ 
  id: currentState.id, 
  name: currentState.name, 
  email: currentState.email 
});

console.log('当前状态:', { 
  id: currentState.id, 
  name: currentState.name, 
  email: currentState.email 
});
console.log('映射后:', mappedDTO);
console.log();

// ========== 示例 4: 复杂映射场景 ==========

console.log('4️⃣  复杂映射场景\n');

class OrderState {
  orderId: string = '';
  items: Array<{ name: string; price: number }> = [];
  status: string = 'pending';
  createdAt: Date = new Date();
}

class OrderDTO {
  id: string = '';
  itemCount: number = 0;
  totalAmount: number = 0;
  statusLabel: string = '';
  createdDate: string = '';
}

const orderMapper = createMappingFromDecorators<OrderState, OrderDTO>(
  (() => {
    @MapTo(OrderDTO)
    class OrderStateWithMapping {
      @MapField('id')
      orderId: string = '';
      
      @MapField('itemCount')
      @Transform((_, source: OrderState) => source.items.length)
      items: any[] = [];
      
      @MapField('totalAmount')
      @Transform((_, source: OrderState) => 
        source.items.reduce((sum, item) => sum + item.price, 0)
      )
      items2: any[] = [];
      
      @MapField('statusLabel')
      @Transform((v: string) => v ? v.toUpperCase() : 'PENDING')
      status: string = '';
      
      @MapField('createdDate')
      @Transform((v: Date) => v.toISOString())
      createdAt: Date = new Date();
    }
    return OrderStateWithMapping;
  })()
);

const useOrderStore = createMappedStore<OrderState, OrderDTO>({
  sourceClass: OrderState,
  dtoClass: OrderDTO,
  mapper: orderMapper,
})((set) => ({
  orderId: '',
  items: [],
  status: 'pending',
  createdAt: new Date(),
  addItem: (item: { name: string; price: number }) =>
    set((state) => ({ items: [...state.items, item] })),
}));

// 测试
useOrderStore.getState().addItem({ name: 'Product 1', price: 99.99 });
useOrderStore.getState().addItem({ name: 'Product 2', price: 149.99 });

const orderDTO = useOrderStore.mapState();
console.log('订单 DTO:', orderDTO);
console.log();

console.log('✅ Zustand 集成示例完成！\n');

// ========== React 组件示例（仅展示代码结构）==========

/*
function UserProfile() {
  const user = useUserStore();
  const userDTO = useMappedState(useUserStore, useUserStore.mapper);
  
  return (
    <div>
      <h1>{userDTO.displayName}</h1>
      <p>Contact: {userDTO.contact}</p>
      <button onClick={() => user.setName('New Name')}>
        Update Name
      </button>
    </div>
  );
}

function ProductList() {
  const products = useProductStore((state) => state);
  const productDTO = useProductStore.mapState();
  
  return (
    <div>
      <h2>{productDTO.productName}</h2>
      <p>Price: {productDTO.displayPrice}</p>
    </div>
  );
}
*/

console.log('📚 React 组件使用方式：');
console.log('```typescript');
console.log('function UserProfile() {');
console.log('  const userDTO = useMappedState(useUserStore, useUserStore.mapper);');
console.log('  return <div>{userDTO.displayName}</div>;');
console.log('}');
console.log('```\n');

